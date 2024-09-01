import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { createTeachersComment } from '../services/airtableService'; // Ensure you have a method to post comment data

const AddTeachersComment = ({ navigation, route }) => {
  const { studentId } = route.params; // Retrieve the student ID passed from the previous screen

  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    const commentData = {
      Student: [studentId],
      Date: date,
      Comment: comment
    };

    try {
      await createTeachersComment(commentData); // Use the createTeachersComment function
      navigation.goBack(); // Navigate back after submission
    } catch (error) {
      console.error('Failed to create teacher\'s comment:', error);
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
        placeholder="Teacher's comment"
        value={comment}
        onChangeText={setComment}
        style={styles.input}
      />
      <Button title="Submit Comment" onPress={handleSubmit} />
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

export default AddTeachersComment;
