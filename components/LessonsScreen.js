// LessonsScreen.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const LessonsScreen = ({ route }) => {
  const { lessons } = route.params;

  return (
    <ScrollView>
      <View style={{ marginBottom: 20, padding: 10, borderWidth: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Lessons</Text>
        {lessons.map(lesson => (
          <Text key={lesson.id}>Lesson Date: {lesson.Date}, Passed: {lesson['Passed?']}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default LessonsScreen;
