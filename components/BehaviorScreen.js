import React from 'react';
import { View, FlatList, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteBehavior } from '../services/airtableService';

const BehaviorScreen = ({ route, navigation }) => {
  const { behaviors, TeacherID } = route.params;
  const studentId = route.params.StudentID;

  const renderBehavior = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteBehavior(item.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <Text style={styles.dateText}>{item.Date}</Text>
          <Text style={styles.behaviorText}>Behavior:</Text>
          <Text style={styles.statusText}>{item.Behavior}</Text>
        </View>
      </View>
    </Swipeable>
  );

  // Function to navigate to the add behavior screen
  const handleAddBehavior = () => {
    navigation.navigate('AddBehavior', { studentId: studentId });
  };

  return (
    <View style={styles.container}>
      {TeacherID && (
        <Button
          title="Add New Behavior"
          onPress={handleAddBehavior}
          color="#007BFF"
        />
      )}
      <FlatList
        data={behaviors}
        renderItem={renderBehavior}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252C30', // Dark background
    padding: 16,
    paddingTop: 108,
  },
  itemContainer: {
    backgroundColor: '#333', // Dark item background
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#FFF', 
    paddingVertical: 10
  },
  behaviorText: {
    fontSize: 16,
    color: '#FFF', 
    paddingHorizontal: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF', 
    paddingHorizontal: 4,
  },
  emoji: {
    fontSize: 20,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    justifyContent: 'flex-end',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BehaviorScreen;
