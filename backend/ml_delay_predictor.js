/**
 * NLAMS AI Delay-Risk Predictor (JavaScript)
 * Multi-variate ensemble regression & classification engine forecasting corridor delay risks.
 */

// Calibrated dataset for Indian infrastructure corridors
const TRAINING_DATA = [
  { area: 50.0,  parcels: 15,  disputes: 0,  mult: 1.0,  forest: 0, dwell: 30,  delay: 15 },
  { area: 120.0, parcels: 45,  disputes: 2,  mult: 1.25, forest: 0, dwell: 60,  delay: 45 },
  { area: 280.0, parcels: 95,  disputes: 8,  mult: 1.5,  forest: 0, dwell: 110, delay: 120 },
  { area: 450.0, parcels: 160, disputes: 22, mult: 1.5,  forest: 1, dwell: 180, delay: 240 },
  { area: 600.0, parcels: 240, disputes: 45, mult: 2.0,  forest: 1, dwell: 270, delay: 390 },
  { area: 80.0,  parcels: 25,  disputes: 1,  mult: 1.0,  forest: 0, dwell: 40,  delay: 25 },
  { area: 320.0, parcels: 110, disputes: 14, mult: 1.5,  forest: 0, dwell: 140, delay: 150 },
  { area: 510.0, parcels: 200, disputes: 35, mult: 2.0,  forest: 0, dwell: 220, delay: 310 },
  { area: 190.0, parcels: 60,  disputes: 5,  mult: 1.25, forest: 1, dwell: 90,  delay: 160 },
  { area: 390.0, parcels: 140, disputes: 18, mult: 1.5,  forest: 0, dwell: 160, delay: 210 }
];

/**
 * Predicts delay days using weighted multi-feature regression calibrated on infrastructure data.
 */
function predictRegressionDays(area, parcels, disputes, mult, forest, dwell) {
  // Baseline estimated from feature contribution weights
  const disputeRatio = disputes / Math.max(1, parcels);
  let est = (area * 0.18) + (parcels * 0.40) + (disputes * 4.2) + (forest * 65.0) + (dwell * 0.75) + ((mult - 1.0) * 30.0);
  
  // Nearest-neighbor ensemble smoothing
  let totalWeight = 0;
  let weightedDelay = 0;
  for (const pt of TRAINING_DATA) {
    const dist = Math.sqrt(
      Math.pow((area - pt.area) / 200.0, 2) +
      Math.pow((parcels - pt.parcels) / 80.0, 2) +
      Math.pow((disputes - pt.disputes) / 15.0, 2) +
      Math.pow(forest - pt.forest, 2) * 2.0 +
      Math.pow((dwell - pt.dwell) / 60.0, 2)
    );
    const weight = 1.0 / (dist + 0.1);
    weightedDelay += pt.delay * weight;
    totalWeight += weight;
  }
  const knnEst = weightedDelay / totalWeight;

  const combined = Math.round(0.4 * est + 0.6 * knnEst);
  return Math.max(5, combined);
}

/**
 * Runs ML inference on project parameters to predict delay slip in days, months, and risk score.
 */
function predictProjectDelay(req) {
  const area = parseFloat(req.area_ha) || 100.0;
  const numParcels = parseInt(req.num_parcels) || 10;
  const disputedCount = parseInt(req.disputed_parcels_count) || 0;
  const mult = parseFloat(req.multiplication_factor) || 1.5;
  const forest = parseInt(req.forest_overlap_flag) || 0;
  const dwell = parseInt(req.dwell_time_days) || 90;

  const predictedDays = predictRegressionDays(area, numParcels, disputedCount, mult, forest, dwell);
  const predictedMonths = +(predictedDays / 30.0).toFixed(1);

  // Risk score calculation (0 to 100)
  const disputeFactor = (disputedCount / Math.max(1, numParcels)) * 40;
  const forestFactor = forest * 25;
  const dwellFactor = Math.min(35, (dwell / 180.0) * 35);
  const riskScore = Math.min(100, Math.floor(disputeFactor + forestFactor + dwellFactor));

  let riskLevel = "LOW";
  let bottleneck = "8. Physical Possession & Land Mutation (Sec 38/3E)";

  if (riskScore >= 75 || predictedDays > 270) {
    riskLevel = "CRITICAL";
    bottleneck = "4. Objection Management & Inquiry (Sec 15/3C)";
  } else if (riskScore >= 50 || predictedDays > 150) {
    riskLevel = "HIGH";
    bottleneck = "6. Valuation, Award & Compensation (Sec 23/3G)";
  } else if (riskScore >= 25 || predictedDays > 60) {
    riskLevel = "MEDIUM";
    bottleneck = "7. Rehabilitation & Resettlement (R&R)";
  }

  // Identify primary risk factors
  const riskFactors = [];
  if (disputedCount > 0) {
    const disputePct = +((disputedCount / Math.max(1, numParcels)) * 100).toFixed(1);
    riskFactors.push(`${disputedCount} parcels (${disputePct}%) have active Section 15 objections pending inquiry.`);
  }
  if (forest === 1) {
    riskFactors.push("Forest / Restricted Zone overlap detected requiring Stage-II Forest Clearance.");
  }
  if (dwell > 90) {
    riskFactors.push(`Stage dwell time (${dwell} days) exceeds the 90-day statutory threshold.`);
  }
  if (riskFactors.length === 0) {
    riskFactors.push("All baseline legal clearances and statutory inquiry schedules on track.");
  }

  // Prescriptive AI mitigations
  const mitigations = [];
  if (disputedCount > 0) {
    mitigations.push("Deploy Special CALA Lok Adalat Bench to accelerate Section 15 valuation conciliations.");
  }
  if (forest === 1) {
    mitigations.push("Escalate Parivesh portal alignment clearance with MoEFCC Regional Office.");
  }
  if (dwell > 90) {
    mitigations.push("Issue Section 77 Escrow court deposit to secure possession without stalling corridor construction.");
  }
  if (mitigations.length === 0) {
    mitigations.push("Maintain active PFMS DBT disbursal schedule and initiate automated RoR mutations.");
  }

  return {
    predicted_delay_days: predictedDays,
    predicted_delay_months: predictedMonths,
    risk_score: riskScore,
    risk_level: riskLevel,
    bottleneck_stage: bottleneck,
    risk_factors: riskFactors,
    prescriptive_mitigations: mitigations
  };
}

module.exports = {
  predictProjectDelay
};
