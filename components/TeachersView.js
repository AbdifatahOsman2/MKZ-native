import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StyleSheet, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchStudents } from '../services/airtableService';
import maleImage from '../assets/M-1-Image.png'; 
import femaleImage from '../assets/Fm1-Image.png';

const TeachersView = ({ navigation, route }) => {
  const [students, setStudents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { TeacherID } = route.params;

  const getStudentsData = async () => {
    try {
      const studentsData = await fetchStudents(null, TeacherID);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity
      style={styles.iconWrapper}
      onPress={() => navigation.navigate('AddStudent')}
      >
      <Icon name="plus" size={24} color="#000" />
      </TouchableOpacity>
      </View>
      <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      <ScrollView>
      <Text style={styles.headerTitle}>Home</Text>
        
        <TextInput
        style={styles.searchBar}
        onChangeText={setSearchQuery}
        value={searchQuery}
        placeholder="Search Students"
        />
        </ScrollView>
        {students.length > 0 ? (
          students.map(student => (
            <TouchableOpacity
              key={student.id}
              onPress={() => navigation.navigate('TeacherStudentDetail', { student })}
              style={styles.studentContainer}
            >
              <View style={styles.avatarContainer}>
                <Image source={student.Gender === 'Male' ? maleImage : femaleImage} style={styles.avatar} />
              </View>
              <Text style={styles.studentName}>{student.StudentName}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No students available</Text>
        )}
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsPage')}>
          <Icon name="cog" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#000',
  },
  searchBar: {
    flex: 1,
    marginLeft: 10,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  iconWrapper: {
    padding: 0, // Adding padding to make touchable area larger

  },
  scrollContainer: {
    paddingTop: 20,
    paddingBottom: 70, // Adjusted to make space for the bottom navigation
  },
  studentContainer: {
    width: 252,
    height: 225,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#E8F1F2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 75,
    height: 83,
    borderRadius: 25,
  },
  studentName: {
    fontSize: 25,
    fontWeight: 'regular',
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
});

export default TeachersView;
