import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createLesson } from '../services/airtableService';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure you have this library installed
import RNPickerSelect from 'react-native-picker-select'; // Import the Picker Select

const AddLesson = ({ navigation, route }) => {
  const { studentId } = route.params;
  const [date, setDate] = useState(new Date());
  const [passed, setPassed] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // Keeps the picker open on iOS after date selection
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    // Check for empty fields
    if (!passed.trim()) {
      setError('Please specify if passed or not.');
      return;
    }

    const lessonData = {
      Students: [studentId],
      Date: date.toISOString().split('T')[0], // Formats the date to YYYY-MM-DD
      Passed: passed
    };

    try {
      await createLesson(lessonData);
      setShowConfirmationModal(true); // Show confirmation modal on success
    } catch (error) {
      console.error('Failed to create lesson:', error);
      setError('Failed to submit lesson. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Lesson</Text>
      <Text style={styles.label}>Student ID: {studentId}</Text>
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
        <Icon name="calendar-today" size={20} color="#fff" />
        <Text style={styles.datePickerText}>Pick Date</Text>
      </TouchableOpacity>
      <Text style={styles.dateDisplay}>Date: {date.toISOString().split('T')[0]}</Text>
      <RNPickerSelect
      onValueChange={(value) => setPassed(value)}
      items={[
          { label: 'Passed Full', value: 'Passed Full' },
          { label: 'Passed Half', value: 'Passed Half' },
          { label: 'Passed None', value: 'Passed None' },
      ]}
      style={pickerSelectStyles}
      value={passed}
  />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Submit Lesson" onPress={handleSubmit} color="#5cb85c" />

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? "spinner" : "default"}
          onChange={onDateChange}
          is24Hour={true}
        />
      )}

      {showConfirmationModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showConfirmationModal}
          onRequestClose={() => {
            setShowConfirmationModal(false);
            navigation.goBack(); // Optionally navigate back
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Lesson added successfully!</Text>
              <Button
                title="OK"
                onPress={() => {
                  setShowConfirmationModal(false);
                  navigation.goBack(); // Navigate back after confirming
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
    backgroundColor: '#f4f4f4',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10
  },
  input: {
    height: 50,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10
  },
  datePickerText: {
    color: '#fff',
    marginLeft: 10
  },
  dateDisplay: {
    fontSize: 16,
    marginBottom: 20
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
    backgroundColor: 'white',
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
    textAlign: 'center'
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
  },
});


export default AddLesson;
