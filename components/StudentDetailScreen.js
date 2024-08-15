// StudentDetailScreen.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const StudentDetailScreen = ({ route }) => {
  const { student } = route.params;

  return (
    <ScrollView>
      <View style={{ marginBottom: 20, padding: 10, borderWidth: 1 }}>
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
      </View>
    </ScrollView>
  );
};

export default StudentDetailScreen;
