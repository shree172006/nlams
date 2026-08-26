import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/offline_storage.dart';

class SyncScreen extends StatefulWidget {
  const SyncScreen({super.key});

  @override
  State<SyncScreen> createState() => _SyncScreenState();
}

class _SyncScreenState extends State<SyncScreen> {
  bool _isSyncing = false;
  String? _syncStatusMessage;

  void _syncAll() async {
    final unsynced = OfflineStorage().getUnsyncedSurveys();
    if (unsynced.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No pending offline surveys to sync.')),
      );
      return;
    }

    setState(() {
      _isSyncing = true;
      _syncStatusMessage = 'Syncing ${unsynced.length} survey(s) with NLAMS backend...';
    });

    int successCount = 0;
    for (var survey in unsynced) {
      final res = await ApiService.syncSurvey(survey);
      if (res['success'] == true) {
        OfflineStorage().markAsSynced(survey.ulpin);
        successCount++;
      }
    }

    setState(() {
      _isSyncing = false;
      _syncStatusMessage = 'Successfully synchronized $successCount / ${unsynced.length} surveys!';
    });
  }

  @override
  Widget build(BuildContext context) {
    final allSurveys = OfflineStorage().getAllSurveys();
    final unsyncedSurveys = OfflineStorage().getUnsyncedSurveys();

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: const Color(0xFF071426),
        foregroundColor: Colors.white,
        title: const Text('Offline Sync Manager', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Sync status card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFCBD5E1)),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _statusColumn('Total Recorded', '${allSurveys.length}', const Color(0xFF0F172A)),
                      _statusColumn('Pending Sync', '${unsyncedSurveys.length}', const Color(0xFFEA580C)),
                      _statusColumn('Synced', '${allSurveys.length - unsyncedSurveys.length}', const Color(0xFF059669)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _isSyncing || unsyncedSurveys.isEmpty ? null : _syncAll,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF059669),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      icon: _isSyncing
                          ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : const Icon(Icons.cloud_upload, size: 18),
                      label: Text(
                        _isSyncing ? 'Synchronizing...' : 'Sync All Pending Surveys',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  if (_syncStatusMessage != null) ...[
                    const SizedBox(height: 10),
                    Text(
                      _syncStatusMessage!,
                      style: const TextStyle(fontSize: 11, color: Color(0xFF065F46), fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 20),

            const Text(
              'Survey Queue Records',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
            ),
            const SizedBox(height: 10),

            Expanded(
              child: allSurveys.isEmpty
                  ? const Center(
                      child: Text(
                        'No field surveys recorded on this device yet.',
                        style: TextStyle(color: Color(0xFF64748B), fontSize: 12),
                      ),
                    )
                  : ListView.builder(
                      itemCount: allSurveys.length,
                      itemBuilder: (ctx, i) {
                        final s = allSurveys[i];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            leading: Icon(
                              s.isSynced ? Icons.cloud_done : Icons.cloud_off,
                              color: s.isSynced ? const Color(0xFF059669) : const Color(0xFFEA580C),
                            ),
                            title: Text('ULPIN: ${s.ulpin}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                            subtitle: Text('Valuation: ₹${s.totalAssetValuation.toStringAsFixed(0)} • Date: ${s.surveyDate}', style: const TextStyle(fontSize: 10)),
                            trailing: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: s.isSynced ? const Color(0xFFECFDF5) : const Color(0xFFFFF7ED),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                s.isSynced ? 'Synced' : 'Offline',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: s.isSynced ? const Color(0xFF065F46) : const Color(0xFFEA580C),
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _statusColumn(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
      ],
    );
  }
}
