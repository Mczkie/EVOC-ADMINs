import 'package:evocapp/screens/startup.dart';
import 'package:flutter/material.dart';
import 'screens/home_page.dart';

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
