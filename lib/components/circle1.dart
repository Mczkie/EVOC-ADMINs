import 'package:flutter/material.dart';

class MyCircle extends StatelessWidget {
  const MyCircle({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 300,
      height: 150,
      child: Image.asset('assets/images/circle.png'),
    );
  }
}
