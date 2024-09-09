import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteAttendance } from '../services/airtableService';

const AttendanceScreen = ({ route, navigation }) => {
  const { attendances: initialAttendances, TeacherID } = route.params;
  const studentId = route.params.StudentID;
  const [attendances, setAttendances] = useState(initialAttendances); // Manage attendances in state

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

  const renderAttendance = ({ item }) => (
    <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}>
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <Text style={styles.dateText}>{item.Date}</Text>
          <Text style={styles.statusText}>{item.Attendance}</Text>
        </View>
      </View>
    </Swipeable>
  );

  const handleAddAttendance = () => {
    navigation.navigate('AddAttendance', { studentId });
  };

  return (
    <View style={styles.container}>
      {TeacherID && (
        <Button
          title="Add New Attendance"
          onPress={handleAddAttendance}
          color="#007BFF"
        />
      )}
      <FlatList
        data={attendances}
        renderItem={renderAttendance}
        keyExtractor={(item) => item.id.toString()}
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
    color: '#FFF',
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
