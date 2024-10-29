import React, { useState, useCallback, useEffect } from 'react';
import { View, SectionList, Text, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteAttendance, fetchStudentById } from '../services/airtableService';
import { Ionicons } from '@expo/vector-icons'; // For the plus and back icons
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const AttendanceScreen = ({ route }) => {
  const navigation = useNavigation();
  const { attendances: initialAttendances, TeacherID } = route.params;
  const studentId = route.params.StudentID;
  const [attendances, setAttendances] = useState(initialAttendances || []); // Manage attendances in state
  const [groupedAttendances, setGroupedAttendances] = useState([]); // For grouped data
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

  // Function to process attendances: sort by date descending and group by month
  const processAttendances = useCallback(() => {
    if (!attendances || attendances.length === 0) {
      setGroupedAttendances([]);
      return;
    }

    // Parse dates and sort attendances by date descending
    const attendancesWithParsedDates = attendances
      .map((attendance) => {
        const dateObj = new Date(attendance.Date);
        return {
          ...attendance,
          dateObj,
        };
      })
      .filter((attendance) => !isNaN(attendance.dateObj)); // Filter out invalid dates

    // Sort by date descending
    attendancesWithParsedDates.sort((a, b) => b.dateObj - a.dateObj);

    // Group by month and year
    const grouped = {};

    attendancesWithParsedDates.forEach((attendance) => {
      const monthYear = attendance.dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(attendance);
    });

    // Convert grouped object to array of sections
    const sections = Object.keys(grouped).map((monthYear) => ({
      title: monthYear,
      data: grouped[monthYear],
    }));

    setGroupedAttendances(sections);
  }, [attendances]);

  // Process attendances whenever attendances state changes
  useEffect(() => {
    processAttendances();
  }, [attendances, processAttendances]);

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
          },
        },
      ]
    );
  };

  const renderRightActions = (progress, dragX, attendanceId) =>
    TeacherID ? (
      <TouchableOpacity onPress={() => handleDeleteAttendance(attendanceId)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    ) : null;

  const renderAttendance = ({ item }) => {
    let statusStyle = styles.notPresentStatus; // Default style

    if (item.Attendance === 'Present') {
      statusStyle = styles.presentStatus;
    } else if (item.Attendance === 'Tardy') {
      statusStyle = styles.tardyStatus;
    }

    return (
      <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}>
        <View style={styles.itemContainer}>
          <View style={styles.row}>
            <Text style={styles.dateText}>{item.Date}</Text>
            <Text style={[styles.statusText, statusStyle]}>{item.Attendance}</Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
      <View style={styles.sectionHeaderLine} />
    </View>
  );

  const handleAddAttendance = () => {
    navigation.navigate('AddAttendance', { studentId });
  };

  // Function to handle refresh action
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const student = await fetchStudentById(studentId);
      const refreshedAttendances = student.AttendanceData || [];
      setAttendances(refreshedAttendances);
    } catch (error) {
      console.error('Error refreshing attendances:', error);
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
        sections={groupedAttendances}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAttendance}
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
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
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
    color: '#000000',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Styling for Present, Tardy, and Not Present statuses
  presentStatus: {
    color: '#00308F', // Light blue for Present
  },
  tardyStatus: {
    color: '#E49B0F', // Light yellow for Tardy
  },
  notPresentStatus: {
    color: '#FF1D18', // Light red for Not Present
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
  },
  sectionHeader: {
    backgroundColor: '#192c3b', // Same as background to blend in
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

export default AttendanceScreen;
