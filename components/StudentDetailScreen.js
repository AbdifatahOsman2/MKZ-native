import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import image from '../assets/Fm1-Image.png';

const StudentDetailScreen = ({ route, navigation }) => {
  const { student } = route.params;
  console.log("studentDetail:",student);
  console.log("studentTeacher:",student.teacher);
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={image} style={styles.profileImage} />
        <Text style={styles.studentName}>{student.StudentName}</Text>
        <Text style={styles.studentInfo}>Age / da' : {student.Age}</Text>
        <Text style={styles.studentInfo}>Class / fasalka : {student.class}</Text>
        <Text style={styles.studentInfo}>Schedule / jadwalka : {student.schedule}</Text>
        <Text style={styles.studentInfo}>Teacher / Macallin : {student.teacher}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {student.LessonsData && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Lessons', { lessons: student.LessonsData })}
          >
            <Text style={styles.buttonText}>Lesson / Cashar</Text>
          </TouchableOpacity>
        )}

        {student.BehaviorData && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Behavior', { behaviors: student.BehaviorData })}
          >
            <Text style={styles.buttonText}>Behavior / dhaaqanka ardayga</Text>
          </TouchableOpacity>
        )}

        {student.AttendanceData && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Attendance', { attendances: student.AttendanceData })}
          >
            <Text style={styles.buttonText}>Attendance / imaanaha</Text>
          </TouchableOpacity>
        )}

        {student.CommentData && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TeachersComment', { comments: student.CommentData })}
          >
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
    padding: 20,
    backgroundColor: '#A1C9F1',
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
    marginTop: 20,
  },
  button: {
    backgroundColor: '#F2F2F2',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default StudentDetailScreen;
