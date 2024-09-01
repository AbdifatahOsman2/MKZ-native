import React from 'react';
import { View, FlatList, Text, StyleSheet, Button } from 'react-native';

const AttendanceScreen = ({ route, navigation }) => {
  const { attendances, TeacherID } = route.params;
  const studentId = route.params.StudentID;

  const renderAttendance = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <Text style={styles.dateText}>{item.Date}</Text>
        <Text style={styles.statusText}>{item.Attendance}</Text>
      </View>
    </View>
  );

  // Function to navigate to the add attendance screen
  const handleAddAttendance = () => {
    navigation.navigate('AddAttendance', { studentId: studentId }); // Pass the studentId to the AddAttendance screen
  };

  return (
    <View style={styles.container}>
      {/* Show add button only if TeacherID is present */}
      {TeacherID && (
        <Button
          title="Add New Attendance"
          onPress={handleAddAttendance}
          color="#007BFF" // Customizable color
        />
      )}
      <FlatList
        data={attendances}
        renderItem={renderAttendance}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECECF8',
    padding: 16,
    paddingTop: 108,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AttendanceScreen;
