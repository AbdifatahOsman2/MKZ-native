import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

const LessonsScreen = ({ route }) => {
  const { lessons } = route.params;

  const renderLesson = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>Lesson Date: {item.Date}</Text>
      <Text>Passed: {item['Passed?']}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={lessons}
        renderItem={renderLesson}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECECF8',
    padding: 16,
    paddingTop: 108
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default LessonsScreen;
