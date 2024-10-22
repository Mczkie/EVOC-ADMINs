// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:evocapp/database/db_helper.dart';
import 'package:evocapp/screens/loginpage.dart';

class MyMenu extends StatelessWidget {
  const MyMenu({super.key, required this.email});

  final String email;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Menu'),
        backgroundColor: Colors.green,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            // Add your menu items here
            const Text('Welcome to the Menu Page'),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                _logout(context);
              },
              child: const Text('Logout'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _logout(BuildContext context) async {
    final DbHelper dbHelper = DbHelper();

    // Update login status to 0 (logged out)
    await dbHelper.updatedLoginStatus(email, 0);

    // Navigate to the login page
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
          builder: (context) => MyLoginPage(
                email: email,
              )),
    );
  }
}
