// TeachersCommentScreen.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const TeachersCommentScreen = ({ route }) => {
  const { comments } = route.params;

  return (
    <ScrollView>
      <View style={{ marginBottom: 20, padding: 10, borderWidth: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Teachers' Comments</Text>
        {comments.map(comment => (
          <Text key={comment.id}>Comment Date: {comment.Date}, Comment: {comment.Comment}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default TeachersCommentScreen;
