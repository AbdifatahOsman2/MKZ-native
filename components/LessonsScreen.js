import React from 'react';
import { View, FlatList, Text, StyleSheet, Image } from 'react-native';
import openQuran from '../assets/openQuran.png';

const LessonsScreen = ({ route }) => {
  const { lessons } = route.params;

  const renderLesson = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.lessonDate}>{item.Date}</Text>
        <Text style={styles.lessonStatus}>{item['Passed?']}</Text>
      </View>
      <Image
        source={openQuran} // Replace with actual icon URL
        style={styles.icon}
      />
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
    flexDirection: 'row', // Arrange items horizontally
    alignItems: 'center', // Vertically center the items
    justifyContent: 'space-evenly' // Space between the text and the icon
  },
  textContainer: {
    flexDirection: 'row', // Arrange text items horizontally
    alignItems: 'center',
  },
  lessonDate: {
    marginRight: 20,
    fontSize: 16,
    color: '#000',
  },
  lessonStatus: {
    marginRight: 20,
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  lessonType: {
    fontSize: 16,
    color: '#000',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default LessonsScreen;
