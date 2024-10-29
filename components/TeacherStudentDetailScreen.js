import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { deleteStudent } from '../services/airtableService';

const TeacherStudentDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { student } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete} style={{ paddingRight: 10 }}>
          <Icon name="trash-can" size={24} style={{ paddingHorizontal: 20 }} color="#f1a4a4" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Student',
      'Are you sure you want to delete this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStudent(student.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete student.');
              console.error('Failed to delete student:', error);
            }
          },
        },
      ]
    );
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    const cleaned = ('' + phoneNumber).replace(/[^\d+]/g, '');
    const hasCountryCode = cleaned.startsWith('+1');
    const numberWithoutCode = hasCountryCode ? cleaned.slice(2) : cleaned;
    const match = numberWithoutCode.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return hasCountryCode
        ? `+1 ${match[1]}-${match[2]}-${match[3]}`
        : `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  const combinedComments = (student.Comment || []).map((comment, index) => ({
    id: student.TeachersComment ? student.TeachersComment[index] : null,
    comment: comment,
  }));
  const genderIconName = student.Gender === 'Male' ? 'human' : 'human-female';



  return (
    <ImageBackground source={require('../assets/teachscreenbg.png')} style={styles.background} imageStyle={{ opacity: 0.9 }}>
      <View style={styles.container}>
        <View style={styles.infoCard}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={genderIconName} size={80} color="#000" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.studentName}>{student.StudentName}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age:</Text>
              <Text style={styles.infoValue}>{student.Age}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Class:</Text>
              <Text style={styles.infoValue}>{student.class}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Schedule:</Text>
              <Text style={styles.infoValue} numberOfLines={2}>{student.schedule}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Teacher:</Text>
              <Text style={styles.infoValue}>{student.teacherName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Parent:</Text>
              <Text style={styles.infoValue}>{formatPhoneNumber(student.PhoneNumber)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('Lessons', {
                lessons: student.LessonsData,
                TeacherID: student.TeacherID,
                StudentID: student.id,
              })
            }
          >
            <Icon name="book-quran" size={45} style={{ paddingVertical: 10 }} color="#0D1321" />
            <Text style={styles.buttonText}>Lessons</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('Behavior', {
                behaviors: student.BehaviorData,
                TeacherID: student.TeacherID,
                StudentID: student.id,
              })
            }
          >
            <MaterialCommunityIcons
              name="head-cog-outline"
              size={50}
              style={{ paddingVertical: 10 }}
              color="#788AA3"
            />
            <Text style={styles.buttonText}>Behavior</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('Attendance', {
                attendances: student.AttendanceData,
                TeacherID: student.TeacherID,
                StudentID: student.id,
              })
            }
          >
            <Icon name="calendar-days" size={50} style={{ paddingVertical: 10 }} color="#91AB3B" />
            <Text style={styles.buttonText}>Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('TeachersComment', {
                comments: combinedComments,
                TeacherID: student.TeacherID,
                StudentID: student.id,
                
              })
            }
          >
            <Icon name="pen-clip" size={45} style={{ paddingVertical: 10 }} color="#502977" />
            <Text style={styles.buttonText}>Teacher Comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#103967',
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for better contrast
  },
  infoCard: {
    backgroundColor: '#f5f5dc', // Light beige background color
    borderRadius: 10,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    marginRight: 20,
  },
  infoTextContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#12273e',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 16,
    color: '#aaa',
    width: 90,
  },
  infoValue: {
    fontSize: 16,
    color: '#12273e',
    flex: 1, // Allows the text to wrap within the card
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#f5f5dc', // Light beige color for buttons
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
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#12273e',
    textAlign: 'center',
  },
});

export default TeacherStudentDetailScreen;
