import 'package:flutter/material.dart';
import 'package:evocapp/components/signupbutton.dart';
import 'package:evocapp/components/squaretile.dart';
import 'package:evocapp/components/textfield.dart';
import 'package:evocapp/screens/loginpage.dart';
import 'package:evocapp/database/db_helper.dart';

class MySignUpPage extends StatefulWidget {
  final String email;
  const MySignUpPage({super.key, required this.email});

  @override
  State<MySignUpPage> createState() => _MySignUpPageState();
}

class _MySignUpPageState extends State<MySignUpPage> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final DbHelper _dbHelper = DbHelper();

  @override
  void initState() {
    super.initState();
  }

  Future<void> _register() async {
    final email = emailController.text;
    final password = passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Error'),
          content: const Text('Email and Password are required to fill up'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Ok'),
            ),
          ],
        ),
      );
    } else {
      try {
        await _dbHelper.insertUser(email, password);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('User registered successfully')),
        );

        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Success'),
            content: const Text('User registration successfully!'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop(); // Close the dialog
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(
                      builder: (context) => MyLoginPage(
                        email: email, // Pass the email to MyLoginPage
                      ),
                    ),
                  );
                },
                child: const Text('Ok'),
              ),
            ],
          ),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error registering user: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: Column(
            children: [
              const SizedBox(height: 50),
              const Text(
                "Create your account",
                style: TextStyle(
                    color: Colors.black,
                    fontSize: 22,
                    fontWeight: FontWeight.bold),
              ),
              const Text(
                'Enter your details to create an account.',
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
              const SizedBox(height: 20),
              MySignup(onPressed: _register),
              const SizedBox(height: 30),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Already have an account?',
                    style: TextStyle(fontSize: 20),
                  ),
                  const SizedBox(width: 5),
                  InkWell(
                    onTap: () {
                      Navigator.of(context).pushReplacement(
                        MaterialPageRoute(
                          builder: (context) => MyLoginPage(
                            email: widget.email,
                          ),
                        ),
                      );
                    },
                    child: const Text(
                      'Sign In',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 21),
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
              )
            ],
          ),
        ),
      ),
    );
  }
}
