import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:evocapp/database/db_helper.dart';

class MyCalendar extends StatefulWidget {
  final DateTime? initialDate;
  final ValueChanged<DateTime>? onDateSelected;

  const MyCalendar({super.key, this.initialDate, this.onDateSelected});

  @override
  State<MyCalendar> createState() => _MyCalendarState();
}

class _MyCalendarState extends State<MyCalendar> {
  late DateTime _focusedDay;
  DateTime? _selectedDay;
  Map<DateTime, List<String>> _events = {};

  @override
  void initState() {
    super.initState();
    _focusedDay = widget.initialDate ?? DateTime.now();
    _selectedDay = widget.initialDate;
    _loadEvents();
  }

  @override
  Widget build(BuildContext context) {
    return TableCalendar(
      focusedDay: _focusedDay,
      firstDay: DateTime.utc(2024, 5, 12),
      lastDay: DateTime.utc(2030, 12, 31),
      selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
      onDaySelected: _onDaySelected,
      eventLoader: _getEventsForDay,
    );
  }

  void _onDaySelected(DateTime selectedDay, DateTime focusedDay) {
    if (!isSameDay(_selectedDay, selectedDay)) {
      setState(() {
        _selectedDay = selectedDay;
        _focusedDay = focusedDay;
      });
      if (widget.onDateSelected != null) {
        widget.onDateSelected!(selectedDay);
      }
    }
  }

  List<String> _getEventsForDay(DateTime day) {
    return _events[day] ?? [];
  }

  void _loadEvents() async {
    final dbHelper = DbHelper();
    final reports = await dbHelper.getReports();
    final eventDates = await dbHelper.getUniqueEventDates();

    final events = <DateTime, List<String>>{};
    for (var date in eventDates) {
      events[date] = [];
    }

    for (var report in reports) {
      final dateStr = report['eventDate'] as String?;
      if (dateStr != null) {
        final date = DateTime.parse(dateStr);
        if (!events.containsKey(date)) {
          events[date] = [];
        }
        events[date]!.add(report['note'] as String);
      }
    }

    setState(() {
      _events = events;
    });
  }
}
