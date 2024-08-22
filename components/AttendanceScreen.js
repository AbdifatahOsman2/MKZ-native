import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

const AttendanceScreen = ({ route }) => {
  const { attendances } = route.params;

  const renderAttendance = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <Text style={styles.dateText}>{item.Date}</Text>
        <Text style={styles.statusText}>{item.Attendance}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.Items}
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
    justifyContent: 'space-between',
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
