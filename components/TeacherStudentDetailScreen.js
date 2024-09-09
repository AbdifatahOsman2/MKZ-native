import React, { useLayoutEffect, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getStudentsData } from '../services/airtableService';

// Images
import maleImage from '../assets/M-1-Image.png'; 
import femaleImage from '../assets/Fm1-Image.png';
import { deleteStudent } from '../services/airtableService';
import lessonIcon from '../assets/Lessonbtn.png';  
import behaviorIcon from '../assets/Behaviorbtn.png';
import attendanceIcon from '../assets/Attendancebtn.png';
import commentIcon from '../assets/Commentbtn.png';

const TeacherStudentDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { student } = route.params;

    useEffect(() => {
    if (route.params?.reload) {
      getStudentsData(); // Reload the data when navigated back from AddStudent
    }
  }, [route.params?.reload]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete} style={{ paddingRight: 10 }}>
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Student",
      "Are you sure you want to delete this student?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
          try {
            await deleteStudent(student.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert("Error", "Failed to delete student.");
            console.error('Failed to delete student:', error);
          }
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={student.Gender === 'Male' ? maleImage : femaleImage}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.studentName}>{student.StudentName}</Text>
          <Text style={styles.studentInfo}>Age: {student.Age}</Text>
          <Text style={styles.studentInfo}>Class: {student.class}</Text>
          <Text style={styles.studentInfo}>Schedule: {student.schedule}</Text>
          <Text style={styles.studentInfo}>Teacher: {student.teacherName}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Lessons', { lessons: student.LessonsData, TeacherID: student.TeacherID, StudentID: student.id })}
        >
          <Image source={lessonIcon} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Lessons</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Behavior', { behaviors: student.BehaviorData, TeacherID: student.TeacherID, StudentID: student.id })}
        >
          <Image source={behaviorIcon} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Behavior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Attendance', { attendances: student.AttendanceData, TeacherID: student.TeacherID, StudentID: student.id })}
        >
          <Image source={attendanceIcon} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TeachersComment', { comments: student.TeachersComment, TeacherID: student.TeacherID, StudentID: student.id, cm : student.Comment })}
        >
          <Image source={commentIcon} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Teacher Comments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the view takes up the full screen
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#252C30',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  studentInfo: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
  },
  studentInfoText: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  studentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#333840',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    width: 150,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
  },
});

export default TeacherStudentDetailScreen;
