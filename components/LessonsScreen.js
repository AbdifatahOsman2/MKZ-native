import React from 'react';
import { View, FlatList, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import openQuran from '../assets/openQuran.png';
import deleteLesson from '../services/airtableService';

const LessonsScreen = ({ route, navigation }) => {
  const { lessons, TeacherID } = route.params;
  const studentId = route.params.StudentID;

  const renderLesson = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteLesson(item.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
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
    </Swipeable>
  );

  // Function to navigate to the add lesson screen
  const handleAddLesson = () => {
    navigation.navigate('AddLesson', { studentId: studentId });
  };

  return (
    <View style={styles.container}>
      {TeacherID && (
        <Button
          title="Add New Lesson"
          onPress={handleAddLesson}
          color="#2dba4e"
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
    backgroundColor: '#252C30', // Dark background
    padding: 16,
    paddingTop: 108
  },
  itemContainer: {
    backgroundColor: '#333', // Dark item background
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between' // Changed to 'between' to add space for swipe button
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonDate: {
    marginRight: 20,
    fontSize: 16,
    color: '#FFF', // Light text for dark mode
  },
  lessonStatus: {
    fontSize: 16,
    color: '#FFF', // Light text for dark mode
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
  },
  deleteButton: {
    backgroundColor: 'red', // Red delete button
    padding: 10,
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LessonsScreen;
