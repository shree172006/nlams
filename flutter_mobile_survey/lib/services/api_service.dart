import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/survey_model.dart';

class ApiService {
  // Default backend URL (supports localhost for desktop/web, or emulator 10.0.2.2)
  static String baseUrl = 'http://localhost:8000';

  static void setBaseUrl(String url) {
    baseUrl = url;
  }

  static Future<Map<String, dynamic>> login(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email}),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return {'error': 'Authentication failed: ${response.statusCode}'};
    } catch (e) {
      return {'error': e.toString()};
    }
  }

  static Future<List<AssignedParcel>> fetchParcels() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/projects'));
      if (response.statusCode == 200) {
        final List<dynamic> projects = jsonDecode(response.body);
        final List<AssignedParcel> parcels = [];
        for (var prj in projects) {
          if (prj['parcels'] is List) {
            for (var p in prj['parcels']) {
              parcels.add(AssignedParcel.fromJson(p));
            }
          }
        }
        return parcels;
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  static Future<Map<String, dynamic>> syncSurvey(FieldSurvey survey) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/field-surveys/sync'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(survey.toJson()),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return {'success': false, 'error': 'Server returned ${response.statusCode}'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }
}
