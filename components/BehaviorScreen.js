import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteBehavior } from '../services/airtableService';

const BehaviorScreen = ({ route, navigation }) => {
  const { behaviors: initialBehaviors, TeacherID } = route.params;
  const studentId = route.params.StudentID;
  const [behaviors, setBehaviors] = useState(initialBehaviors); // Track behaviors in state

  // Handle behavior deletion with proper promise handling
  const handleDeleteBehavior = async (behaviorId) => {
    try {
      // Confirm deletion with the user
      Alert.alert(
        'Delete Behavior',
        'Are you sure you want to delete this behavior?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive', 
            onPress: async () => {
              await deleteBehavior([behaviorId]); // Send as an array, as per the deleteBehavior function
              
              // Filter out the deleted behavior from the local state
              setBehaviors((prevBehaviors) => prevBehaviors.filter((behavior) => behavior.id !== behaviorId));

              // Notify the user
              Alert.alert('Success', 'Behavior deleted successfully');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error deleting behavior:', error);
      Alert.alert('Error', 'Failed to delete the behavior. Please try again.');
    }
  };

  const renderBehavior = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteBehavior(item.id)}>
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
