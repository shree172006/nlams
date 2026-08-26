/**
 * NLAMS Statutory Workflow & Valuation Engine (JavaScript)
 * Implements RFCTLARR Act 2013 First Schedule (Sections 26-30) and Sectoral Acts (NH Act 1956).
 */

const STATUTORY_STAGES = [
  "1. Proposal Ingestion & Alignment Scrutiny",
  "2. Social Impact Assessment (SIA)",
  "3. Preliminary Notification & Freezing (Sec 11/3A)",
  "4. Objection Management & Inquiry (Sec 15/3C)",
  "5. Declaration of Acquisition (Sec 19/3D)",
  "6. Valuation, Award & Compensation (Sec 23/26-30/3G)",
  "7. Rehabilitation & Resettlement (R&R)",
  "8. Physical Possession & Land Mutation (Sec 38/3E)",
  "9. Dispute & Reference Monitoring (Sec 51-74)"
];

const RURAL_MULTIPLIERS = {
  "URBAN": 1.00,
  "RURAL_CLOSE": 1.25,
  "RURAL_MID": 1.50,
  "RURAL_REMOTE": 2.00
};

/**
 * Computes statutory award under RFCTLARR Act 2013 First Schedule:
 * 1. Baseline Market Value = max(Circle Rate, Avg 3-Yr Deeds, PPP Rate) * Acquired Area
 * 2. Multiplication Factor = 1.00 (Urban) to 2.00 (Rural)
 * 3. Adjusted Market Value = Baseline Market Value * Multiplication Factor
 * 4. Base Compensation = Adjusted Market Value + Assets (Trees + Structures + Crops)
 * 5. Solatium = 100% of Base Compensation (Sec 30(1))
 * 6. Additional Amount = 12% p.a. on Market Value from Sec 11 to Award Date (Sec 30(3))
 * 7. Total Gross Award = Base Compensation + Solatium + Additional Amount
 */
function calculateStatutoryValuation(req) {
  const ownerName = req.owner_name || "Shri Ramcharan Yadav";
  const acquiredAreaSqm = parseFloat(req.acquired_area_sqm) || 3500.0;
  const landType = (req.land_type || "RURAL_REMOTE").toUpperCase();
  const circleRate = parseFloat(req.circle_rate_per_sqm) || 0.0;
  const saleRate = parseFloat(req.avg_registered_sale_rate_per_sqm) || 0.0;
  const pppRate = parseFloat(req.ppp_consented_rate_per_sqm) || 0.0;
  const structVal = parseFloat(req.structure_valuation) || 0.0;
  const treeVal = parseFloat(req.tree_valuation) || 0.0;
  const cropVal = parseFloat(req.crop_valuation) || 0.0;
  const notifDate = req.notification_date || "2025-05-15";
  const awardDate = req.award_date || "2026-03-01";

  // 1. Base rate per sq.m determination
  const baseRatePerSqm = Math.max(circleRate, saleRate, pppRate);
  const baseMarketValueTotal = +(baseRatePerSqm * acquiredAreaSqm).toFixed(2);

  // 2. Multiplication Factor
  const multFactor = RURAL_MULTIPLIERS[landType] !== undefined ? RURAL_MULTIPLIERS[landType] : 1.50;
  const adjustedMarketValue = +(baseMarketValueTotal * multFactor).toFixed(2);

  // 3. Immovable Assets (Sec 29)
  const assetsTotal = +(structVal + treeVal + cropVal).toFixed(2);

  // 4. Base Compensation
  const baseCompensation = +(adjustedMarketValue + assetsTotal).toFixed(2);

  // 5. Mandatory 100% Solatium (Sec 30(1))
  const solatiumAmount = +(baseCompensation * 1.0).toFixed(2);

  // 6. Additional Amount (Sec 30(3) - 12% per annum)
  let daysElapsed = 290;
  try {
    const d1 = new Date(notifDate);
    const d2 = new Date(awardDate);
    const diffTime = d2.getTime() - d1.getTime();
    if (!isNaN(diffTime)) {
      daysElapsed = Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
    }
  } catch (e) {
    daysElapsed = 290;
  }

  const annualRate = 0.12;
  const additionalAmount12pct = +(baseMarketValueTotal * annualRate * (daysElapsed / 365.0)).toFixed(2);

  // 7. Total Gross Award
  const grossTotalAward = +(baseCompensation + solatiumAmount + additionalAmount12pct).toFixed(2);

  return {
    owner_name: ownerName,
    acquired_area_sqm: acquiredAreaSqm,
    land_type: landType,
    base_market_value_per_sqm: baseRatePerSqm,
    base_market_value_total: baseMarketValueTotal,
    multiplication_factor: multFactor,
    adjusted_market_value: adjustedMarketValue,
    assets_valuation_total: assetsTotal,
    base_compensation: baseCompensation,
    solatium_amount: solatiumAmount,
    additional_amount_12pct: additionalAmount12pct,
    days_elapsed_notif_to_award: daysElapsed,
    gross_total_award: grossTotalAward
  };
}

/**
 * Advances a project to the next statutory stage and executes stage-specific actions.
 */
function advanceProjectState(project, db) {
  let currIdx = -1;
  for (let idx = 0; idx < STATUTORY_STAGES.length; idx++) {
    const stgPrefix = STATUTORY_STAGES[idx].split('.')[0];
    if (project.current_stage && project.current_stage.startsWith(stgPrefix)) {
      currIdx = idx;
      break;
    }
  }

  if (currIdx === -1) {
    currIdx = 0;
  }

  if (currIdx >= STATUTORY_STAGES.length - 1) {
    return { advanced: false, message: "Project is already at final statutory stage (Sec 51-74)" };
  }

  const nextStage = STATUTORY_STAGES[currIdx + 1];
  const newProgressPct = +(((currIdx + 2) / STATUTORY_STAGES.length) * 100).toFixed(1);

  // Update project in database
  db.updateProject(project.id, {
    current_stage: nextStage,
    stage_progress_pct: newProgressPct
  });

  // Stage side-effects
  if (nextStage.includes("Sec 11")) {
    db.updateParcelsByProject(project.id, {
      encumbrance_locked: 1,
      status: "NOTIFIED"
    });
  } else if (nextStage.includes("Sec 38")) {
    db.updateProject(project.id, {
      physical_possession_pct: 100.0
    });
    db.updateParcelsByProject(project.id, {
      encumbrance_locked: 0,
      status: "ACQUIRED"
    });
  }

  const updatedProject = db.getProjectById(project.id);

  return {
    advanced: true,
    new_stage: updatedProject.current_stage,
    progress_pct: updatedProject.stage_progress_pct,
    project: updatedProject
  };
}

module.exports = {
  STATUTORY_STAGES,
  RURAL_MULTIPLIERS,
  calculateStatutoryValuation,
  advanceProjectState
};
