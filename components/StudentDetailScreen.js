import React from 'react';
import { View, Text, ScrollView, Button } from 'react-native';

const StudentDetailScreen = ({ route, navigation }) => {
  const { student } = route.params;

  return (
    <ScrollView>
      <View style={{ marginBottom: 20, padding: 10, borderWidth: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Student ID: {student.id}</Text>
        <Text>Name: {student.StudentName}</Text>

        {/* Navigation Buttons */}
        {student.LessonsData && (
          <Button
            title="View Lessons"
            onPress={() => navigation.navigate('Lessons', { lessons: student.LessonsData })}
          />
        )}

        {student.BehaviorData && (
          <Button
            title="View Behavior"
            onPress={() => navigation.navigate('Behavior', { behaviors: student.BehaviorData })}
          />
        )}

        {student.AttendanceData && (
          <Button
            title="View Attendance"
            onPress={() => navigation.navigate('Attendance', { attendances: student.AttendanceData })}
          />
        )}

        {student.CommentData && (
          <Button
            title="View Teachers Comments"
            onPress={() => navigation.navigate('TeachersComment', { comments: student.CommentData })}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default StudentDetailScreen;
