import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, SafeAreaView, ImageBackground } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome6';

import maleImage from '../assets/M-1-Image.png';
import femaleImage from '../assets/Fm1-Image.png';

const StudentDetailScreen = ({ route, navigation }) => {
  const { student, studentImage } = route.params;

  const combinedComments = (student.Comment || []).map((comment, index) => ({
    id: student.TeachersComment ? student.TeachersComment[index] : null,
    comment: comment,
  }));

  const renderInfoItem = (label, value) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const renderButton = (icon, text, onPress) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {icon}
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../assets/studentViewBG.png')} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Image
              source={studentImage || (student.Gender === 'Male' ? maleImage : femaleImage)}
              style={styles.profileImage}
            />
            <Text style={styles.studentName}>{student.StudentName}</Text>
          </View>

          <View style={styles.infoContainer}>
            {renderInfoItem("Age / da'", student.Age)}
            {renderInfoItem("Class / fasalka", student.class)}
            {renderInfoItem("Schedule / jadwalka", student.schedule)}
            {renderInfoItem("Teacher / Macallin", student.teacherName)}
          </View>

          <View style={styles.buttonContainer}>
            {student.LessonsData &&
              renderButton(
                <Icon name="book-quran" size={50} color="#0D1321" />,
                'Lesson / Cashar',
                () => navigation.navigate('Lessons', {
                  lessons: student.LessonsData,
                  StudentID: student.id, // Pass the student ID here
                })
              )}

            {student.BehaviorData &&
              renderButton(
                <MaterialCommunityIcons name="head-cog-outline" size={55} color="#788AA3" />,
                'Behavior',
                () => navigation.navigate('Behavior', {
                  behaviors: student.BehaviorData,
                  StudentID: student.id, // Pass the student ID here
                })
              )}

            {student.AttendanceData &&
              renderButton(
                <Icon name="calendar-days" size={50} color="#91AB3B" />,
                'Attendance',
                () => navigation.navigate('Attendance', {
                  attendances: student.AttendanceData,
                  StudentID: student.id, // Pass the student ID here
                })
              )}

            {combinedComments.length > 0 &&
              renderButton(
                <Icon name="pen-clip" size={50} color="#502977" />,
                'Teacher Comment',
                () => navigation.navigate('TeachersComment', {
                  comments: combinedComments,
                  StudentID: student.id, // Already passing StudentID here
                })
              )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensures the background image covers the entire screen
    backgroundColor: '#1a2b3b',
    
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: 30,
    
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  studentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e5ecf4',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#e5ecf4', // Light background for info container
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#12273e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334f7d',
    flex: 1,
  },
  infoValue: {
    fontSize: 18,
    color: '#334f7d',
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#e5ecf4', // Light background for buttons
    padding: 15,
    borderRadius: 15,
    width: '48%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#12273e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    color: '#12273e',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
});

export default StudentDetailScreen;
