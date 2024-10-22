import 'dart:io';
import 'dart:typed_data';
import 'package:evocapp/screens/result.dart';
import 'package:tflite_flutter/tflite_flutter.dart' as tfl;
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:image/image.dart' as img;
import 'dart:math';

class MyScanner extends StatefulWidget {
  const MyScanner({super.key});

  @override
  State<MyScanner> createState() => _MyScannerState();
}

class _MyScannerState extends State<MyScanner> {
  late File _image;
  String? _result;
  String? _objectType;
  List<String>? _labels;
  tfl.Interpreter? _interpreter;
  final picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    loadModel().then((_) {
      loadLabels().then((loadedLabels) {
        setState(() {
          _labels = loadedLabels;
        });
      }).catchError((error) {
        debugPrint('Error loading labels: $error');
      });
    }).catchError((error) {
      debugPrint('Error loading model: $error');
    });
  }

  @override
  void dispose() {
    _interpreter?.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Scanner'),
        backgroundColor: Colors.indigo,
      ),
      body: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            const SizedBox(height: 50),
            const Text(
              'Bio and Non-bio Detector',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.bold,
                height: 1.4,
                fontFamily: 'SofiaSans',
                fontSize: 30,
              ),
            ),
            const SizedBox(height: 70),
            Center(
              child: SizedBox(
                width: 150,
                child: Column(
                  children: <Widget>[
                    Image.asset('assets/appLogo.png'),
                    const SizedBox(height: 50),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 100),
            SizedBox(
              width: MediaQuery.of(context).size.width,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        pickImageFromCamera();
                      },
                      child: Container(
                        alignment: Alignment.center,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 18,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.blue,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          'Capture a Photo',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'SofiaSans',
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        pickImageFromGallery();
                      },
                      child: Container(
                        alignment: Alignment.center,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 18,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.indigo[400],
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          'Select a photo',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'SofiaSans',
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> loadModel() async {
    try {
      _interpreter = await tfl.Interpreter.fromAsset('assets/model.tflite');
    } catch (e) {
      debugPrint('Error loading model: $e');
    }
  }

  Future<void> pickImageFromCamera() async {
    final pickedFile = await picker.pickImage(source: ImageSource.camera);
    if (pickedFile != null) {
      _setImage(File(pickedFile.path));
    }
  }

  Future<void> pickImageFromGallery() async {
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      _setImage(File(pickedFile.path));
    }
  }

  void _setImage(File image) {
    setState(() {
      _image = image;
    });
    if (_interpreter != null) {
      runInference();
    } else {
      debugPrint('Interpreter not initialized');
    }
  }

  Future<Uint8List> preprocessImage(File imageFile) async {
    img.Image? originalImage = img.decodeImage(await imageFile.readAsBytes());
    if (originalImage == null) {
      throw Exception('Failed to decode image');
    }
    img.Image resizedImage =
        img.copyResize(originalImage, width: 224, height: 224);

    // Convert to float32 and normalize if required
    List<int> bytes = resizedImage.getBytes();
    List<double> normalizedBytes = bytes.map((byte) => byte / 255.0).toList();

    // Convert to Uint8List if required by the model
    return Uint8List.fromList(
        normalizedBytes.map((d) => (d * 255).toInt()).toList());
  }

  Future<void> runInference() async {
    if (_labels == null || _labels!.isEmpty) {
      debugPrint('Labels not loaded');
      return;
    }

    try {
      Uint8List inputBytes = await preprocessImage(_image);
      var input = inputBytes.buffer.asUint8List().reshape([1, 224, 224, 3]);

      // Update the output shape based on your model (e.g., [1, 5] for 5 classes)
      var outputBuffer = List<double>.filled(5, 0).reshape([1, 5]);

      _interpreter!.run(input, outputBuffer);
      debugPrint('Raw output: $outputBuffer');

      // Process the output
      List<int> output = outputBuffer[0];

      int highestProbIndex = output.indexOf(output.reduce(max));
      String classificationResult = _labels![highestProbIndex];

      // Debugging classification result
      debugPrint('Classification Result: $classificationResult');

      String objectType = determineObjectType(classificationResult);

      setState(() {
        _result = classificationResult;
        _objectType = objectType;
      });

      navigateToResult();
    } catch (e) {
      debugPrint('Error during inference: $e');
    }
  }

  String determineObjectType(String classificationResult) {
    debugPrint('Determining object type for: $classificationResult');
    switch (classificationResult) {
      case 'glass':
      case 'plastic':
      case 'metal':
        return 'Non-biodegradable';
      case 'organic':
      case 'paper':
        return 'Biodegradable';
      default:
        debugPrint('Unknown Classification result: $classificationResult');
        return 'Unknown';
    }
  }

  Future<List<String>> loadLabels() async {
    try {
      final labelsData =
          await DefaultAssetBundle.of(context).loadString('assets/labels.txt');
      return labelsData.split('\n').map((label) => label.trim()).toList();
    } catch (e) {
      debugPrint('Error loading labels file: $e');
      return [];
    }
  }

  void navigateToResult() {
    if (_result != null && _objectType != null) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => MyResult(
            image: _image,
            result: _result!,
            objectType: _objectType!,
          ),
        ),
      );
    } else {
      debugPrint('Result or object type is null');
    }
  }
}
