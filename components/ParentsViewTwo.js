import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome6';

import maleImage from '../assets/M-1-Image.png';
import femaleImage from '../assets/Fm1-Image.png';

const StudentDetailScreen = ({ route, navigation }) => {
  const { student, studentImage } = route.params;

  const combinedComments = (student.Comment || []).map((comment, index) => ({
    id: student.TeachersComment ? student.TeachersComment[index] : null,
    comment: comment
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
          {student.LessonsData && renderButton(
            <Icon name="book-quran" size={50} color="#0D1321" />,
            "Lesson / Cashar",
            () => navigation.navigate('Lessons', { lessons: student.LessonsData })
          )}

          {student.BehaviorData && renderButton(
            <MaterialCommunityIcons name="head-cog-outline" size={55} color="#788AA3" />,
            "Behavior",
            () => navigation.navigate('Behavior', { behaviors: student.BehaviorData })
          )}

          {student.AttendanceData && renderButton(
            <Icon name="calendar-days" size={50} color="#91AB3B" />,
            "Attendance",
            () => navigation.navigate('Attendance', { attendances: student.AttendanceData })
          )}

          {combinedComments.length > 0 && renderButton(
            <Icon name="pen-clip" size={50} color="#502977" />,
            "Teacher Comment",
            () => navigation.navigate('TeachersComment', { comments: combinedComments, StudentID: student.id })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#252C30',
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
    borderWidth: 0,
    borderColor: '#FFF',
  },
  studentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#333840',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
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
    color: '#FFF',
    flex: 1,
  },
  infoValue: {
    fontSize: 18,
    color: '#FFF',
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#333840',
    padding: 15,
    borderRadius: 15,
    width: '48%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
});

export default StudentDetailScreen;