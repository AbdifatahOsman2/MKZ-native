import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { fetchStudents } from '../services/airtableService';
import maleImage from '../assets/M-1-Image.png'; 
import femaleImage from '../assets/Fm1-Image.png';

const StudentListScreen = ({ navigation, route }) => {
  const [students, setStudents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { ParentID } = route.params; // Get ParentID from route params

  // Fetch students data
  const getStudentsData = async () => {
    try {
      const studentsData = await fetchStudents(ParentID);
      setStudents(studentsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStudentsData();
  }, []);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getStudentsData();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with icons */}
      <View style={styles.header}>
        {/* Navigate to SettingsPage instead of AuthScreen */}
        <TouchableOpacity onPress={() => navigation.navigate('SettingsPage')}>
          <View style={styles.iconWrapper}>
            <Icon name="cog" size={24} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <View style={styles.iconWrapper}>
            <Icon name="bell" size={24} color="#000" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >{students.length > 0 ? (
        students.map(student => (
          <TouchableOpacity
            key={student.id}
            onPress={() => navigation.navigate('StudentDetail', { student })}
            style={styles.studentContainer}
          >
            <View style={styles.avatarContainer}>
              <Image source={student.Gender === 'Male' ? maleImage : femaleImage} style={styles.avatar} />
            </View>
            <Text style={styles.studentName}>{student.StudentName}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No students available If this is your first time regirstering, please wait for the teacher to register your students accounts.</Text>
      )}
      </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0)',
    elevation: 2,
  },
  iconWrapper: {
    padding: 10, // Adding padding to make touchable area larger
  },
  scrollContainer: {
    alignItems: 'center',
    paddingTop: 20,
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
});

export default StudentListScreen;
