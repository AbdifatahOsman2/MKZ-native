import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteLesson, fetchLessons } from '../services/airtableService'; // Assuming fetchLessons exists
import Icon from 'react-native-vector-icons/FontAwesome6'; // Using FontAwesome6
import { Ionicons } from '@expo/vector-icons'; // For the plus icon
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const LessonsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { lessons: initialLessons, TeacherID } = route.params;
  const studentId = route.params.StudentID;
  const [lessons, setLessons] = useState(initialLessons); // Track lessons in state
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

  // Set header with back button and plus icon
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: TeacherID
        ? () => (
            <TouchableOpacity onPress={handleAddLesson} style={{ paddingRight: 10 }}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          )
        : null,
    });
  }, [navigation, TeacherID]);

  // Handle lesson deletion with proper promise handling
  const handleDeleteLesson = async (lessonId) => {
    try {
      // Confirm deletion with the user
      Alert.alert(
        'Delete Lesson',
        'Are you sure you want to delete this lesson?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive', 
            onPress: async () => {
              await deleteLesson([lessonId]); // Send as an array, as per the updated function
              
              // Filter out the deleted lesson from the local state
              setLessons((prevLessons) => prevLessons.filter((lesson) => lesson.id !== lessonId));

              // Notify the user
              Alert.alert('Success', 'Lesson deleted successfully');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error deleting lesson:', error);
      Alert.alert('Error', 'Failed to delete the lesson. Please try again.');
    }
  };

  // Function to conditionally render the appropriate icon
  const getLessonIcon = (status) => {
    switch (status) {
      case 'Passed Full':
        return <Icon name="book-open" size={30} color="#A4F1D5" />;
      case 'Passed Half':
        return <Icon name="book-open-reader" size={30} color="#A4CFF1" />;
      case 'Passed None':
      default:
        return <Icon name="book-quran" size={30} color="#F1A4A4" />;
    }
  };

  const renderRightActions = (progress, dragX, lessonId) => (
    TeacherID ? (
      <TouchableOpacity onPress={() => handleDeleteLesson(lessonId)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    ) : null // Only render the delete button if TeacherID is available
  );

  const renderLesson = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
    >
      <View style={styles.itemContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.lessonDate}>{item.Date}</Text>
          <Text style={styles.lessonStatus}>{item['Passed']}</Text>
        </View>
        {/* Render icon based on lesson status */}
        {getLessonIcon(item['Passed'])}
      </View>
    </Swipeable>
  );

  // Function to navigate to the add lesson screen
  const handleAddLesson = () => {
    navigation.navigate('AddLesson', { studentId });
  };

  // Function to handle refresh action
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Fetch new data for lessons (replace with your data fetching logic)
      const updatedLessons = await fetchLessons(studentId); 
      setLessons(updatedLessons);
    } catch (error) {
      console.error('Error refreshing lessons:', error);
      Alert.alert('Error', 'Failed to refresh lessons.');
    } finally {
      setRefreshing(false);
    }
  }, [studentId]);

  // Refresh lessons when returning from AddLesson screen
  useFocusEffect(
    useCallback(() => {
      onRefresh(); // Automatically refresh the screen when navigating back
    }, [onRefresh])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={lessons}
        renderItem={renderLesson}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252C30', // Dark background
    padding: 16,
    paddingTop: 108,
  },
  itemContainer: {
    backgroundColor: '#333', // Dark item background
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around', // Changed to 'around' to add space for swipe button
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: 27,
    height: 27,
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
