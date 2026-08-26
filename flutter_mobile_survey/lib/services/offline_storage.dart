import '../models/survey_model.dart';

class OfflineStorage {
  static final OfflineStorage _instance = OfflineStorage._internal();
  factory OfflineStorage() => _instance;
  OfflineStorage._internal();

  final List<FieldSurvey> _surveyQueue = [];
  final List<AssignedParcel> _cachedParcels = [];
  String _currentSurveyorName = 'Shri S. K. Sharma';
  String _currentSurveyorId = 'OFF-SURV-088';

  String get currentSurveyorName => _currentSurveyorName;
  String get currentSurveyorId => _currentSurveyorId;

  void setSurveyor(String name, String id) {
    _currentSurveyorName = name;
    _currentSurveyorId = id;
  }

  void saveSurvey(FieldSurvey survey) {
    // Replace if already exists for same ULPIN
    _surveyQueue.removeWhere((s) => s.ulpin == survey.ulpin);
    _surveyQueue.add(survey);
  }

  List<FieldSurvey> getAllSurveys() => List.unmodifiable(_surveyQueue);

  List<FieldSurvey> getUnsyncedSurveys() =>
      _surveyQueue.where((s) => !s.isSynced).toList();

  void markAsSynced(String ulpin) {
    final index = _surveyQueue.indexWhere((s) => s.ulpin == ulpin);
    if (index != -1) {
      _surveyQueue[index].isSynced = true;
    }
  }

  void cacheParcels(List<AssignedParcel> parcels) {
    _cachedParcels.clear();
    _cachedParcels.addAll(parcels);
  }

  List<AssignedParcel> getCachedParcels() {
    if (_cachedParcels.isNotEmpty) return _cachedParcels;

    // Default pre-cached parcels for field surveyor demo
    return [
      AssignedParcel(
        ulpin: '09124458901234',
        projectId: 'NHAI-EC-VNS-KOL-2025',
        village: 'Chandpur',
        ownerName: 'Ramcharan & Co-parceners',
        acquiredAreaSqm: 3500.0,
        landType: 'RURAL_REMOTE',
        circleRate: 1850.0,
        saleRate: 2400.0,
      ),
      AssignedParcel(
        ulpin: '09124458901235',
        projectId: 'NHAI-EC-VNS-KOL-2025',
        village: 'Chandpur',
        ownerName: 'Smt. Malti Devi',
        acquiredAreaSqm: 1200.0,
        landType: 'RURAL_REMOTE',
        circleRate: 1850.0,
        saleRate: 2400.0,
      ),
      AssignedParcel(
        ulpin: '09124458901236',
        projectId: 'NHAI-EC-VNS-KOL-2025',
        village: 'Chandpur',
        ownerName: 'M/s Greenfield Logistics',
        acquiredAreaSqm: 8500.0,
        landType: 'URBAN_CORE',
        circleRate: 4500.0,
        saleRate: 6200.0,
      ),
      AssignedParcel(
        ulpin: '27041289560012',
        projectId: 'MSRDC-ME-PUN-MUM-2025',
        village: 'Khandala Rural',
        ownerName: 'Eknath Shinde & Heirs',
        acquiredAreaSqm: 4200.0,
        landType: 'RURAL_DEVELOPED',
        circleRate: 2800.0,
        saleRate: 3500.0,
      ),
    ];
  }
}
