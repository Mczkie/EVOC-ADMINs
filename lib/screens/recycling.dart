import 'package:flutter/material.dart';

class MyRecycling extends StatelessWidget {
  const MyRecycling({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              const Row(
                children: [
                  Text(
                    'Recycle and Articles',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25),
                  ),
                ],
              ),
              const SizedBox(height: 50),
              const Row(
                children: [
                  Text(
                    'Type of Waste',
                    style: TextStyle(
                      fontSize: 20,
                      decoration: TextDecoration.underline,
                      letterSpacing: -1,
                    ),
                  )
                ],
              ),
              const SizedBox(
                height: 50,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Column(
                    children: [
                      Container(
                        decoration: BoxDecoration(
                            color: Colors.blue,
                            borderRadius: BorderRadius.circular(20)),
                        width: 100,
                        height: 100,
                        child: const Center(
                          child: Text(
                            'BIO',
                            style: TextStyle(fontSize: 20),
                          ),
                        ),
                      ),
                    ],
                  ),
                  Column(
                    children: [
                      Container(
                        decoration: const BoxDecoration(color: Colors.white),
                        width: 100,
                        height: 100,
                        child: const Center(
                          child: Text('NON-BIO'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 50),
              const Row(
                children: [
                  Text(
                    'ARTICLES',
                    style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        decoration: TextDecoration.underline,
                        letterSpacing: -1),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Column(
                children: [
                  Container(
                    decoration: const BoxDecoration(
                        color: Colors.blueAccent,
                        borderRadius: BorderRadius.all(Radius.circular(20))),
                    height: 100,
                    width: 1000,
                    child: const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Center(
                        child: Text(
                          'DM No. 268, s. 2023 – STRICT EMPLEMENTATION OF NO SEGREGATION, NO COLLECTION OF GARBAGE POLICY WITHIN OLONGAPO CITY',
                          style: TextStyle(
                              fontSize: 15, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Column(
                children: [
                  Container(
                    decoration: const BoxDecoration(
                        color: Colors.blueAccent,
                        borderRadius: BorderRadius.all(Radius.circular(20))),
                    height: 100,
                    width: 1000,
                    child: const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Center(
                        child: Text(
                          'RA 9003, The law provides for a comprehensive ecological solid waste management program by creating the necessary institutional mechanism and incentives, appropriating funds, declaring certain acts prohibited, and providing penalties.',
                          style: TextStyle(
                              fontSize: 15, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
