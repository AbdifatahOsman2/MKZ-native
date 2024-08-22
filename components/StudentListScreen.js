import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StyleSheet, Image } from 'react-native';
import { fetchStudents } from '../services/airtableService';
import image from '../assets/Fm1-Image.png';
const StudentListScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch students data
  const getStudentsData = async () => {
    try {
      const studentsData = await fetchStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStudentsData();
  }, []);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getStudentsData();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer} // Add this to push content down
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {students.map(student => (
        <TouchableOpacity
          key={student.id}
          onPress={() => navigation.navigate('StudentDetail', { student })}
          style={styles.studentContainer}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={image} // Replace with the correct image URL
              style={styles.avatar}
            />
          </View>
          <Text style={styles.studentName}>{student.StudentName}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 120, // Pushes the container down
  },
  studentContainer: {
    marginBottom: 15,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#E8F1F2', // Matches the background in the image
    flexDirection: 'row',
    alignItems: 'center', // Centers content vertically
    justifyContent: 'flex-start', // Aligns items horizontally
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30, // Makes the avatar circular
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StudentListScreen;
