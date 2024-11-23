import React, { useState, useCallback, useEffect } from 'react';
import { View, SectionList, Text, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteLesson, fetchStudentById } from '../services/airtableService';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const LessonsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { initialLessons, TeacherID, StudentClass } = route.params;
  const studentId = route.params.StudentID;

  const [lessons, setLessons] = useState(initialLessons || []);
  const [groupedLessons, setGroupedLessons] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleDeleteLesson = async (lessonId) => {
    try {
      Alert.alert(
        'Delete Lesson',
        'Are you sure you want to delete this lesson?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteLesson([lessonId]);
              setLessons((prevLessons) => prevLessons.filter((lesson) => lesson.id !== lessonId));
              Alert.alert('Success', 'Lesson deleted successfully');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error deleting lesson:', error);
      Alert.alert('Error', 'Failed to delete the lesson. Please try again.');
    }
  };

  const getLessonIcon = (status) => {
    switch (status) {
      case 'Passed Full':
        return <Icon name="book-open" size={30} color="#A4F1D5" />;
      case 'Passed Half':
        return <Icon name="book-open-reader" size={30} color="#A4CFF1" />;
      case 'Passed None':
      default:
        return <Icon name="book" size={30} color="#FF4F4B" />;
    }
  };

  const renderRightActions = (progress, dragX, lessonId) =>
    TeacherID ? (
      <TouchableOpacity onPress={() => handleDeleteLesson(lessonId)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    ) : null;

  const renderLesson = ({ item }) => (
    <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}>
      <View style={styles.itemContainer}>
        {/* Lesson Header */}
        <View style={styles.lessonHeader}>
          <View>
            <Text style={styles.lessonDate}>{item.Date}</Text>
            <Text style={styles.lessonStatus}>Status: {item['Passed']}</Text>
          </View>
          {getLessonIcon(item['Passed'])}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Next Lesson Due */}
        {item.NextSurahDue && (
          <View style={styles.nextLessonContainer}>
            <Text style={styles.nextLessonTitle}>Next Lesson Due</Text>
            <Text style={styles.nextLessonText}>Surah: {item.NextSurahDue}</Text>
            <Text style={styles.nextLessonText}>
              Ayahs: {item.FromAyah} - {item.ToAyah}
            </Text>
            <Text style={styles.nextLessonText}>Due Date: {item.DueDate}</Text>
          </View>
        )}
      </View>
    </Swipeable>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
      <View style={styles.sectionHeaderLine} />
    </View>
  );

  const handleAddLesson = () => {
    navigation.navigate('AddLesson', { studentId, StudentClass });
  };

  // Function to process lessons: sort by date descending and group by month
  const processLessons = useCallback(() => {
    if (!lessons || lessons.length === 0) {
      setGroupedLessons([]);
      return;
    }

    // Parse dates and sort lessons by date descending
    const lessonsWithParsedDates = lessons
      .map((lesson) => {
        const dateObj = new Date(lesson.Date);
        return {
          ...lesson,
          dateObj,
        };
      })
      .filter((lesson) => !isNaN(lesson.dateObj)); // Filter out invalid dates

    // Sort by date descending
    lessonsWithParsedDates.sort((a, b) => b.dateObj - a.dateObj);

    // Group by month and year
    const grouped = {};

    lessonsWithParsedDates.forEach((lesson) => {
      const monthYear = lesson.dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(lesson);
    });

    // Convert grouped object to array of sections
    const sections = Object.keys(grouped).map((monthYear) => ({
      title: monthYear,
      data: grouped[monthYear],
    }));

    setGroupedLessons(sections);
  }, [lessons]);

  // Process lessons whenever lessons state changes
  useEffect(() => {
    processLessons();
  }, [lessons, processLessons]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Fetch the student and get updated lessons
      const student = await fetchStudentById(studentId);
      const refreshedLessons = student.LessonsData || [];
      setLessons(refreshedLessons);
    } catch (error) {
      console.error('Error refreshing lessons:', error);
    } finally {
      setRefreshing(false);
    }
  }, [studentId]);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh])
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={groupedLessons}
        keyExtractor={(item) => item.id}
        renderItem={renderLesson}
        renderSectionHeader={renderSectionHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#192c3b',
    padding: 16,
    paddingTop: 108,
  },
  itemContainer: {
    backgroundColor: '#f5f5dc',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonDate: {
    fontSize: 16,
    color: '#032f3e',
    fontWeight: 'bold',
  },
  lessonStatus: {
    fontSize: 16,
    color: '#032f3e',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 12,
  },
  nextLessonContainer: {
    marginTop: 8,
  },
  nextLessonTitle: {
    fontSize: 16,
    color: '#032f3e',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nextLessonText: {
    fontSize: 16,
    color: '#032f3e',
    marginLeft: 8,
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionHeader: {
    backgroundColor: '#192c3b',
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  sectionHeaderLine: {
    height: 1,
    backgroundColor: '#FFF',
    marginTop: 4,
  },
});

export default LessonsScreen;
