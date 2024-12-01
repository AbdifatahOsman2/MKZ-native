import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Image,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import { fetchStudentsWithPhoneNumbers } from '../services/airtableService';

const StudentListScreen = ({ navigation, route }) => {
  const [students, setStudents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const { ParentID, phoneNumber, name } = route.params;

  const iconColor = '#f5f5dc'; // Unified light color for icons

  const getStudentsData = async () => {
    try {
      setLoading(true);
      const studentsData = await fetchStudentsWithPhoneNumbers(phoneNumber, ParentID);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentsData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getStudentsData();
    setRefreshing(false);
  }, []);

  const getRandomImage = (gender) => {
    const maleImages = [require('../assets/M-1-Image.png')];
    const femaleImages = [require('../assets/Fm1-Image.png')];

    if (gender === 'Male') {
      return maleImages[Math.floor(Math.random() * maleImages.length)];
    } else if (gender === 'Female') {
      return femaleImages[Math.floor(Math.random() * femaleImages.length)];
    }
    return null;
  };

  const getLatestLessonStatus = (lessons) => {
    if (!lessons || lessons.length === 0) return 'No recent lessons';
    const sortedLessons = [...lessons].sort((a, b) => new Date(b.Date) - new Date(a.Date));
    return sortedLessons[0].Passed;
  };

  // New function to get the next lesson due
  const getNextLessonDue = (lessons) => {
    if (!lessons || lessons.length === 0) return null;
    const sortedLessons = [...lessons].sort((a, b) => new Date(b.Date) - new Date(a.Date));
    for (const lesson of sortedLessons) {
      if (lesson.NextSurahDue && (lesson.FromAyah || lesson.FromAyah === 0) && (lesson.ToAyah || lesson.ToAyah === 0)) {
        return lesson;
      }
    }
    return null;
  };

  const filteredStudents = students;

  return (
    <ImageBackground source={require('../assets/CharColBG.png')} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Welcome {name}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.headerRight}>
          <Icon name="bars" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <Modal
        isVisible={menuVisible}
        onBackdropPress={() => setMenuVisible(false)}
        style={styles.bottomModal}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.bottomSheet}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('SettingsPage', { ParentID });
            }}
          >
            <MaterialIcons name="settings" style={{ marginRight: 10 }} size={26} color={iconColor} />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('FeedbackScreen');
            }}
          >
            <MaterialIcons name="feedback" style={{ marginRight: 10 }} size={26} color={iconColor} />
            <Text style={styles.menuItemText}>Feedback</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={iconColor} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => {
              const studentImage = getRandomImage(student.Gender);
              const latestLessonStatus = getLatestLessonStatus(student.LessonsData);
              const nextLessonDue = getNextLessonDue(student.LessonsData);
              return (
                <View key={student.id} style={styles.card}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('StudentDetail', { student, studentImage })}
                  >
                    <View style={styles.cardContent}>
                      <Image source={studentImage} style={styles.avatar} />
                      <View style={styles.textContent}>
                        <Text style={styles.cardTitle}>{student.StudentName}</Text>
                        <Text style={styles.cardText}>Age: {student.Age}</Text>
                        <Text style={styles.cardText}>Class: {student.class}</Text>
                        <Text style={styles.cardText}>Last Lesson: {latestLessonStatus}</Text>
                        {nextLessonDue ? (
                          <>
                            <Text style={styles.cardText}>
                              Next Lesson Due:
                              { '\n'} Surah: {'\t'} {nextLessonDue.NextSurahDue}
                            </Text>
                            <Text style={styles.cardText}>
                              {'\t'}Ayahs {nextLessonDue.FromAyah} - {nextLessonDue.ToAyah}
                            </Text>
                          </>
                        ) : (
                          <Text style={styles.cardText}>No next lesson due</Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text style={styles.noStudentsAvailable}>No students available</Text>
          )}
        </ScrollView>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#10263b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    padding: 10,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  card: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#e5ecf4',
    borderRadius: 15, // Increased border radius for a modern look
    shadowColor: '#12273e',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Adjusted alignment
    justifyContent: 'space-between',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  textContent: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 22, // Slightly increased font size
    fontWeight: '600',
    color: '#12273e',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#334f7d',
    marginBottom: 3,
  },
  noStudentsAvailable: {
    color: '#334f7d',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Bottom Sheet Styles
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheet: {
    backgroundColor: '#010f18',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});

export default StudentListScreen;
