import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createTeachersComment } from '../services/airtableService';

const AddTeachersComment = ({ navigation, route }) => {
  const { studentId } = route.params;
  const [date, setDate] = useState(new Date());
  const [comment, setComment] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // Keep date picker on screen for iOS
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError('Please enter a comment.');
      return;
    }

    const commentData = {
      Student: [studentId],
      Date: date.toISOString().split('T')[0],
      Comment: comment
    };

    try {
      await createTeachersComment(commentData);
      setShowConfirmationModal(true); // Show confirmation modal on success
    } catch (error) {
      console.error('Failed to create teacher\'s comment:', error);
      setError('Failed to submit comment. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Teacher's Comment</Text>
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
        <Icon name="calendar-today" size={20} color="#fff" />
        <Text style={styles.datePickerText}>Pick Date</Text>
      </TouchableOpacity>
      <Text style={styles.dateDisplay}>Date: {date.toISOString().split('T')[0]}</Text>
      <TextInput
        placeholder="Teacher's comment"
        placeholderTextColor="#ccc"
        value={comment}
        onChangeText={text => {
          setComment(text);
          setError(''); // Clear error when user starts typing
        }}
        style={styles.input}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Submit Comment" onPress={handleSubmit} color="#1B73E8" />

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="spinner"
          onChange={onDateChange}
        />
      )}

      {showConfirmationModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showConfirmationModal}
          onRequestClose={() => {
            setShowConfirmationModal(false);
            navigation.goBack();
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Comment added successfully!</Text>
              <Button
                title="OK"
                onPress={() => {
                  setShowConfirmationModal(false);
                  navigation.goBack();
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#252C30',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF'
  },
  label: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10
  },
  input: {
    height: 50,
    backgroundColor: '#333840',
    borderColor: '#666',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#FFF'
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B73E8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10
  },
  datePickerText: {
    color: '#FFF',
    marginLeft: 10
  },
  dateDisplay: {
    fontSize: 16,
    color: '#FFF',
    paddingVertical: 10
  },
  errorText: {
    color: 'red',
    marginBottom: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: '#333840',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFF',
  }
});

export default AddTeachersComment;
