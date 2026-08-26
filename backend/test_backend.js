/**
 * NLAMS Backend Statutory & Unit Tests (JavaScript)
 * Verifies RFCTLARR First Schedule math, state machine transitions, AI delay predictor, Auth/RBAC, and Field Surveys.
 */

const assert = require('assert');
const http = require('http');
const app = require('./server');
const { calculateStatutoryValuation, advanceProjectState } = require('./statutory_engine');
const { predictProjectDelay } = require('./ml_delay_predictor');
const db = require('./db');

let server;
const PORT = 8002; // Use isolated test port
const BASE_URL = `http://127.0.0.1:${PORT}`;

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting NLAMS JavaScript Backend Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(err);
      failed++;
    }
  }

  // 1. Math test
  await test('Statutory First Schedule Math (RFCTLARR 2013)', () => {
    const req = {
      owner_name: "Shri Ramcharan Yadav",
      acquired_area_sqm: 3500.0,
      land_type: "RURAL_REMOTE", // 2.0x
      circle_rate_per_sqm: 1850.0,
      avg_registered_sale_rate_per_sqm: 2400.0,
      ppp_consented_rate_per_sqm: 0.0,
      structure_valuation: 350000.0,
      tree_valuation: 45000.0,
      crop_valuation: 25000.0,
      notification_date: "2025-05-15",
      award_date: "2026-03-01"
    };

    const val = calculateStatutoryValuation(req);

    assert.strictEqual(val.base_market_value_per_sqm, 2400.0);
    assert.strictEqual(val.base_market_value_total, 8400000.0);
    assert.strictEqual(val.multiplication_factor, 2.0);
    assert.strictEqual(val.adjusted_market_value, 16800000.0);
    assert.strictEqual(val.assets_valuation_total, 420000.0);
    assert.strictEqual(val.base_compensation, 17220000.0);
    assert.strictEqual(val.solatium_amount, 17220000.0);
    assert.ok(val.additional_amount_12pct > 0.0);
    const expectedGross = +(val.base_compensation + val.solatium_amount + val.additional_amount_12pct).toFixed(2);
    assert.strictEqual(val.gross_total_award, expectedGross);
  });

  // Start test server
  await new Promise((resolve) => {
    server = app.listen(PORT, '127.0.0.1', resolve);
  });

  // 2. API Root
  await test('GET / Root Metadata Endpoint', async () => {
    const res = await makeRequest('GET', '/');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.system.includes('NLAMS'));
  });

  // 3. Officer Authentication & RBAC
  await test('Officer Auth & Citizen Open Access (/api/auth/login, /api/auth/me)', async () => {
    // Unauthenticated -> Public Citizen
    const resPub = await makeRequest('GET', '/api/auth/me');
    assert.strictEqual(resPub.status, 200);
    assert.strictEqual(resPub.body.user.role, 'CITIZEN');

    // Officer Login (Collector)
    const resLogin = await makeRequest('POST', '/api/auth/login', { role: 'COLLECTOR' });
    assert.strictEqual(resLogin.status, 200);
    assert.strictEqual(resLogin.body.user.role, 'COLLECTOR');
    assert.ok(resLogin.body.user.token);

    // Authenticated profile
    const token = resLogin.body.user.token;
    const resAuth = await makeRequest('GET', '/api/auth/me', null, { Authorization: `Bearer ${token}` });
    assert.strictEqual(resAuth.status, 200);
    assert.strictEqual(resAuth.body.user.role, 'COLLECTOR');
  });

  // 4. National Metrics API
  await test('GET /api/national-metrics', async () => {
    const res = await makeRequest('GET', '/api/national-metrics');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.total_active_projects >= 4);
    assert.ok(res.body.total_cadastral_parcels_tracked >= 4);
  });

  // 5. Projects List & Single
  await test('GET /api/projects & /api/projects/:id', async () => {
    const res = await makeRequest('GET', '/api/projects');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length >= 4);

    const firstId = res.body[0].id;
    const resSingle = await makeRequest('GET', `/api/projects/${firstId}`);
    assert.strictEqual(resSingle.status, 200);
    assert.strictEqual(resSingle.body.id, firstId);
    assert.ok(Array.isArray(resSingle.body.parcels));
  });

  // 6. Statutory Valuation Calculation API
  await test('POST /api/calculate-valuation', async () => {
    const res = await makeRequest('POST', '/api/calculate-valuation?acquired_area_sqm=5000&circle_rate_per_sqm=2000&avg_registered_sale_rate_per_sqm=2500&land_type=RURAL_CLOSE');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.base_market_value_per_sqm, 2500);
    assert.strictEqual(res.body.multiplication_factor, 1.25);
    assert.ok(res.body.gross_total_award > 0);
  });

  // 7. AI Delay Predictor
  await test('POST /api/predict-delay', async () => {
    const payload = {
      area_ha: 350.0,
      num_parcels: 120,
      disputed_parcels_count: 18,
      multiplication_factor: 1.5,
      forest_overlap_flag: 1,
      dwell_time_days: 140
    };
    const res = await makeRequest('POST', '/api/predict-delay', payload);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.predicted_delay_days > 0);
    assert.ok(res.body.risk_score > 0);
    assert.ok(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(res.body.risk_level));
  });

  // 8. Citizen Lookup
  await test('GET /api/citizen-lookup', async () => {
    const res = await makeRequest('GET', '/api/citizen-lookup?query=Ramcharan');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length > 0);
    assert.ok(res.body[0].parcel.owner_name.includes('Ramcharan'));
    assert.ok(res.body[0].valuation_estimate.gross_total_award > 0);
  });

  // 9. Objections Lifecycle
  await test('Section 15 Objections Lifecycle (File -> Schedule -> Dispose)', async () => {
    const prjId = 'PRJ-NHAI-2026-UP01';
    
    const resFile = await makeRequest('POST', `/api/projects/${prjId}/objections?claimant_name=TestClaimant&contact_phone=9999988888&ulpin=IN09UP23456701&grounds_category=Inadequate%20Valuation&objection_details=TestDetails`);
    assert.strictEqual(resFile.status, 200);
    const objId = resFile.body.objection_id;

    const resSched = await makeRequest('POST', `/api/projects/${prjId}/objections/${objId}/schedule-hearing?hearing_date=2026-04-10`);
    assert.strictEqual(resSched.status, 200);

    const resDisp = await makeRequest('POST', `/api/projects/${prjId}/objections/${objId}/dispose?status=DISPOSED_UPHELD&reasoned_order_summary=AwardAdjusted`);
    assert.strictEqual(resDisp.status, 200);
    assert.strictEqual(resDisp.body.status, 'DISPOSED_UPHELD');
  });

  // 10. Field Survey Sync from Flutter App
  await test('POST /api/field-surveys/sync (Mobile Survey App Integration)', async () => {
    const surveyPayload = [{
      id: "SRV-TEST-001",
      ulpin: "IN09UP23456701",
      project_id: "PRJ-NHAI-2026-UP01",
      surveyor_name: "Shri S. K. Sharma",
      surveyor_id: "SURV-UP-042",
      structure_valuation: 375000.0,
      tree_valuation: 48000.0,
      crop_valuation: 28000.0,
      asset_details: {
        plinth_area_sqm: 120,
        structure_type: "PUCCA_RCC",
        borewells_count: 1,
        fruit_bearing_trees: 14
      },
      non_owner_claimants: [
        { name: "Shri Birju Paswan", type: "AGRICULTURAL_LABORER" }
      ],
      photo_urls: ["https://example.com/survey1.jpg"]
    }];

    const resSync = await makeRequest('POST', '/api/field-surveys/sync', surveyPayload);
    assert.strictEqual(resSync.status, 200);
    assert.strictEqual(resSync.body.status, 'SYNC_SUCCESS');
    assert.strictEqual(resSync.body.synced_count, 1);
  });

  // 11. Joint Khata Splitting
  await test('POST /api/parcels/:ulpin/split-khata', async () => {
    const heirs = [
      { name: "Heir A", share_pct: 60.0, share_sqm: 1920.0 },
      { name: "Heir B", share_pct: 40.0, share_sqm: 1280.0 }
    ];
    const res = await makeRequest('POST', '/api/parcels/IN09UP23456701/split-khata', { heirs });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.total_heirs, 2);
  });

  // 12. LARRDA Dispute Reference
  await test('GET & POST /api/larrda-references', async () => {
    const resGet = await makeRequest('GET', '/api/larrda-references');
    assert.strictEqual(resGet.status, 200);
    assert.ok(Array.isArray(resGet.body));

    const resPost = await makeRequest('POST', '/api/larrda-references', {
      project_id: "PRJ-NHAI-2026-UP01",
      ulpin: "IN09UP23456701",
      claimant_name: "Shri Ramcharan Yadav",
      ground_type: "VALUATION"
    });
    assert.strictEqual(resPost.status, 200);
    assert.strictEqual(resPost.body.status, 'success');
  });

  // Close test server
  server.close();

  console.log(`\n===================================`);
  console.log(`Test Summary: ${passed} passed, ${failed} failed`);
  console.log(`===================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test runner fatal error:', err);
  if (server) server.close();
  process.exit(1);
});
