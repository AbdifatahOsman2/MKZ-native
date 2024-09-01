import React from 'react';
import { View, FlatList, Text, StyleSheet, Image, Button } from 'react-native';
import openQuran from '../assets/openQuran.png';

const LessonsScreen = ({ route, navigation }) => {
  const { lessons, TeacherID } = route.params;
  const studentId = route.params.StudentID;


  const renderLesson = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.lessonDate}>{item.Date}</Text>
        <Text style={styles.lessonStatus}>{item['Passed']}</Text>
      </View>
      <Image
        source={openQuran}
        style={styles.icon}
      />
    </View>
  );

  // Function to navigate to the add lesson screen
  const handleAddLesson = () => {
    // You might need to navigate with some parameters to identify the student etc.
    navigation.navigate('AddLesson', { studentId: studentId }); // Update with actual parameters
  };

  return (
    <View style={styles.container}>
      {/* Show add button only if TeacherID is present */}
      {TeacherID && (
        <Button
          title="Add New Lesson"
          onPress={handleAddLesson}
          color="#007BFF" // Customizable color
        />
      )}
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
  icon: {
    width: 24,
    height: 24,
  },
});

export default LessonsScreen;
