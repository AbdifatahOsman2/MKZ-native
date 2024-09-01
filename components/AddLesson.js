import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, DatePickerAndroid } from 'react-native';
import { createLesson } from '../services/airtableService'; // Ensure you have a method to post lesson data

const AddLesson = ({ navigation, route }) => {
  const { studentId } = route.params;
  const [date, setDate] = useState('');
  const [passed, setPassed] = useState('');

  const handleSubmit = async () => {
    const lessonData = {
      Students: [studentId],
      Date: date,
      Passed: passed
    };

    try {
      await createLesson(lessonData); // Implement this function in your airtableService
      navigation.goBack(); // Navigate back after submission
    } catch (error) {
      console.error('Failed to create lesson:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Student ID: {studentId}</Text>
      <TextInput
        placeholder="2024-08-13"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Passed? (Yes or No)"
        value={passed}
        onChangeText={setPassed}
        style={styles.input}
      />
      <Button title="Submit Lesson" onPress={handleSubmit} />
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

export default AddLesson;
