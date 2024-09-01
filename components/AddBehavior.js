import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { createBehavior } from '../services/airtableService'; // Use the method to post behavior data

const AddBehavior = ({ navigation, route }) => {
  const { studentId } = route.params; // Retrieve the student ID passed from the previous screen

  const [date, setDate] = useState('');
  const [behaviorDescription, setBehaviorDescription] = useState('');

  const handleSubmit = async () => {
    const behaviorData = {
    Students: [studentId],
    Date: date,
    Behavior: behaviorDescription
    };

    try {
      await createBehavior(behaviorData); // Use the createBehavior function
      navigation.goBack(); // Navigate back after submission
    } catch (error) {
      console.error('Failed to create behavior:', error);
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
        placeholder="Behavior description"
        value={behaviorDescription}
        onChangeText={setBehaviorDescription}
        style={styles.input}
      />
      <Button title="Submit Behavior" onPress={handleSubmit} />
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

export default AddBehavior;
