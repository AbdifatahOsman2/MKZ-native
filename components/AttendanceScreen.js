// AttendanceScreen.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const AttendanceScreen = ({ route }) => {
  const { attendances } = route.params;

  return (
    <ScrollView>
      <View style={{ marginBottom: 20, padding: 10, borderWidth: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Attendance</Text>
        {attendances.map(attendance => (
          <Text key={attendance.id}>Attendance Date: {attendance.Date}, Status: {attendance.Attendance}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default AttendanceScreen;
