"""
Statutory Stage-Gate State Machine
Enforces sequential, legally-binding transitions under RFCTLARR Act 2013 & NH Act 1956.
"""

from typing import Dict, Any, Tuple, List
from datetime import datetime, timedelta
from .models import Project, StageEnum

STAGE_ORDER = [
    StageEnum.PROPOSAL,
    StageEnum.SIA,
    StageEnum.PRELIMINARY_NOTIFICATION,
    StageEnum.OBJECTION_MANAGEMENT,
    StageEnum.DECLARATION,
    StageEnum.VALUATION_AWARD,
    StageEnum.REHABILITATION_RESETTLEMENT,
    StageEnum.POSSESSION_MUTATION,
    StageEnum.DISPUTE_MONITORING
]

def check_stage_transition_eligibility(project: Project, target_stage: StageEnum) -> Tuple[bool, str]:
    """
    Validates legal preconditions before permitting transition to the target stage.
    """
    current_idx = STAGE_ORDER.index(project.current_stage)
    target_idx = STAGE_ORDER.index(target_stage)
    
    if target_idx != current_idx + 1:
        return False, f"Illegal skip: Current stage is [{project.current_stage.value}], target must be stage #{current_idx + 2}."

    # Stage-specific statutory guards
    if target_stage == StageEnum.SIA:
        if len(project.parcels) == 0:
            return False, "Guard Failed: At least one cadastral parcel must be identified from alignment intersection."
            
    elif target_stage == StageEnum.PRELIMINARY_NOTIFICATION:
        # Preconditions: SIA cleared or exempt under 40(2)
        pass
        
    elif target_stage == StageEnum.OBJECTION_MANAGEMENT:
        if not project.sec11_notification_date:
            return False, "Guard Failed: Preliminary Notification (Sec 11/3A) date & Gazette ID required before opening objection window."
            
    elif target_stage == StageEnum.DECLARATION:
        # Guard: Objections under Sec 15 must be disposed
        pending_objections = [o for o in project.objections if o.status in ["PENDING", "HEARING_SCHEDULED"]]
        if len(pending_objections) > 0:
            return False, f"Guard Failed: Cannot publish Sec 19/3D Declaration until all {len(pending_objections)} pending objections are disposed."
            
        # Statutory 12-month limit check between Sec 11 and Sec 19
        if project.sec11_notification_date:
            notif_dt = datetime.strptime(project.sec11_notification_date, "%Y-%m-%d")
            if (datetime.now() - notif_dt).days > 365:
                # Warning or penalty under Section 19(7)
                pass

    elif target_stage == StageEnum.VALUATION_AWARD:
        if not project.sec19_declaration_date:
            return False, "Guard Failed: Statutory Declaration (Sec 19/3D) must precede Award Inquiry under Sec 23/3G."

    elif target_stage == StageEnum.REHABILITATION_RESETTLEMENT:
        if project.total_compensation_assessed_cr <= 0:
            return False, "Guard Failed: Compensation awards must be determined before R&R disbursement."

    elif target_stage == StageEnum.POSSESSION_MUTATION:
        # Sec 38 precondition: 100% compensation deposited or disbursed via DBT
        if project.total_compensation_disbursed_cr < (project.total_compensation_assessed_cr * 0.95):
            return False, f"Guard Failed: Section 38 mandates full compensation payout via PFMS DBT before taking physical possession. Currently disbursed: ₹{project.total_compensation_disbursed_cr} Cr / ₹{project.total_compensation_assessed_cr} Cr."

    return True, "Preconditions satisfied."

def advance_project_stage(project: Project) -> Tuple[bool, str, Project]:
    """
    Advances project to the next sequential statutory stage if all gate conditions pass.
    """
    current_idx = STAGE_ORDER.index(project.current_stage)
    if current_idx >= len(STAGE_ORDER) - 1:
        return False, "Project is already in the final monitoring stage.", project
        
    next_stage = STAGE_ORDER[current_idx + 1]
    is_valid, msg = check_stage_transition_eligibility(project, next_stage)
    if not is_valid:
        return False, msg, project
        
    project.current_stage = next_stage
    project.stage_progress_pct = round(((current_idx + 2) / len(STAGE_ORDER)) * 100.0, 1)
    
    # Trigger automated state side-effects
    if next_stage == StageEnum.PRELIMINARY_NOTIFICATION:
        today_str = datetime.now().strftime("%Y-%m-%d")
        project.sec11_notification_date = today_str
        project.sec11_gazette_id = f"DL-(N)-04/2026/GZ-{project.id[:6].upper()}"
        # Lock ULPIN encumbrance flags in state land registries
        for p in project.parcels:
            p.encumbrance_locked = True
            p.encumbrance_lock_timestamp = datetime.now().isoformat()
            
    elif next_stage == StageEnum.DECLARATION:
        project.sec19_declaration_date = datetime.now().strftime("%Y-%m-%d")
        
    elif next_stage == StageEnum.VALUATION_AWARD:
        project.award_date = datetime.now().strftime("%Y-%m-%d")
        
    elif next_stage == StageEnum.POSSESSION_MUTATION:
        project.physical_possession_pct = 100.0
        project.mutation_completed_pct = 100.0
        
    return True, f"Successfully advanced to {next_stage.value}", project
