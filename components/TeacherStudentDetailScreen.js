import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
// img
import maleImage from '../assets/M-1-Image.png'; 
import femaleImage from '../assets/Fm1-Image.png';

import lessonIcon from '../assets/Lessonbtn.png';  
import behaviorIcon from '../assets/Behaviorbtn.png';
import attendanceIcon from '../assets/Attendancebtn.png';
import commentIcon from '../assets/Commentbtn.png';

const TeacherStudentDetailScreen = ({ route, navigation }) => {
  const { student } = route.params;


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={student.Gender === 'Male' ? maleImage : femaleImage}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.studentName}>{student.StudentName}</Text>
          <Text style={styles.studentInfo}><Text style={styles.studentInfoText}>Age / da' : </Text>{student.Age}</Text>
          <Text style={styles.studentInfo}><Text style={styles.studentInfoText}>Class / fasalka : </Text>{student.class}</Text>
          <Text style={styles.studentInfo}><Text style={styles.studentInfoText}>Schedule / jadwalka : </Text>{student.schedule}</Text>
          <Text style={styles.studentInfo}><Text style={styles.studentInfoText}>Teacher / Macallin : </Text>{student.teacherName}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Lessons', { lessons: student.LessonsData,TeacherID: student.TeacherID, StudentID: student.id  || [] })}
        >
          <Image source={lessonIcon} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Lesson / Cashar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Behavior', { behaviors: student.BehaviorData,TeacherID: student.TeacherID, StudentID: student.id  || [] })}
        >
          <Image source={behaviorIcon} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Behavior / dhaaqanka ardayga</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Attendance', { attendances: student.AttendanceData,TeacherID: student.TeacherID, StudentID: student.id  || [] })}
        >
          <Image source={attendanceIcon} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Attendance / imaanaha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TeachersComment', { comments: student.TeachersComment,TeacherID: student.TeacherID, StudentID: student.id  || [] })}
        >
          <Image source={commentIcon} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Teacher Comment / Faallo Macallinka</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Add appropriate styles
const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 45,
      backgroundColor: '#A1C9F1',
  
    },
    textContainer:{
      justifyContent: 'center',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      marginTop: 20,
      gap: 5,
    },
    studentInfoText: {
      fontWeight: 'bold',
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
    },
    studentName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    studentInfo: {
      fontSize: 16,
      color: '#000000',
      marginTop: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 40,
  
    },
    button: {
      backgroundColor: '#FFFFFF',
      padding: 10,
      margin: 10,
      borderRadius: 8,
      width: 140,  // Adjust width to match the example
      height: 120,  // Adjust height to match the example
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
    buttonIcon: {
      width: 30,  // Size of the small image icon
      height: 30,
      marginBottom: 5,
    },
    buttonText: {
      fontSize: 12,
      color: '#333',
      textAlign: 'center',
    },
  });
  
export default TeacherStudentDetailScreen;





