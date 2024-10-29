import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StyleSheet, TextInput, ActivityIndicator, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fetchAllStudents } from '../services/airtableService';

const AdminView = ({ navigation, route }) => {
  const [students, setStudents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { AdminID, name } = route.params;

  const iconColor = '#f5f5dc'; // Set a single light color for icons

  const getStudentsData = async () => {
    try {
      setLoading(true);
      const studentsData = await fetchAllStudents(); // Fetch all students for admin
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

  const filteredStudents = searchQuery.length > 0
    ? students.filter(student => student.StudentName.toLowerCase().includes(searchQuery.toLowerCase()))
    : students;

  return (
    <ImageBackground source={require('../assets/teachscreenbg.png')} style={styles.background} imageStyle={{ opacity: 0.9 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Welcome Admin</Text>
          </View>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => navigation.navigate('AddStudent', { name })}
          >
            <MaterialCommunityIcons name="account-plus" size={32} color="#FFFFFF" />
          </TouchableOpacity>
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
            <ActivityIndicator size="large" color={iconColor} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => {
                const iconName = student.Gender === 'Male' ? 'human' : 'human-female';

                return (
                  <TouchableOpacity
                    key={student.id}
                    style={styles.card}
                    onPress={() => navigation.navigate('TeacherStudentDetail', { student })}
                  >
                    <View style={styles.cardContent}>
                      <MaterialCommunityIcons name={iconName} size={40} color={iconColor} style={styles.avatar} />
                      <View style={styles.textContent}>
                        <Text style={styles.cardTitle}>{student.StudentName}</Text>
                        <Text style={styles.cardText}>Age: {student.Age}</Text>
                        <Text style={styles.cardText}>Class: {student.class}</Text>
                      </View>
                    </View>
                    <Icon name="chevron-right" size={20} color="#ccc" />
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.noStudentsAvailable}>No students available</Text>
            )}
          </ScrollView>
        )}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.bottomNavIcon} onPress={() => navigation.navigate('AdminView', { AdminID })}>
            <Icon name="home" size={28} color="#feeac7" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavIcon} onPress={() => navigation.navigate('SettingsPage')}>
            <Icon name="cog" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavIcon} onPress={() => navigation.navigate('FeedbackScreen')}>
            <MaterialIcons name="feedback" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensures the background image covers the screen
    backgroundColor: '#010f18',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better contrast
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 5,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchBar: {
    height: 45,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#e5ecf4', // Light background for search bar
    borderRadius: 10,
    color: '#12273e',
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5ecf4',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 15,
  },
  textContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: '#FFF', // Dark text for contrast on light backgrounds
    marginBottom: 3,
  },
  cardText: {
    fontSize: 14,
    color: '#FFF',
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#010f18',

  },
  bottomNavIcon: {
    marginBottom: 10,
  },
});

export default AdminView;
