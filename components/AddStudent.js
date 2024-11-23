import React, { useState, useEffect, useRef } from 'react';
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
  FlatList,
} from 'react-native';
import { createStudent } from '../services/airtableService';
import { ParentsPhoneNumber, getTeacherNames } from '../firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';
import backgroundImage from '../assets/AddstudentBG.png'; // Replace with your image path

const AddStudent = ({ navigation, route }) => {
  const [studentName, setStudentName] = useState('');
  const [age, setAge] = useState('');
  const [classroom, setClassroom] = useState('');
  const [schedule, setSchedule] = useState('');
  const [gender, setGender] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [parentPhoneNumber, setParentPhoneNumber] = useState('');
  const [parentPhoneNumbers, setParentPhoneNumbers] = useState([]);
  const { name } = route.params;

  // Dropdown visibility and layout states
  const [isClassroomDropdownVisible, setClassroomDropdownVisible] = useState(false);
  const classDropdownButtonRef = useRef();
  const [classDropdownLayout, setClassDropdownLayout] = useState(null);

  const [isScheduleDropdownVisible, setScheduleDropdownVisible] = useState(false);
  const scheduleDropdownButtonRef = useRef();
  const [scheduleDropdownLayout, setScheduleDropdownLayout] = useState(null);

  const [isGenderDropdownVisible, setGenderDropdownVisible] = useState(false);
  const genderDropdownButtonRef = useRef();
  const [genderDropdownLayout, setGenderDropdownLayout] = useState(null);

  const [isPhoneNumberDropdownVisible, setPhoneNumberDropdownVisible] = useState(false);
  const phoneNumberDropdownButtonRef = useRef();
  const [phoneNumberDropdownLayout, setPhoneNumberDropdownLayout] = useState(null);

  const [isTeacherDropdownVisible, setTeacherDropdownVisible] = useState(false);
  const teacherDropdownButtonRef = useRef();
  const [teacherDropdownLayout, setTeacherDropdownLayout] = useState(null);

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
        returnKeyType="done"
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

        {/* Custom Dropdown for Class */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Class</Text>
          <TouchableOpacity
            ref={classDropdownButtonRef}
            style={styles.dropdownButton}
            onPress={() => {
              classDropdownButtonRef.current.measure(
                (fx, fy, width, height, px, py) => {
                  setClassDropdownLayout({ x: px, y: py, width, height });
                  setClassroomDropdownVisible(true);
                }
              );
            }}
          >
            <Text
              style={
                classroom ? styles.dropdownButtonText : styles.dropdownPlaceholderText
              }
            >
              {classroom || 'Select Class'}
            </Text>
            <Icon name="arrow-drop-down" size={24} color="#FFF" />
          </TouchableOpacity>
          {isClassroomDropdownVisible && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={isClassroomDropdownVisible}
              onRequestClose={() => setClassroomDropdownVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setClassroomDropdownVisible(false)}
              />
              <View
                style={[
                  styles.dropdownModal,
                  {
                    top: classDropdownLayout
                      ? classDropdownLayout.y + classDropdownLayout.height
                      : 0,
                    left: classDropdownLayout ? classDropdownLayout.x : 0,
                    width: classDropdownLayout ? classDropdownLayout.width : '100%',
                  },
                ]}
              >
                <FlatList
                  data={[
                    { label: 'Quran', value: 'Quran' },
                    { label: 'Alif', value: 'Alif' },
                  ]}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setClassroom(item.value);
                        setClassroomDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Modal>
          )}
        </View>

        {/* Custom Dropdown for Schedule */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Schedule</Text>
          <TouchableOpacity
            ref={scheduleDropdownButtonRef}
            style={styles.dropdownButton}
            onPress={() => {
              scheduleDropdownButtonRef.current.measure(
                (fx, fy, width, height, px, py) => {
                  setScheduleDropdownLayout({ x: px, y: py, width, height });
                  setScheduleDropdownVisible(true);
                }
              );
            }}
          >
            <Text
              style={
                schedule ? styles.dropdownButtonText : styles.dropdownPlaceholderText
              }
            >
              {schedule || 'Select Schedule'}
            </Text>
            <Icon name="arrow-drop-down" size={24} color="#FFF" />
          </TouchableOpacity>
          {isScheduleDropdownVisible && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={isScheduleDropdownVisible}
              onRequestClose={() => setScheduleDropdownVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setScheduleDropdownVisible(false)}
              />
              <View
                style={[
                  styles.dropdownModal,
                  {
                    top: scheduleDropdownLayout
                      ? scheduleDropdownLayout.y + scheduleDropdownLayout.height
                      : 0,
                    left: scheduleDropdownLayout ? scheduleDropdownLayout.x : 0,
                    width: scheduleDropdownLayout
                      ? scheduleDropdownLayout.width
                      : '100%',
                  },
                ]}
              >
                <FlatList
                  data={[
                    {
                      label: '8:00 AM - 12:00 PM, Sat-Sun, Wed',
                      value: '8:00 AM - 12:00 PM, Sat-Sun, Wed ',
                    },
                    {
                      label: '1:00 PM - 05:00 PM, Sat-Sun, Fri',
                      value: '1:00 PM - 05:00 PM, Sat-Sun, Fri',
                    },
                  ]}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSchedule(item.value);
                        setScheduleDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Modal>
          )}
        </View>

        {/* Custom Dropdown for Gender */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity
            ref={genderDropdownButtonRef}
            style={styles.dropdownButton}
            onPress={() => {
              genderDropdownButtonRef.current.measure(
                (fx, fy, width, height, px, py) => {
                  setGenderDropdownLayout({ x: px, y: py, width, height });
                  setGenderDropdownVisible(true);
                }
              );
            }}
          >
            <Text
              style={gender ? styles.dropdownButtonText : styles.dropdownPlaceholderText}
            >
              {gender || 'Select Gender'}
            </Text>
            <Icon name="arrow-drop-down" size={24} color="#FFF" />
          </TouchableOpacity>
          {isGenderDropdownVisible && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={isGenderDropdownVisible}
              onRequestClose={() => setGenderDropdownVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setGenderDropdownVisible(false)}
              />
              <View
                style={[
                  styles.dropdownModal,
                  {
                    top: genderDropdownLayout
                      ? genderDropdownLayout.y + genderDropdownLayout.height
                      : 0,
                    left: genderDropdownLayout ? genderDropdownLayout.x : 0,
                    width: genderDropdownLayout ? genderDropdownLayout.width : '100%',
                  },
                ]}
              >
                <FlatList
                  data={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                  ]}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setGender(item.value);
                        setGenderDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Modal>
          )}
        </View>

        {/* Custom Dropdown for Phone Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TouchableOpacity
            ref={phoneNumberDropdownButtonRef}
            style={styles.dropdownButton}
            onPress={() => {
              phoneNumberDropdownButtonRef.current.measure(
                (fx, fy, width, height, px, py) => {
                  setPhoneNumberDropdownLayout({ x: px, y: py, width, height });
                  setPhoneNumberDropdownVisible(true);
                }
              );
            }}
          >
            <Text
              style={
                parentPhoneNumber
                  ? styles.dropdownButtonText
                  : styles.dropdownPlaceholderText
              }
            >
              {formatPhoneNumber(parentPhoneNumber) || 'Select Parent Phone Number'}
            </Text>
            <Icon name="arrow-drop-down" size={24} color="#FFF" />
          </TouchableOpacity>
          {isPhoneNumberDropdownVisible && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={isPhoneNumberDropdownVisible}
              onRequestClose={() => setPhoneNumberDropdownVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setPhoneNumberDropdownVisible(false)}
              />
              <View
                style={[
                  styles.dropdownModal,
                  {
                    top: phoneNumberDropdownLayout
                      ? phoneNumberDropdownLayout.y + phoneNumberDropdownLayout.height
                      : 0,
                    left: phoneNumberDropdownLayout ? phoneNumberDropdownLayout.x : 0,
                    width: phoneNumberDropdownLayout ? phoneNumberDropdownLayout.width : '100%',
                  },
                ]}
              >
                <FlatList
                  data={parentPhoneNumbers}
                  keyExtractor={(item, index) => `${item.value}-${index}`} // Ensure unique keys
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setParentPhoneNumber(item.value);
                        setPhoneNumberDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Modal>
          )}
        </View>

        {/* Custom Dropdown for Teacher */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Teacher</Text>
          <TouchableOpacity
            ref={teacherDropdownButtonRef}
            style={styles.dropdownButton}
            onPress={() => {
              teacherDropdownButtonRef.current.measure(
                (fx, fy, width, height, px, py) => {
                  setTeacherDropdownLayout({ x: px, y: py, width, height });
                  setTeacherDropdownVisible(true);
                }
              );
            }}
          >
            <Text
              style={
                selectedTeacher
                  ? styles.dropdownButtonText
                  : styles.dropdownPlaceholderText
              }
            >
              {selectedTeacher || 'Select Teacher'}
            </Text>
            <Icon name="arrow-drop-down" size={24} color="#FFF" />
          </TouchableOpacity>

          {isTeacherDropdownVisible && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={isTeacherDropdownVisible}
              onRequestClose={() => setTeacherDropdownVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setTeacherDropdownVisible(false)}
              />
              <View
                style={[
                  styles.dropdownModal,
                  {
                    top: teacherDropdownLayout
                      ? teacherDropdownLayout.y + teacherDropdownLayout.height
                      : 0,
                    left: teacherDropdownLayout ? teacherDropdownLayout.x : 0,
                    width: teacherDropdownLayout ? teacherDropdownLayout.width : '100%',
                  },
                ]}
              >
                <FlatList
                  data={teachers}
                  keyExtractor={(item, index) => `${item.value}-${index}`} // Ensure unique keys
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedTeacher(item.value);
                        setTeacherDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Modal>
          )}
        </View>

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
            <TouchableOpacity style={styles.buttonClose} onPress={handleModalClose}>
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
  // Styles for custom dropdowns
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(51, 56, 64, 0.8)',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dropdownButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  dropdownPlaceholderText: {
    color: '#999',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
  },
  dropdownModal: {
    position: 'absolute',
    backgroundColor: '#333840',
    borderRadius: 10,
    maxHeight: 200,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 15,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default AddStudent;
