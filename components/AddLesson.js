import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform, TextInput, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { createLesson } from '../services/airtableService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddLesson = ({ navigation, route }) => {
  const { studentId } = route.params;
  const { StudentClass } = route.params;
  console.log(route.params);
  const [date, setDate] = useState(new Date());
  const [lessonDescription, setLessonDescription] = useState('');
  const [selectedLessonType, setSelectedLessonType] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false); // New state for dropdown visibility

  const lessonOptions = [
    { label: 'Passed Full', value: 'Passed Full' },
    { label: 'Passed Half', value: 'Passed Half' },
    { label: 'Passed None', value: 'Passed None' },
    { label: 'Other', value: 'Other' },
  ];

  // Show Date Picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    let finalLessonDescription =
      selectedLessonType === 'Other' ? lessonDescription : selectedLessonType;

    if (!finalLessonDescription || !finalLessonDescription.trim()) {
      setError('Please select a lesson type or enter a description.');
      return;
    }

    const formattedDate = formatDate(date);

    const lessonData = {
      Students: [studentId],
      Date: formattedDate,
      Passed: finalLessonDescription,
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

      <Text style={styles.dateDisplay}>Date: {formatDate(date)}</Text>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        themeVariant="light"
        textColor="#fff"
      />

      {/* Custom Dropdown for Lesson Type */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(true)}
      >
        <Text
          style={
            selectedLessonType
              ? styles.dropdownButtonText
              : styles.dropdownPlaceholderText
          }
        >
          {selectedLessonType || 'Select a lesson type...'}
        </Text>
        <Icon name="arrow-drop-down" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        />
        <View style={styles.dropdownModal}>
          <FlatList
            data={lessonOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedLessonType(item.value);
                  setError('');
                  setDropdownVisible(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Show description input if 'Other' is selected */}
      {selectedLessonType === 'Other' && (
        <TextInput
          placeholder="Enter lesson description"
          placeholderTextColor="#ccc"
          value={lessonDescription}
          onChangeText={(text) => {
            setLessonDescription(text);
            setError('');
          }}
          style={styles.input}
        />
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
  // Existing styles
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
    color: '#FFF',
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
    marginBottom: 10,
  },
  datePickerText: {
    color: '#FFF',
    marginLeft: 10,
  },
  dateDisplay: {
    fontSize: 18,
    color: '#FFF',
    paddingVertical: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#1B73E8',
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
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#333840',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#1B73E8',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFF',
  },
  // New styles for the custom dropdown
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333840',
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20,
  },
  dropdownButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  dropdownPlaceholderText: {
    color: '#aaa',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownModal: {
    position: 'absolute',
    top: '55%',
    left: '10%',
    right: '10%',
    backgroundColor: '#333840',
    borderRadius: 5,
    padding: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: '#666',
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default AddLesson;
