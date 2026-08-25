"""
Spatial and Cadastral Fusion Engine
Computes alignment polygon intersections, generates 14-digit ULPIN (Bhu-Aadhaar),
and formats state-specific land nomenclature.
"""

import random
import hashlib
from typing import List, Dict, Any
from .models import ParcelRecord, LandTypeEnum, StateNomenclature

def generate_ulpin(state_code: str, district_code: str, parcel_sequence: int) -> str:
    """
    Generates an alphanumeric 14-digit Unique Land Parcel Identification Number (ULPIN / Bhu-Aadhaar).
    Format: [State:2][District:2][Subdistrict:2][Random/CoordinateHash:8]
    """
    salt = f"{state_code}-{district_code}-{parcel_sequence}-DoLR-GIS-2026"
    hash_digest = hashlib.sha256(salt.encode()).hexdigest().upper()
    ulpin_14 = f"{state_code[:2].upper()}{district_code[:2].upper()}{hash_digest[:10]}"
    return ulpin_14

def mock_intersect_alignment_corridor(
    corridor_name: str,
    state: str,
    district: str,
    village: str,
    corridor_length_km: float
) -> List[ParcelRecord]:
    """
    Simulates spatial intersection of a highway/rail corridor against cadastral parcel polygons.
    """
    num_parcels = max(3, int(corridor_length_km * 1.5))
    
    # State nomenclature mapping
    nomenclature_map = {
        "Uttar Pradesh": StateNomenclature.UP_MP_DELHI,
        "Madhya Pradesh": StateNomenclature.UP_MP_DELHI,
        "Maharashtra": StateNomenclature.MAHARASHTRA_GUJARAT,
        "Gujarat": StateNomenclature.MAHARASHTRA_GUJARAT,
        "Karnataka": StateNomenclature.KARNATAKA,
        "Tamil Nadu": StateNomenclature.TAMIL_NADU_AP,
        "Andhra Pradesh": StateNomenclature.TAMIL_NADU_AP,
        "Punjab": StateNomenclature.PUNJAB_HARYANA,
        "Haryana": StateNomenclature.PUNJAB_HARYANA,
    }
    nomenclature = nomenclature_map.get(state, StateNomenclature.UP_MP_DELHI)

    sample_owners = [
        ("Ramcharan Yadav", "XXXX-XXXX-8912", "SBIN0001423", "XXXX5491"),
        ("Smt. Savita Devi", "XXXX-XXXX-4531", "PUNB0124800", "XXXX8823"),
        ("Gurvinder Singh", "XXXX-XXXX-9901", "HDFC0000214", "XXXX1109"),
        ("Balram Patel", "XXXX-XXXX-3129", "BARB0VAPURI", "XXXX7712"),
        ("Lakshmi Venkatesh", "XXXX-XXXX-6782", "CNRB0000892", "XXXX3345"),
        ("Anil Kumar Sharma", "XXXX-XXXX-1249", "ICIC0000102", "XXXX9921"),
    ]

    parcels: List[ParcelRecord] = []
    base_lat = 28.6139 if state == "Delhi" else (26.8467 if state == "Uttar Pradesh" else (19.0760 if state == "Maharashtra" else 30.7333))
    base_lng = 77.2090 if state == "Delhi" else (80.9462 if state == "Uttar Pradesh" else (72.8777 if state == "Maharashtra" else 76.7794))

    for i in range(num_parcels):
        owner_name, aadhaar, ifsc, acc = sample_owners[i % len(sample_owners)]
        
        # Local record format based on state
        if nomenclature == StateNomenclature.UP_MP_DELHI:
            local_rec = f"Khasra No. {100 + i * 3}/{i + 1}"
        elif nomenclature == StateNomenclature.MAHARASHTRA_GUJARAT:
            local_rec = f"Gat / Survey No. {45 + i}/A"
        elif nomenclature == StateNomenclature.KARNATAKA:
            local_rec = f"Survey / Hissa No. {12 + i} (Pahani)"
        elif nomenclature == StateNomenclature.TAMIL_NADU_AP:
            local_rec = f"Patta No. {88 + i}, Survey 204/{i+1}"
        else:
            local_rec = f"Murabba No. {15 + i}, Khasra {200 + i}"

        land_type = random.choice([LandTypeEnum.RURAL_CLOSE, LandTypeEnum.RURAL_MID, LandTypeEnum.RURAL_REMOTE])
        total_area = round(random.uniform(2000, 15000), 2)
        acquired_area = round(total_area * random.uniform(0.3, 0.8), 2)
        circle_rate = round(random.uniform(1200, 3500), 2)
        sale_rate = round(circle_rate * random.uniform(1.1, 1.45), 2)

        # Polygon delta coordinates around base
        d_lat = (i * 0.008) + random.uniform(-0.001, 0.001)
        d_lng = (i * 0.009) + random.uniform(-0.001, 0.001)
        poly = [
            [round(base_lat + d_lat, 6), round(base_lng + d_lng, 6)],
            [round(base_lat + d_lat + 0.004, 6), round(base_lng + d_lng, 6)],
            [round(base_lat + d_lat + 0.004, 6), round(base_lng + d_lng + 0.005, 6)],
            [round(base_lat + d_lat, 6), round(base_lng + d_lng + 0.005, 6)],
            [round(base_lat + d_lat, 6), round(base_lng + d_lng, 6)]
        ]

        ulpin = generate_ulpin(state[:2], district[:2], i + 101)

        parcels.append(ParcelRecord(
            ulpin=ulpin,
            state=state,
            district=district,
            taluk_tehsil="Tehsil Sadar",
            village=village,
            nomenclature_type=nomenclature,
            local_record_no=local_rec,
            owner_name=owner_name,
            owner_aadhaar_masked=aadhaar,
            bank_account_verified=True,
            bank_ifsc=ifsc,
            bank_account_no_masked=acc,
            total_parcel_area_sqm=total_area,
            acquired_area_sqm=acquired_area,
            land_type=land_type,
            circle_rate_per_sqm=circle_rate,
            avg_registered_sale_rate_per_sqm=sale_rate,
            ppp_consented_rate_per_sqm=0.0,
            structure_valuation=round(random.choice([0.0, 150000.0, 420000.0, 850000.0]), 2),
            tree_valuation=round(random.choice([0.0, 25000.0, 60000.0, 120000.0]), 2),
            crop_valuation=round(random.choice([15000.0, 35000.0, 50000.0]), 2),
            encumbrance_locked=False,
            coordinates_polygon=poly,
            is_dropout_in_sec19=False
        ))

    return parcels
