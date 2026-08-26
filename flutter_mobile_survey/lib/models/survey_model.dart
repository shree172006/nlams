class FieldSurvey {
  final String ulpin;
  final String projectId;
  final String surveyorName;
  final String surveyorId;
  final double structureValuation;
  final double treeValuation;
  final double cropValuation;
  final Map<String, dynamic> assetDetails;
  final List<NonOwnerClaimant> nonOwnerClaimants;
  final List<JointKhataHeir> jointKhataHeirs;
  final List<String> photoUrls;
  final String surveyDate;
  bool isSynced;

  FieldSurvey({
    required this.ulpin,
    required this.projectId,
    required this.surveyorName,
    required this.surveyorId,
    required this.structureValuation,
    required this.treeValuation,
    required this.cropValuation,
    required this.assetDetails,
    required this.nonOwnerClaimants,
    required this.jointKhataHeirs,
    required this.photoUrls,
    required this.surveyDate,
    this.isSynced = false,
  });

  double get totalAssetValuation => structureValuation + treeValuation + cropValuation;

  Map<String, dynamic> toJson() {
    return {
      'ulpin': ulpin,
      'project_id': projectId,
      'surveyor_name': surveyorName,
      'surveyor_id': surveyorId,
      'structure_valuation': structureValuation,
      'tree_valuation': treeValuation,
      'crop_valuation': cropValuation,
      'asset_details': assetDetails,
      'non_owner_claimants': nonOwnerClaimants.map((c) => c.toJson()).toList(),
      'joint_khata_heirs': jointKhataHeirs.map((h) => h.toJson()).toList(),
      'photo_urls': photoUrls,
      'survey_date': surveyDate,
      'is_synced': isSynced,
    };
  }

  factory FieldSurvey.fromJson(Map<String, dynamic> json) {
    return FieldSurvey(
      ulpin: json['ulpin'] ?? '',
      projectId: json['project_id'] ?? '',
      surveyorName: json['surveyor_name'] ?? '',
      surveyorId: json['surveyor_id'] ?? '',
      structureValuation: (json['structure_valuation'] as num?)?.toDouble() ?? 0.0,
      treeValuation: (json['tree_valuation'] as num?)?.toDouble() ?? 0.0,
      cropValuation: (json['crop_valuation'] as num?)?.toDouble() ?? 0.0,
      assetDetails: json['asset_details'] is Map ? Map<String, dynamic>.from(json['asset_details']) : {},
      nonOwnerClaimants: (json['non_owner_claimants'] as List<dynamic>?)
              ?.map((c) => NonOwnerClaimant.fromJson(c))
              .toList() ??
          [],
      jointKhataHeirs: (json['joint_khata_heirs'] as List<dynamic>?)
              ?.map((h) => JointKhataHeir.fromJson(h))
              .toList() ??
          [],
      photoUrls: (json['photo_urls'] as List<dynamic>?)?.map((p) => p.toString()).toList() ?? [],
      surveyDate: json['survey_date'] ?? DateTime.now().toIso8601String().substring(0, 10),
      isSynced: json['is_synced'] ?? false,
    );
  }
}

class NonOwnerClaimant {
  final String name;
  final String type; // Labourer, Tenant, Artisan
  final String phone;
  final String aadhaarLast4;
  final double subsistenceGrant; // ₹36,000 (₹3,000/mo x 12)
  final double shiftingGrant; // ₹50,000
  final double cattleOrShopGrant; // ₹25,000

  NonOwnerClaimant({
    required this.name,
    required this.type,
    required this.phone,
    required this.aadhaarLast4,
    this.subsistenceGrant = 36000,
    this.shiftingGrant = 50000,
    this.cattleOrShopGrant = 25000,
  });

  double get totalEntitlement => subsistenceGrant + shiftingGrant + cattleOrShopGrant;

  Map<String, dynamic> toJson() => {
        'name': name,
        'type': type,
        'phone': phone,
        'aadhaar_last4': aadhaarLast4,
        'subsistence_grant': subsistenceGrant,
        'shifting_grant': shiftingGrant,
        'cattle_shop_grant': cattleOrShopGrant,
        'total_entitlement': totalEntitlement,
      };

  factory NonOwnerClaimant.fromJson(Map<String, dynamic> json) => NonOwnerClaimant(
        name: json['name'] ?? '',
        type: json['type'] ?? 'Agricultural Labourer',
        phone: json['phone'] ?? '',
        aadhaarLast4: json['aadhaar_last4'] ?? '',
        subsistenceGrant: (json['subsistence_grant'] as num?)?.toDouble() ?? 36000,
        shiftingGrant: (json['shifting_grant'] as num?)?.toDouble() ?? 50000,
        cattleOrShopGrant: (json['cattle_shop_grant'] as num?)?.toDouble() ?? 25000,
      );
}

class JointKhataHeir {
  final String name;
  final String relation;
  final double sharePct;
  final double shareSqm;

  JointKhataHeir({
    required this.name,
    required this.relation,
    required this.sharePct,
    required this.shareSqm,
  });

  Map<String, dynamic> toJson() => {
        'name': name,
        'relation': relation,
        'share_pct': sharePct,
        'share_sqm': shareSqm,
      };

  factory JointKhataHeir.fromJson(Map<String, dynamic> json) => JointKhataHeir(
        name: json['name'] ?? '',
        relation: json['relation'] ?? 'Co-Parcener',
        sharePct: (json['share_pct'] as num?)?.toDouble() ?? 0.0,
        shareSqm: (json['share_sqm'] as num?)?.toDouble() ?? 0.0,
      );
}

class AssignedParcel {
  final String ulpin;
  final String projectId;
  final String village;
  final String ownerName;
  final double acquiredAreaSqm;
  final String landType;
  final double circleRate;
  final double saleRate;
  final bool hasSurvey;

  AssignedParcel({
    required this.ulpin,
    required this.projectId,
    required this.village,
    required this.ownerName,
    required this.acquiredAreaSqm,
    required this.landType,
    required this.circleRate,
    required this.saleRate,
    this.hasSurvey = false,
  });

  factory AssignedParcel.fromJson(Map<String, dynamic> json) {
    return AssignedParcel(
      ulpin: json['ulpin'] ?? '',
      projectId: json['project_id'] ?? 'NHAI-EC-VNS-KOL-2025',
      village: json['village'] ?? 'Chandpur',
      ownerName: json['owner_name'] ?? 'Unknown Owner',
      acquiredAreaSqm: (json['acquired_area_sqm'] as num?)?.toDouble() ?? 3500.0,
      landType: json['land_type'] ?? 'RURAL_REMOTE',
      circleRate: (json['circle_rate_per_sqm'] as num?)?.toDouble() ?? 1850.0,
      saleRate: (json['avg_registered_sale_rate_per_sqm'] as num?)?.toDouble() ?? 2400.0,
      hasSurvey: (json['structure_valuation'] ?? 0) > 0 || (json['tree_valuation'] ?? 0) > 0,
    );
  }
}
