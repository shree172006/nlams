import 'package:flutter/material.dart';
import '../models/survey_model.dart';
import '../services/api_service.dart';
import '../services/offline_storage.dart';

class SurveyFormScreen extends StatefulWidget {
  final AssignedParcel parcel;

  const SurveyFormScreen({super.key, required this.parcel});

  @override
  State<SurveyFormScreen> createState() => _SurveyFormScreenState();
}

class _SurveyFormScreenState extends State<SurveyFormScreen> {
  // Structures
  String _structureType = 'PUCCA';
  final _plinthAreaController = TextEditingController(text: '450');
  final _structureRateController = TextEditingController(text: '800');
  int _borewellsCount = 1;

  // Trees
  int _teakTreesCount = 4;
  int _mangoTreesCount = 2;
  int _neemTreesCount = 3;

  // Crops
  String _cropType = 'Paddy (Basmati)';
  final _cropAreaController = TextEditingController(text: '0.85');

  // Non-Owner Claimants
  final List<NonOwnerClaimant> _claimants = [];

  // Joint Khata Heirs
  final List<JointKhataHeir> _jointHeirs = [];

  // Geo-tagged Survey Photos
  final List<String> _photos = [
    'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=300&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80',
  ];

  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    // Default demo claimant & heirs
    _claimants.add(NonOwnerClaimant(
      name: 'Shri Mangal Ram',
      type: 'Agricultural Labourer',
      phone: '+91 98765 11223',
      aadhaarLast4: '4589',
    ));

