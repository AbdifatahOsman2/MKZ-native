import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
// img
import maleImage from '../assets/M-1-Image.png'; 
import femaleImage from '../assets/Fm1-Image.png';

import lessonIcon from '../assets/Lessonbtn.png';  
import behaviorIcon from '../assets/Behaviorbtn.png';
import attendanceIcon from '../assets/Attendancebtn.png';
import commentIcon from '../assets/Commentbtn.png';

const StudentDetailScreen = ({ route, navigation }) => {
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
        {student.LessonsData && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Lessons', { lessons: student.LessonsData })}
          >
            <Image source={lessonIcon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Lesson / Cashar</Text>
          </TouchableOpacity>
        )}

        {student.BehaviorData && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Behavior', { behaviors: student.BehaviorData })}
          >
            <Image source={behaviorIcon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Behavior / dhaaqanka ardayga</Text>
          </TouchableOpacity>
        )}
        {student.AttendanceData && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Attendance', { attendances: student.AttendanceData })}
          >
            <Image source={attendanceIcon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Attendance / imaanaha</Text>
          </TouchableOpacity>
        )}

        {student.CommentData && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TeachersComment', { comments: student.CommentData, cm : student.Comment })}
          >
            <Image source={commentIcon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Teacher Comment / Faallo Macallinka</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#252C30',
  },
  textContainer:{
    alignItems: 'center',
    marginTop: 20,
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
  studentInfo: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
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

export default StudentDetailScreen;
