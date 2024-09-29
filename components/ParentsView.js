import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StyleSheet, Image, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchStudents } from '../services/airtableService';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const StudentListScreen = ({ navigation, route }) => {
  const [students, setStudents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { ParentID } = route.params;
  console.log(route.params);

  const getStudentsData = async () => {
    try {
      setLoading(true);
      const studentsData = await fetchStudents(ParentID);
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

  // Function to randomly pick an image based on gender
  const getRandomImage = (gender) => {
    const maleImages = [
      require('../assets/M-1-Image.png'), 
      require('../assets/M-2-Image.png')
    ];
    const femaleImages = [
      require('../assets/Fm1-Image.png'), 
      require('../assets/Fm-2-Image.png')
    ];
  
    if (gender === 'Male') {
      return maleImages[Math.floor(Math.random() * maleImages.length)];
    } else if (gender === 'Female') {
      return femaleImages[Math.floor(Math.random() * femaleImages.length)];
    }
    return null;
  };

  const filteredStudents = searchQuery.length > 0
    ? students.filter(student => student.StudentName.toLowerCase().includes(searchQuery.toLowerCase()))
    : students;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Students</Text>
      </View>
      <TextInput
        style={styles.searchBar}
        onChangeText={setSearchQuery}
        value={searchQuery}
        placeholder="Search Students"
        placeholderTextColor="#ccc"
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B73E8" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => {
              const studentImage = getRandomImage(student.Gender); // Get random image for the student
              
              return (
                <View key={student.id} style={styles.card}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('StudentDetail', { student, studentImage })} // Pass the image along with student data
                  >
                    <View style={styles.cardContent}>
                      <Image source={studentImage} style={styles.avatar} />
                      <View style={styles.textContent}>
                        <Text style={styles.cardTitle}>{student.StudentName}</Text>
                        <Text style={styles.cardText}>Age: {student.Age}</Text>
                        <Text style={styles.cardText}>Class: {student.class}</Text>
                      </View>
                      <Icon name="chevron-right" size={20} color="#1B73E8" />
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
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavIcon} onPress={() => navigation.navigate('StudentList', { ParentID })}>
          <Icon name="home" size={28} color="#fafbfc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavIcon} onPress={() => navigation.navigate('SettingsPage', { ParentID })}>
          <Icon name="cog" size={28} color="#fafbfc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavIcon} onPress={() => navigation.navigate('FeedbackScreen')}>
        <MaterialIcons name="feedback" size={28} color="#fafbfc" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchBar: {
    height: 40,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#1f2428',
    borderRadius: 20,
    color: '#FFFFFF',
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  card: {
    marginTop: 20, 
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#1f2428',
    borderRadius: 10,
    shadowColor: '#fafbfc',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginRight: 15,
  },
  textContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fafbfc',
    marginBottom: 3,
  },
  cardText: {
    fontSize: 14,
    color: '#cccccc',
  },
  noStudentsAvailable: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#1f2428',
  },
  bottomNavIcon: {
    marginBottom: 10,
  },
});

export default StudentListScreen;