    _jointHeirs.add(JointKhataHeir(
      name: widget.parcel.ownerName.split(' ')[0],
      relation: 'Self (Co-parcener)',
      sharePct: 50.0,
      shareSqm: widget.parcel.acquiredAreaSqm * 0.5,
    ));
    _jointHeirs.add(JointKhataHeir(
      name: 'Shyamcharan Yadav',
      relation: 'Brother (Co-parcener)',
      sharePct: 50.0,
      shareSqm: widget.parcel.acquiredAreaSqm * 0.5,
    ));
  }

  double get _structureValuation {
    final plinth = double.tryParse(_plinthAreaController.text) ?? 0.0;
    final rate = double.tryParse(_structureRateController.text) ?? 0.0;
    return (plinth * rate) + (_borewellsCount * 50000.0);
  }

  double get _treeValuation {
    return (_teakTreesCount * 5000.0) + (_mangoTreesCount * 8000.0) + (_neemTreesCount * 2500.0);
  }

  double get _cropValuation {
    final acres = double.tryParse(_cropAreaController.text) ?? 0.0;
    return acres * 30000.0; // ₹30,000/acre standing crop net value
  }

  double get _totalAssetValuation => _structureValuation + _treeValuation + _cropValuation;

  void _saveSurvey({bool andSync = false}) async {
    setState(() => _isSaving = true);

    final survey = FieldSurvey(
      ulpin: widget.parcel.ulpin,
      projectId: widget.parcel.projectId,
      surveyorName: OfflineStorage().currentSurveyorName,
      surveyorId: OfflineStorage().currentSurveyorId,
      structureValuation: _structureValuation,
      treeValuation: _treeValuation,
      cropValuation: _cropValuation,
      assetDetails: {
        'structure_type': _structureType,
        'plinth_sqft': double.tryParse(_plinthAreaController.text) ?? 0,
        'structure_rate_sqft': double.tryParse(_structureRateController.text) ?? 0,
        'borewells_count': _borewellsCount,
        'teak_trees': _teakTreesCount,
        'mango_trees': _mangoTreesCount,
        'neem_trees': _neemTreesCount,
        'crop_type': _cropType,
        'crop_acres': double.tryParse(_cropAreaController.text) ?? 0,
      },
      nonOwnerClaimants: _claimants,
      jointKhataHeirs: _jointHeirs,
      photoUrls: _photos,
      surveyDate: DateTime.now().toIso8601String().substring(0, 10),
      isSynced: false,
    );

    // Save to local offline queue
    OfflineStorage().saveSurvey(survey);

    if (andSync) {
      final syncRes = await ApiService.syncSurvey(survey);
      if (syncRes['success'] == true) {
        OfflineStorage().markAsSynced(widget.parcel.ulpin);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Field survey synced successfully to NLAMS Cloud!'),
              backgroundColor: Color(0xFF065F46),
            ),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Saved locally. Cloud sync pending: ${syncRes['error'] ?? 'Offline'}'),
              backgroundColor: const Color(0xFFEA580C),
            ),
          );
        }
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Field survey saved to local device queue.'),
            backgroundColor: Color(0xFF071426),
          ),
        );
      }
    }

    setState(() => _isSaving = false);
    if (mounted) Navigator.pop(context);
  }

  void _showAddClaimantDialog() {
    final nameCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final aadhaarCtrl = TextEditingController();
    String type = 'Agricultural Labourer';

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Register Non-Owner PAF', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        content: StatefulBuilder(
          builder: (context, setDialogState) => SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Claimant Name', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                TextField(controller: nameCtrl, decoration: const InputDecoration(hintText: 'e.g. Shri Mangal Ram')),
                const SizedBox(height: 10),
                const Text('Category', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                DropdownButton<String>(
                  isExpanded: true,
                  value: type,
                  items: const [
                    DropdownMenuItem(value: 'Agricultural Labourer', child: Text('Agricultural Labourer')),
                    DropdownMenuItem(value: 'Continuous Tenant', child: Text('Continuous Tenant / Sharecropper')),
                    DropdownMenuItem(value: 'Rural Artisan', child: Text('Rural Artisan / Village Craftsperson')),
                  ],
                  onChanged: (val) => setDialogState(() => type = val!),
                ),
                const SizedBox(height: 10),
                const Text('Mobile Phone', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                TextField(controller: phoneCtrl, decoration: const InputDecoration(hintText: '+91 98765 00000')),
                const SizedBox(height: 10),
                const Text('Aadhaar Last 4 Digits', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                TextField(controller: aadhaarCtrl, decoration: const InputDecoration(hintText: 'XXXX-XXXX-1234')),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF071426), foregroundColor: Colors.white),
            onPressed: () {
              if (nameCtrl.text.isNotEmpty) {
                setState(() {
                  _claimants.add(NonOwnerClaimant(
                    name: nameCtrl.text.trim(),
                    type: type,
                    phone: phoneCtrl.text.trim(),
                    aadhaarLast4: aadhaarCtrl.text.trim(),
                  ));
                });
                Navigator.pop(ctx);
              }
            },
            child: const Text('Add Claimant'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF071426),
        foregroundColor: Colors.white,
        title: Text(
          'Survey: ${widget.parcel.ulpin}',
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Parcel Details Header
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFCBD5E1)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(widget.parcel.ownerName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      Text('${widget.parcel.acquiredAreaSqm} sq.m', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF2563EB), fontSize: 12)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text('Village: ${widget.parcel.village} • Base Rate: ₹${widget.parcel.saleRate}/sq.m', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Live Asset Valuation Banner
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFECFDF5),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFA7F3D0)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('On-Ground Asset Valuation (Sec 29)', style: TextStyle(fontSize: 10, color: Color(0xFF065F46), fontWeight: FontWeight.bold)),
                      Text('Structures + Trees + Crops', style: TextStyle(fontSize: 9, color: Color(0xFF047857))),
                    ],
                  ),
                  Text(
                    '₹ ${_totalAssetValuation.toStringAsFixed(0)}',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF065F46)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Section 1: Structures
            _sectionHeader('1. Immovable Structures & Wells', Icons.home_work_outlined),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  children: [
                    DropdownButtonFormField<String>(
                      initialValue: _structureType,
                      decoration: const InputDecoration(labelText: 'Structure Construction Type'),
                      items: const [
                        DropdownMenuItem(value: 'PUCCA', child: Text('Pucca (RCC Roof & Brick Wall)')),
                        DropdownMenuItem(value: 'SEMI_PUCCA', child: Text('Semi-Pucca (Tin / Tile Roof)')),
                        DropdownMenuItem(value: 'KUTCHA', child: Text('Kutcha (Mud & Thatch)')),
                      ],
                      onChanged: (v) => setState(() => _structureType = v!),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _plinthAreaController,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Plinth Area (sq.ft)'),
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: _structureRateController,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'PWD Rate (₹/sq.ft)'),
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Borewells / Tube Wells (₹50k/each):', style: TextStyle(fontSize: 11)),
                        Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.remove_circle_outline, size: 20),
                              onPressed: _borewellsCount > 0 ? () => setState(() => _borewellsCount--) : null,
                            ),
                            Text('$_borewellsCount', style: const TextStyle(fontWeight: FontWeight.bold)),
                            IconButton(
                              icon: const Icon(Icons.add_circle_outline, size: 20),
                              onPressed: () => setState(() => _borewellsCount++),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Section 2: Trees
            _sectionHeader('2. Trees & Timber Valuation', Icons.forest_outlined),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  children: [
                    _treeCounter('Teak / Timber (₹5,000/tree)', _teakTreesCount, (v) => setState(() => _teakTreesCount = v)),
                    _treeCounter('Fruit Mango (₹8,000/tree)', _mangoTreesCount, (v) => setState(() => _mangoTreesCount = v)),
                    _treeCounter('Neem / Shade (₹2,500/tree)', _neemTreesCount, (v) => setState(() => _neemTreesCount = v)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Section 3: Standing Crops
            _sectionHeader('3. Standing Crops & Produce', Icons.agriculture_outlined),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  children: [
                    TextField(
                      controller: TextEditingController(text: _cropType),
                      decoration: const InputDecoration(labelText: 'Major Standing Crop'),
                      onChanged: (v) => _cropType = v,
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _cropAreaController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Cultivated Crop Area (Acres)'),
                      onChanged: (_) => setState(() {}),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Section 4: Non-Owner PAF Claimants
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _sectionHeader('4. Non-Owner PAFs (R&R Entitled)', Icons.people_outline),
                TextButton.icon(
                  onPressed: _showAddClaimantDialog,
                  icon: const Icon(Icons.add, size: 14),
                  label: const Text('Add Claimant', style: TextStyle(fontSize: 11)),
                ),
              ],
            ),
            if (_claimants.isEmpty)
              const Text('No non-owner claimants identified yet.', style: TextStyle(fontSize: 11, color: Color(0xFF64748B)))
            else
              ..._claimants.map((c) => Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      dense: true,
                      title: Text('${c.name} (${c.type})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                      subtitle: Text('Phone: ${c.phone} • Entitlement: ₹${c.totalEntitlement.toStringAsFixed(0)}', style: const TextStyle(fontSize: 10)),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                        onPressed: () => setState(() => _claimants.remove(c)),
                      ),
                    ),
                  )),
            const SizedBox(height: 16),

            // Section 5: Geo-Tagged Survey Photos
            _sectionHeader('5. Geo-Tagged On-Site Photos (${_photos.length})', Icons.camera_alt_outlined),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  children: [
                    SizedBox(
                      height: 70,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _photos.length + 1,
                        itemBuilder: (ctx, i) {
                          if (i == _photos.length) {
                            return InkWell(
                              onTap: () {
                                setState(() {
                                  _photos.add('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80');
                                });
                              },
                              child: Container(
                                width: 70,
                                margin: const EdgeInsets.only(right: 8),
                                decoration: BoxDecoration(
                                  border: Border.all(color: const Color(0xFFCBD5E1), style: BorderStyle.solid),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.add_a_photo, size: 20, color: Color(0xFF64748B)),
                                    SizedBox(height: 2),
                                    Text('Capture', style: TextStyle(fontSize: 9, color: Color(0xFF64748B))),
                                  ],
                                ),
                              ),
                            );
                          }
                          return Container(
                            width: 80,
                            margin: const EdgeInsets.only(right: 8),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(6),
                              image: DecorationImage(
                                image: NetworkImage(_photos[i]),
                                fit: BoxFit.cover,
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Actions Bottom Deck
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _isSaving ? null : () => _saveSurvey(andSync: false),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text('Save Locally (Offline)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isSaving ? null : () => _saveSurvey(andSync: true),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF071426),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: _isSaving
                        ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Text('Save & Cloud Sync', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _sectionHeader(String title, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(icon, size: 16, color: const Color(0xFF1E40AF)),
          const SizedBox(width: 6),
          Text(
            title,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
          ),
        ],
      ),
    );
  }

  Widget _treeCounter(String label, int count, Function(int) onChanged) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 11)),
        Row(
          children: [
            IconButton(
              icon: const Icon(Icons.remove_circle_outline, size: 18),
              onPressed: count > 0 ? () => onChanged(count - 1) : null,
            ),
            Text('$count', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            IconButton(
              icon: const Icon(Icons.add_circle_outline, size: 18),
              onPressed: () => onChanged(count + 1),
            ),
          ],
        ),
      ],
    );
  }
}
