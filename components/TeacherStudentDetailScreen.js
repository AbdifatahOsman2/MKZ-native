import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
// Images
import maleImage from '../assets/M-1-Image.png'; 
import femaleImage from '../assets/Fm1-Image.png';
import maleImage2 from '../assets/M-2-Image.png'; 
import femaleImage2 from '../assets/Fm-2-Image.png';
import { deleteStudent } from '../services/airtableService';


const TeacherStudentDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { student, studentImage } = route.params; // Use the passed studentImage

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

  const commentsArray = student.Comment || [];
  const teachersCommentArray = student.TeachersComment || [];

  // Combine Comments and their respective IDs
  const combinedComments = commentsArray.map((comment, index) => ({
    id: teachersCommentArray[index], 
    comment: comment    
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={studentImage || (student.Gender === 'Male' ? maleImage : femaleImage)} // Use the passed image or fallback to default
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
        <Icon name="book-quran" size={45} style={{paddingVertical: 10}} color="#0D1321" />
          <Text style={styles.buttonText}>Lessons</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Behavior', { behaviors: student.BehaviorData, TeacherID: student.TeacherID, StudentID: student.id })}
        >
        <Icon name="face-meh-blank" size={50} style={{paddingVertical: 10}} color="#788AA3" />
          <Text style={styles.buttonText}>Behavior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Attendance', { attendances: student.AttendanceData, TeacherID: student.TeacherID, StudentID: student.id })}
        >
        <Icon name="calendar-days" size={50} style={{paddingVertical: 10}} color="#91AB3B" />
          <Text style={styles.buttonText}>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TeachersComment', { comments: combinedComments, TeacherID: student.TeacherID, StudentID: student.id })}
        >
        <Icon name="pen-clip" size={45} style={{paddingVertical: 10}} color="#502977" />
          <Text style={styles.buttonText}>Teacher Comments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: 'heavy',
    color: '#FFF',
    textAlign: 'center',
  },
});

export default TeacherStudentDetailScreen;
