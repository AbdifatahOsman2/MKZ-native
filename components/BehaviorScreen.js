import React from 'react';
import { View, FlatList, Text, StyleSheet, Button } from 'react-native';

const BehaviorScreen = ({ route, navigation }) => {
  const { behaviors, TeacherID } = route.params;  // Make sure TeacherID is passed as a parameter
  const studentId = route.params.StudentID;

  const renderBehavior = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <Text style={styles.dateText}>{item.Date}</Text>
        <Text style={styles.behaviorText}>Behavior / Edeb</Text>
        <Text style={styles.statusText}>{item.Behavior}</Text>
        <Text style={styles.emoji}>
          {item.Behavior.includes('Good') ? '😊' : '😢'}
        </Text>
      </View>
    </View>
  );

  // Function to navigate to the add behavior screen
  const handleAddBehavior = () => {
    navigation.navigate('AddBehavior',  { studentId: studentId }); // Assuming TeacherID is needed for creating behaviors
  };

  return (
    <View style={styles.container}>
      {/* Show add button only if TeacherID is present */}
      {TeacherID && (
        <Button
          title="Add New Behavior"
          onPress={handleAddBehavior}
          color="#007BFF" // Customizable color
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
  behaviorText: {
    fontSize: 16,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  emoji: {
    fontSize: 20,
    marginLeft: 8,
  },
});

export default BehaviorScreen;
