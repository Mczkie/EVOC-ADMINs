// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:evocapp/components/calendar.dart';
import 'package:evocapp/database/db_helper.dart';
import 'package:evocapp/screens/startup.dart';

class MyHome extends StatefulWidget {
  final String email;

  const MyHome({super.key, required this.email});

  @override
  State<MyHome> createState() => _MyHomeState();
}

class _MyHomeState extends State<MyHome> {
  final DbHelper _dbHelper = DbHelper();
  final bool _isLoggedIn = true;
  Map<DateTime, String> _eventDates = {};
  DateTime? _selectedDate;
  String _eventNote = '';

  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
    _loadEventDates(); // Load event dates when the widget is initialized
  }

  Future<void> _checkLoginStatus() async {
    String? loggedInUser = await _dbHelper.getLoggedInUser();
  }

  Future<void> _loadEventDates() async {
    final reports = await _dbHelper.getReports();
    final eventDates = await _dbHelper.getUniqueEventDates();

    final events = <DateTime, String>{};
    for (var date in eventDates) {
      events[date] = 'No Description'; // Placeholder for description
    }

    for (var report in reports) {
      final dateStr = report['eventDate'] as String?;
      if (dateStr != null) {
        final date = DateTime.parse(dateStr);
        events[date] = report['note'] as String;
      }
    }

    setState(() {
      _eventDates = events;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!_isLoggedIn) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              const SizedBox(height: 30),
              Center(
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: const BorderRadius.all(Radius.circular(20)),
                    color: Colors
                        .blueGrey[200], // Background color for the container
                  ),
                  width: 300,
                  height: 200, // Adjust height as needed
                  padding: const EdgeInsets.all(8),
                  child: _eventDates.isNotEmpty
                      ? ListView.builder(
                          itemCount: _eventDates.length,
                          itemBuilder: (context, index) {
                            final date = _eventDates.keys.elementAt(index);
                            final description = _eventDates[date]!;
                            return ListTile(
                              title: Text(
                                '${date.toLocal().toString().split(' ')[0]} - $description',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              trailing: IconButton(
                                icon:
                                    const Icon(Icons.delete, color: Colors.red),
                                onPressed: () async {
                                  // Confirm before deleting
                                  final shouldDelete = await showDialog<bool>(
                                    context: context,
                                    builder: (context) {
                                      return AlertDialog(
                                        title: const Text('Delete Event'),
                                        content: const Text(
                                            'Are you sure you want to delete this event?'),
                                        actions: [
                                          TextButton(
                                            onPressed: () =>
                                                Navigator.of(context).pop(true),
                                            child: const Text('Yes'),
                                          ),
                                          TextButton(
                                            onPressed: () =>
                                                Navigator.of(context)
                                                    .pop(false),
                                            child: const Text('No'),
                                          ),
                                        ],
                                      );
                                    },
                                  );
                                  if (shouldDelete == true) {
                                    await _dbHelper.deleteReportsByDate(date);
                                    _loadEventDates(); // Refresh the list of dates
                                  }
                                },
                              ),
                              onTap: () {
                                setState(() {
                                  _selectedDate = date;
                                });
                                _showCalendarDialog();
                              },
                            );
                          },
                        )
                      : const Center(child: Text('No Event Dates')),
                ),
              ),
              const SizedBox(height: 50),
            ],
          ),
        ),
      ),
    );
  }

  void _showCalendarDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Select Date'),
          content: SizedBox(
            width: double.maxFinite,
            child: MyCalendar(
              initialDate: _selectedDate,
              onDateSelected: (date) {
                setState(() {
                  if (_selectedDate != null) {
                    _eventDates.remove(_selectedDate);
                  }
                  _selectedDate = date;
                });
              },
            ),
          ),
          actions: [
            TextField(
              decoration: const InputDecoration(
                labelText: 'Event Note',
              ),
              onChanged: (value) {
                setState(() {
                  _eventNote = value;
                });
              },
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () async {
                if (_selectedDate != null) {
                  await _dbHelper.insertReport(_eventNote, _selectedDate!);
                  Navigator.of(context).pop();
                  _loadEventDates(); // Refresh the list of dates
                }
              },
              child: const Text('Add'),
            ),
          ],
        );
      },
    );
  }
}
