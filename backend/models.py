"""
SQLAlchemy ORM Data Models for NLAMS
"""
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    acquiring_agency = Column(String, nullable=False)
    statutory_act = Column(String, nullable=False)
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    total_length_km = Column(Float, default=0.0)
    total_corridor_area_ha = Column(Float, default=0.0)
    current_stage = Column(String, default="DRAFT_PROPOSAL")
    stage_progress_pct = Column(Float, default=0.0)
    total_compensation_assessed_cr = Column(Float, default=0.0)
    total_compensation_disbursed_cr = Column(Float, default=0.0)
    physical_possession_pct = Column(Float, default=0.0)
    alignment_coordinates = Column(JSON, default=list)

    parcels = relationship("Parcel", back_populates="project", cascade="all, delete-orphan")
    objections = relationship("Objection", back_populates="project", cascade="all, delete-orphan")
    rr_families = relationship("RRFamily", back_populates="project", cascade="all, delete-orphan")


class Parcel(Base):
    __tablename__ = "parcels"

    ulpin = Column(String(14), primary_key=True, index=True)  # 14-digit Bhu-Aadhaar
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    local_record_no = Column(String, nullable=False)  # Khasra / Survey No.
    village = Column(String, nullable=False)
    district = Column(String, nullable=False)
    state = Column(String, nullable=False)
    land_type = Column(String, default="RURAL_REMOTE")
    acquired_area_sqm = Column(Float, nullable=False)
    circle_rate_per_sqm = Column(Float, nullable=False)
    avg_registered_sale_rate_per_sqm = Column(Float, nullable=False)
    owner_name = Column(String, nullable=False)
    owner_aadhaar_masked = Column(String, nullable=False)
    bank_ifsc = Column(String, default="SBIN0001234")
    bank_account_masked = Column(String, default="XXXX-XXXX-9876")
    encumbrance_locked = Column(Boolean, default=False)
    status = Column(String, default="PROPOSED")  # PROPOSED, NOTIFIED, DISPUTED, ACQUIRED
    coordinates_polygon = Column(JSON, default=list)

    project = relationship("Project", back_populates="parcels")
    objections = relationship("Objection", back_populates="parcel", cascade="all, delete-orphan")
    award = relationship("Award", back_populates="parcel", uselist=False, cascade="all, delete-orphan")


class Objection(Base):
    __tablename__ = "objections"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    ulpin = Column(String(14), ForeignKey("parcels.ulpin"), nullable=False)
    claimant_name = Column(String, nullable=False)
    contact_phone = Column(String, nullable=False)
    grounds_category = Column(String, nullable=False)  # Valuation, Area, Title, Alignment
    objection_details = Column(Text, nullable=False)
    filing_date = Column(String, nullable=False)
    status = Column(String, default="PENDING")  # PENDING, HEARING_SCHEDULED, DISPOSED_UPHELD, DISPOSED_REJECTED
    hearing_date = Column(String, nullable=True)
    cala_jurisdiction = Column(String, default="District Land Acquisition Tribunal / CALA Bench")
    reasoned_order_summary = Column(Text, nullable=True)

    project = relationship("Project", back_populates="objections")
    parcel = relationship("Parcel", back_populates="objections")


class Award(Base):
    __tablename__ = "awards"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    ulpin = Column(String(14), ForeignKey("parcels.ulpin"), nullable=False, unique=True)
    base_market_value_per_sqm = Column(Float, nullable=False)
    multiplication_factor = Column(Float, default=1.0)
    adjusted_market_value = Column(Float, nullable=False)
    assets_valuation_total = Column(Float, default=0.0)
    base_compensation = Column(Float, nullable=False)
    solatium_amount = Column(Float, nullable=False)
    additional_amount_12pct = Column(Float, default=0.0)
    gross_total_award = Column(Float, nullable=False)
    sanction_date = Column(String, nullable=False)
    dbt_status = Column(String, default="PENDING")  # PENDING, CREDITED, ESCROWED

    parcel = relationship("Parcel", back_populates="award")


class RRFamily(Base):
    __tablename__ = "rr_families"

    family_id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    head_of_family = Column(String, nullable=False)
    category = Column(String, default="SC/ST")
    is_displaced = Column(Boolean, default=True)
    monetary_entitlements_settled = Column(Integer, default=0)
    total_rr_assistance_inr = Column(Float, default=500000.0)
    resettlement_amenities_allocated = Column(JSON, default=list)

    project = relationship("Project", back_populates="rr_families")
