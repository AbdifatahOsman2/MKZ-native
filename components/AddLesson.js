import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // New Date Picker
import { createLesson } from '../services/airtableService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';

const AddLesson = ({ navigation, route }) => {
  const { studentId } = route.params;
  const [date, setDate] = useState(new Date());
  const [passed, setPassed] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Show Date Picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Hide Date Picker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Handle Date Confirm
  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const handleSubmit = async () => {
    if (!passed.trim()) {
      setError('Please specify if passed or not.');
      return;
    }

    const lessonData = {
      Students: [studentId],
      Date: date.toISOString().split('T')[0],
      Passed: passed
    };

    try {
      await createLesson(lessonData);
      setShowConfirmationModal(true);
    } catch (error) {
      console.error('Failed to create lesson:', error);
      setError('Failed to submit lesson. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Lesson</Text>

      {/* Date Picker Button */}
      <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
        <Icon name="calendar-today" size={20} color="#fff" />
        <Text style={styles.datePickerText}>Pick Date</Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        // Custom style for dark theme
        themeVariant="light" // Use dark theme on iOS and Android
        textColor="#fff"  // Ensure the text is visible on the dark background
      />

      {/* Picker for 'Passed' status */}
      <RNPickerSelect
        onValueChange={value => setPassed(value)}
        items={[
          { label: 'Passed Full', value: 'Passed Full' },
          { label: 'Passed Half', value: 'Passed Half' },
          { label: 'Passed None', value: 'Passed None' },
        ]}
        style={pickerSelectStyles}
        value={passed}
      />

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Lesson</Text>
      </TouchableOpacity>

      {/* Success Modal */}
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
              <Text style={styles.modalText}>Lesson added successfully!</Text>
              <TouchableOpacity
                style={styles.buttonClose}
                onPress={() => {
                  setShowConfirmationModal(false);
                  navigation.goBack();
                }}
              >
                <Text style={styles.textStyle}>OK</Text>
              </TouchableOpacity>
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    fontSize: 18,
    color: '#FFF',
    paddingVertical: 10
  },
  errorText: {
    color: 'red',
    marginBottom: 10
  },
  submitButton: {
    backgroundColor: "#1B73E8",
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
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
  buttonClose: {
    backgroundColor: "#1B73E8",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: '#FFF',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'white',
    backgroundColor: '#333840',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'white',
    backgroundColor: '#333840',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
};

export default AddLesson;
