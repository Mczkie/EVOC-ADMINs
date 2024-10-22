import 'package:evocapp/screens/startup.dart';
import 'package:flutter/material.dart';

class MyNewHome extends StatefulWidget {
  final String email;
  const MyNewHome({super.key, required this.email});

  @override
  State<MyNewHome> createState() => _MyNewHomeState();
}

class _MyNewHomeState extends State<MyNewHome> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.green,
      body: SafeArea(
        child: Center(
          child: ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => MyStartup(email: widget.email),
                ),
              );
            },
            child: const Text('Scanner'),
          ),
        ),
      ),
    );
  }
}
