import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

const AttendanceScreen = ({ route }) => {
  const { attendances } = route.params;

  const renderAttendance = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>Attendance Date: {item.Date}</Text>
      <Text>Status: {item.Attendance}</Text>
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
    paddingTop: 108
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  }
});

export default AttendanceScreen;
