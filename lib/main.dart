import 'package:evocapp/screens/startup.dart';
import 'package:flutter/material.dart';
import 'screens/home_page.dart';
import 'database/api_service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  const String email = '';
  runApp(const MyApp(
    email: email,
  ));
}

class MyApp extends StatelessWidget {
  final String email;
  const MyApp({super.key, required this.email});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: MyStartup(email: email),
      routes: {
        '/homepage': (context) => MyHomePage(email: email),
      },
    );
  }
}
