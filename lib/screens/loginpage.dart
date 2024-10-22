// ignore_for_file: avoid_print, use_build_context_synchronously

import 'package:evocapp/screens/home_page.dart';
import 'package:flutter/material.dart';
import 'package:evocapp/screens/signuppage.dart';
import 'package:evocapp/components/logtext.dart';
import 'package:evocapp/components/squaretile.dart';
import 'package:evocapp/components/textfield.dart';
import 'package:evocapp/database/db_helper.dart';

class MyLoginPage extends StatefulWidget {
  final String email;

  const MyLoginPage({super.key, required this.email});

  @override
  State<MyLoginPage> createState() => _MyLoginPageState();
}

class _MyLoginPageState extends State<MyLoginPage> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final DbHelper _dbHelper = DbHelper();

  bool _isLoading = false; // Mutable loading state

  Future<void> _login() async {
    setState(() {
      _isLoading = true; // Start loading
    });

    final email = emailController.text;
    final password = passwordController.text;

    final user = await _dbHelper.getUser(email);
    if (user != null && user['password'] == password) {
      print('Login successful, updating status...');
      await _dbHelper.updatedLoginStatus(email, 1);
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => MyHomePage(email: email)),
      ); // Navigate to home page
    } else {
      // Invalid credentials
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Invalid email or password')),
      );
    }

    setState(() {
      _isLoading = false; // Stop loading
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: _isLoading
              ? const CircularProgressIndicator()
              : Column(
                  children: [
                    const SizedBox(height: 50),
                    const Text(
                      "Login into your account",
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 25,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Text(
                      'Welcome! Please enter your details.',
                      style: TextStyle(
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 100),
                    MyTextField(
                      controller: emailController,
                      hintText: 'Email',
                      obsecureText: false,
                    ),
                    const SizedBox(height: 25),
                    MyTextField(
                      controller: passwordController,
                      hintText: 'Password',
                      obsecureText: true,
                    ),
                    const SizedBox(height: 15),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          InkWell(
                            onTap: () {
                              Navigator.of(context).pushReplacement(
                                MaterialPageRoute(
                                  builder: (context) => MySignUpPage(
                                    email: widget.email,
                                  ),
                                ),
                              );
                            },
                            child: const Text(
                              'Forget Password',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                  decoration: TextDecoration.underline),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    MyLogText(onPressed: _login),
                    const SizedBox(height: 30),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'Do you have an account?',
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 19),
                        ),
                        const SizedBox(width: 10),
                        InkWell(
                          onTap: () {
                            Navigator.of(context).pushReplacement(
                              MaterialPageRoute(
                                builder: (context) => MySignUpPage(
                                  email: widget.email,
                                ),
                              ),
                            );
                          },
                          child: const Text(
                            'Sign Up',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 19,
                              wordSpacing: -1.5,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 15),
                    const Text(
                      'or',
                      style: TextStyle(fontSize: 20),
                    ),
                    const SizedBox(height: 20),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SquareTile(
                          imagePath: 'images/googles.png',
                        ),
                        SquareTile(
                          imagePath: 'images/facebooks.png',
                        )
                      ],
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
