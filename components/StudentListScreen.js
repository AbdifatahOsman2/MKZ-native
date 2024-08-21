import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { fetchStudents } from '../services/airtableService';

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
          <Text style={styles.studentId}>Student ID: {student.id}</Text>
          <Text>Name: {student.StudentName}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  studentContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
  },
  studentId: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default StudentListScreen;
