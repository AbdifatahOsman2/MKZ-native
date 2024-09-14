import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import maleImage from '../assets/M-1-Image.png'; 
import femaleImage from '../assets/Fm1-Image.png';
import Icon from 'react-native-vector-icons/FontAwesome6';
const StudentDetailScreen = ({ route, navigation }) => {
  const { student, studentImage } = route.params;  // Retrieve studentImage from route params

  // Combine Comments and their respective IDs
  const combinedComments = student.Comment.map((comment, index) => ({
    id: student.TeachersComment[index],  // Corresponding ID from TeachersComment array
    comment: comment                     // The actual comment from the Comment array
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={studentImage || (student.Gender === 'Male' ? maleImage : femaleImage)} // Use passed studentImage or fallback
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
          <Icon name="book-quran" size={45} style={{paddingVertical: 10}} color="#0D1321" />
            <Text style={styles.buttonText}>Lesson / Cashar</Text>
          </TouchableOpacity>
        )}

        {student.BehaviorData && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Behavior', { behaviors: student.BehaviorData })}
          >
          <MaterialCommunityIcons
            name="head-cog-outline"
            size={50}
            style={{ paddingVertical: 10 }}
            color="#788AA3"
          />
            <Text style={styles.buttonText}>Behavior</Text>
          </TouchableOpacity>
        )}

        {student.AttendanceData && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Attendance', { attendances: student.AttendanceData })}
          >
          <Icon name="calendar-days" size={50} style={{paddingVertical: 10}} color="#91AB3B" />
            <Text style={styles.buttonText}>Attendance</Text>
          </TouchableOpacity>
        )}

        {combinedComments.length > 0 && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TeachersComment', { comments: combinedComments, StudentID: student.id })}
          >
          <Icon name="pen-clip" size={45} style={{paddingVertical: 10}} color="#502977" />
            <Text style={styles.buttonText}>Teacher Comment</Text>
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
