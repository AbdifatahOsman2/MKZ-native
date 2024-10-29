import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { createStudent } from '../services/airtableService';
import RNPickerSelect from 'react-native-picker-select';
import { ParentsPhoneNumber, getTeacherNames } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import backgroundImage from '../assets/AddstudentBG.png'; // Replace with your image path

const AddStudent = ({ navigation, route }) => {
  const [studentName, setStudentName] = useState('');
  const [age, setAge] = useState('');
  const [classroom, setClassroom] = useState('Quran');
  const [schedule, setSchedule] = useState('Sat-Sun');
  const [gender, setGender] = useState('Male');
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [parentPhoneNumber, setParentPhoneNumber] = useState('');
  const [parentPhoneNumbers, setParentPhoneNumbers] = useState([]);
  const { name } = route.params;

  useEffect(() => {
    async function loadInitialData() {
      try {
        // Fetch parent phone numbers
        const phoneNumbers = await ParentsPhoneNumber();
        setParentPhoneNumbers(
          phoneNumbers.map((phone) => ({
            label: formatPhoneNumber(phone),
            value: phone,
          }))
        );

        // Fetch teacher names using getTeacherNames
        const teacherNames = await getTeacherNames();
        setTeachers(
          teacherNames.map((name) => ({
            label: name,
            value: name,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data. Please try again.');
      }
    }

    loadInitialData();
  }, []);

  const formatPhoneNumber = (phoneNumberString) => {
    // Format the phone number as XXX-XXX-XXXX
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3];
    }
    return phoneNumberString;
  };

  const handleSubmit = async () => {
    if (
      !studentName ||
      !age ||
      !classroom ||
      !schedule ||
      !gender ||
      !parentPhoneNumber ||
      !selectedTeacher
    ) {
      setError('Please fill in all fields.');
      return;
    }

    const studentData = {
      StudentName: studentName,
      Age: age,
      class: classroom,
      schedule: schedule,
      Gender: gender,
      PhoneNumber: parentPhoneNumber,
      teacherName: selectedTeacher,
    };

    try {
      await createStudent(studentData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to create student:', error);
      setError('Failed to submit. Please try again.');
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigation.replace('AdminView', { name });
  };

  const renderInput = (
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default'
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderPicker = (label, value, onValueChange, items, placeholder) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={items}
        style={pickerSelectStyles}
        value={value}
        placeholder={placeholder}
        useNativeAndroidPickerStyle={false}
        Icon={() => <Ionicons name="chevron-down" size={24} color="#FFF" />}
      />
    </View>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView style={styles.container}>
        <Text style={styles.sectionHeader}>Add Student</Text>

        {renderInput(
          'Student Name',
          studentName,
          setStudentName,
          'Enter student name'
        )}
        {renderInput('Age', age, setAge, 'Enter age', 'numeric')}

        {renderPicker(
          'Class',
          classroom,
          setClassroom,
          [
            { label: 'Quran', value: 'Quran' },
            { label: 'Alif', value: 'Alif' },
          ],
          { label: 'Select Class', value: null }
        )}

        {renderPicker(
          'Schedule',
          schedule,
          setSchedule,
          [
            {
              label: '8:00 AM - 12:00 PM, Sat-Sun, Wed',
              value: '8:00 AM - 12:00 PM, Sat-Sun, Wed ',
            },
            {
              label: '01:00 PM - 05:00 PM, Sat-Sun, Fri',
              value: '01:00 PM - 05:00 PM, Sat-Sun, Fri',
            },
          ],
          { label: 'Select Schedule', value: null }
        )}

        {renderPicker(
          'Gender',
          gender,
          setGender,
          [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
          ],
          { label: 'Select Gender', value: null }
        )}

        {renderPicker(
          'Phone Number',
          parentPhoneNumber,
          setParentPhoneNumber,
          parentPhoneNumbers,
          { label: 'Select Parent Phone Number', value: null }
        )}

        {renderPicker(
          'Teacher',
          selectedTeacher,
          setSelectedTeacher,
          teachers,
          { label: 'Select Teacher', value: null }
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Student added successfully!</Text>
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={handleModalClose}
            >
              <Text style={styles.textStyle}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 90, // Added paddingTop to prevent overlap with status bar
    backgroundColor: 'rgba(37, 44, 48, 0.8)',
  },
  sectionHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(51, 56, 64, 0.8)',
    borderColor: '#444',
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 8,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2dba4e',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Adjusted background color for transparency
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#333840',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#1B73E8',
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 30,
    elevation: 2,
    marginTop: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    color: '#FFF',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: 'rgba(51, 56, 64, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    color: '#FFF',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: 'rgba(51, 56, 64, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    top: 12,
    right: 12,
  },
});

export default AddStudent;
