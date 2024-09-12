import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteAttendance, fetchAttendance } from '../services/airtableService'; // Assuming fetchAttendance exists
import { Ionicons } from '@expo/vector-icons'; // For the plus and back icons
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const AttendanceScreen = ({ route }) => {
  const navigation = useNavigation();
  const { attendances: initialAttendances, TeacherID } = route.params;
  const studentId = route.params.StudentID;
  const [attendances, setAttendances] = useState(initialAttendances); // Manage attendances in state
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
            <TouchableOpacity onPress={handleAddAttendance} style={{ paddingRight: 10 }}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          )
        : null,
    });
  }, [navigation, TeacherID]);

  // Handle attendance deletion with proper confirmation and state update
  const handleDeleteAttendance = async (attendanceId) => {
    Alert.alert(
      'Delete Attendance',
      'Are you sure you want to delete this attendance record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAttendance([attendanceId]); // Send as array based on Airtable API requirements
              setAttendances((prevAttendances) => prevAttendances.filter((item) => item.id !== attendanceId));
              Alert.alert('Success', 'Attendance deleted successfully');
            } catch (error) {
              console.error('Error deleting attendance:', error);
              Alert.alert('Error', 'Failed to delete attendance. Please try again.');
            }
          } 
        },
      ]
    );
  };

  const renderRightActions = (progress, dragX, attendanceId) => (
    TeacherID ? (
      <TouchableOpacity onPress={() => handleDeleteAttendance(attendanceId)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    ) : null // Only render the delete button if TeacherID is available
  );

  const renderAttendance = ({ item }) => {
    // Determine the color based on attendance status
    const statusColor = item.Attendance === 'Present' ? styles.presentStatus : styles.notPresentStatus;

    return (
      <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}>
        <View style={styles.itemContainer}>
          <View style={styles.row}>
            <Text style={styles.dateText}>{item.Date}</Text>
            <Text style={[styles.statusText, statusColor]}>{item.Attendance}</Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  const handleAddAttendance = () => {
    navigation.navigate('AddAttendance', { studentId });
  };

  // Function to handle refresh action
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Fetch new data for attendances (replace with your data fetching logic)
      const updatedAttendances = await fetchAttendance(studentId);
      setAttendances(updatedAttendances);
    } catch (error) {
      console.error('Error refreshing attendances:', error);
      Alert.alert('Error', 'Failed to refresh attendances.');
    } finally {
      setRefreshing(false);
    }
  }, [studentId]);

  // Refresh attendances when returning from AddAttendance screen
  useFocusEffect(
    useCallback(() => {
      onRefresh(); // Automatically refresh the screen when navigating back
    }, [onRefresh])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={attendances}
        renderItem={renderAttendance}
        keyExtractor={(item) => item.id.toString()}
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
    backgroundColor: '#252C30',
    padding: 16,
    paddingTop: 108,
  },
  itemContainer: {
    backgroundColor: '#333840',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'space-around',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Styling for Present and Not Present statuses
  presentStatus: {
    color: '#A4CFF1', // Light blue for Present
  },
  notPresentStatus: {
    color: '#F1A4A4', // Light red for Not Present
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default AttendanceScreen;
