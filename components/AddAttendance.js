import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createAttendance } from '../services/airtableService';

const AddAttendance = ({ navigation, route }) => {
  const { studentId } = route.params;
  const [date, setDate] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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

  // Format date in local time zone to prevent the date from incrementing
  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!attendanceStatus.trim()) {
      setError('Please enter an attendance status.');
      return;
    }

    const attendanceData = {
      Students: [studentId],
      Date: formatDate(date),
      Attendance: attendanceStatus
    };

    try {
      await createAttendance(attendanceData);
      setShowConfirmationModal(true);
    } catch (error) {
      console.error('Failed to create attendance:', error);
      setError('Failed to submit attendance. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Student Attendance</Text>

      <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
        <Icon name="calendar-today" size={20} color="#fff" />
        <Text style={styles.datePickerText}>Pick Date</Text>
      </TouchableOpacity>

      <Text style={styles.dateDisplay}>Date: {formatDate(date)}</Text>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        themeVariant="light" // Set light theme for DateTimePicker
        textColor="#000" // Ensure text is visible for light theme
      />

      {/* Attendance Status Input */}
      <TextInput
        placeholder="Attendance Status (Present, Absent, etc.)"
        placeholderTextColor="#ccc"
        value={attendanceStatus}
        onChangeText={text => {
          setAttendanceStatus(text);
          setError(''); // Clear error when user starts typing
        }}
        style={styles.input}
      />

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Attendance</Text>
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
              <Text style={styles.modalText}>Attendance recorded successfully!</Text>
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
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF'
  },
  input: {
    height: 50,
    backgroundColor: '#333840',
    borderColor: '#666',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#FFF',
    borderRadius: 5,
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFF',
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
  }
});

export default AddAttendance;
