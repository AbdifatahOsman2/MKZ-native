// App.js (or another relevant component file)
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { fetchStudents, fetchLessons, fetchBehavior, fetchAttendance, fetchTeachersComment } from '../services/airtableService.js';

const App = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const getStudentsData = async () => {
      try {
        const studentsData = await fetchStudents();

        // Fetch additional data for each student
        for (const student of studentsData) {
          if (student.Lessons) {
            student.LessonsData = await fetchLessons(student.Lessons);
          }
          if (student.Behavior) {
            student.BehaviorData = await fetchBehavior(student.Behavior);
          }
          if (student.Attendance) {
            student.AttendanceData = await fetchAttendance(student.Attendance);
          }
          if (student.Comment) {
            student.CommentData = await fetchTeachersComment(student.Comment);
          }
        }

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
        <View key={student.id} style={{ marginBottom: 20, padding: 10, borderWidth: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Student ID: {student.id}</Text>
          <Text>Name: {student.StudentName}</Text>

          {student.LessonsData && (
            <View>
              <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Lessons:</Text>
              {student.LessonsData.map(lesson => (
                <Text key={lesson.id}>Lesson Date: {lesson.Date}, Passed: {lesson['Passed?']}</Text>
              ))}
            </View>
          )}

          {student.BehaviorData && (
            <View>
              <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Behavior:</Text>
              {student.BehaviorData.map(behavior => (
                <Text key={behavior.id}>Behavior Date: {behavior.Date}, Behavior: {behavior.Behavior}</Text>
              ))}
            </View>
          )}

          {student.AttendanceData && (
            <View>
              <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Attendance:</Text>
              {student.AttendanceData.map(attendance => (
                <Text key={attendance.id}>Attendance Date: {attendance.Date}, Status: {attendance.Status}</Text>
              ))}
            </View>
          )}          {student.BehaviorData && (
            <View>
              <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Behavior:</Text>
              {student.BehaviorData.map(behavior => (
                <Text key={behavior.id}>Behavior Date: {behavior.Date}, Behavior: {behavior.Behavior}</Text>
              ))}
            </View>
          )}

          {student.CommentData && (
            <View>
              <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Teachers Comment:</Text>
              {student.CommentData.map(comment => (
                <Text key={comment.id}>Comment Date: {comment.Date}, Comment: {comment.Comment}</Text>
              ))}
            </View>
          )}


        </View>
      ))}
    </ScrollView>
  );
};

export default App;
