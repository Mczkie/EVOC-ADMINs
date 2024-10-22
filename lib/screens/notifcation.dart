import 'package:evocapp/database/db_helper.dart';
import 'package:flutter/material.dart';

class MyNotification extends StatefulWidget {
  const MyNotification({Key? key}) : super(key: key);

  @override
  State<MyNotification> createState() => _MyNotificationState();
}

class _MyNotificationState extends State<MyNotification> {
  final TextEditingController _textEditingController = TextEditingController();
  final DbHelper _dbHelper = DbHelper();
  List<Map<String, dynamic>> _reports = [];

  @override
  void initState() {
    super.initState();
    _loadReports();
  }

  Future<void> _loadReports() async {
    final reports = await _dbHelper.getReports();
    setState(() {
      _reports = reports;
    });
  }

  void _addNote() async {
    String note = _textEditingController.text;
    if (note.isNotEmpty) {
      DateTime eventDate = DateTime.now();
      await _dbHelper.insertReport(note, eventDate);
      _textEditingController.clear();
      _loadReports();
    }
  }

  void _deletReport(int id) async {
    await _dbHelper.deleteReports(id);
    _loadReports();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white12,
        title: const Text('Reports'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            TextField(
              controller: _textEditingController,
              decoration: const InputDecoration(
                hintText: 'Enter you note here',
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _addNote,
              child: const Text('Add Note'),
            ),
            const SizedBox(height: 20),
            Expanded(
                child: _reports.isEmpty
                    ? const Center(child: Text('No report yet'))
                    : ListView.builder(
                        itemCount: _reports.length,
                        itemBuilder: (context, index) {
                          final report = _reports[index];
                          return Card(
                            child: ListTile(
                              title: Text(report['note']),
                              trailing: IconButton(
                                  onPressed: () => _deletReport(report['id']),
                                  icon: const Icon(Icons.delete)),
                            ),
                          );
                        },
                      )),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _textEditingController.dispose();
    super.dispose();
  }
}
