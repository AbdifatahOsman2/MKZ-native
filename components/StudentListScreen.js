// StudentListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { fetchStudents } from '../services/airtableService';

const StudentListScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const getStudentsData = async () => {
      try {
        const studentsData = await fetchStudents();
        setStudents(studentsData);
      } catch (error) {
        console.error(error);
      }
    };

    getStudentsData();
  }, []);

  return (
    <ScrollView>
      {students.map(student => (
        <TouchableOpacity
          key={student.id}
          onPress={() => navigation.navigate('StudentDetail', { student })}
          style={{ marginBottom: 20, padding: 10, borderWidth: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Student ID: {student.id}</Text>
          <Text>Name: {student.StudentName}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default StudentListScreen;
