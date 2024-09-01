import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { createAttendance } from '../services/airtableService'; // Make sure to have a method to post attendance data

const AddAttendance = ({ navigation, route }) => {
  const { studentId } = route.params; // Retrieve the student ID passed from the previous screen

  const [date, setDate] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');

  const handleSubmit = async () => {
    const attendanceData = {
      Students: [studentId],
      Date: date,
      Attendance: attendanceStatus // Make sure the field names match those in your Airtable
    };

    try {
      await createAttendance(attendanceData); // Use the createAttendance function
      navigation.goBack(); // Navigate back after submission
    } catch (error) {
      console.error('Failed to create attendance:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Student ID: {studentId}</Text>
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Attendance Status (Present, Absent, etc.)"
        value={attendanceStatus}
        onChangeText={setAttendanceStatus}
        style={styles.input}
      />
      <Button title="Submit Attendance" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10
  }
});

export default AddAttendance;
