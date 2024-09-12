import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteBehavior, fetchBehavior } from '../services/airtableService'; // Assuming you have a fetchBehavior service
import Icon from 'react-native-vector-icons/FontAwesome6'; // Import FontAwesome6 for icons
import { Ionicons } from '@expo/vector-icons'; // For the plus icon
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const BehaviorScreen = ({ route }) => {
  const navigation = useNavigation();
  const { behaviors: initialBehaviors, TeacherID } = route.params;
  const studentId = route.params.StudentID;
  const [behaviors, setBehaviors] = useState(initialBehaviors);
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
            <TouchableOpacity onPress={handleAddBehavior} style={{ paddingRight: 10 }}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          )
        : null,
    });
  }, [navigation, TeacherID]);

  // Fetch updated behaviors when user returns from AddBehavior
  useFocusEffect(
    useCallback(() => {
      refreshBehaviors();
    }, [])
  );

  // Function to fetch and update behaviors
  const refreshBehaviors = async () => {
    setRefreshing(true);
    try {
      const updatedBehaviors = await fetchBehavior(studentId); // Fetch behaviors from Airtable
      setBehaviors(updatedBehaviors);
    } catch (error) {
      console.error('Error fetching behaviors:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle behavior deletion with proper promise handling
  const handleDeleteBehavior = async (behaviorId) => {
    try {
      Alert.alert(
        'Delete Behavior',
        'Are you sure you want to delete this behavior?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive', 
            onPress: async () => {
              await deleteBehavior([behaviorId]); 
              setBehaviors((prevBehaviors) => prevBehaviors.filter((behavior) => behavior.id !== behaviorId));
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

  // Function to conditionally render the icon based on behavior text
  const getBehaviorIcon = (behaviorText) => {
    if (behaviorText.toLowerCase().includes('good')) {
      return <Icon name="face-laugh" size={30} color="#4CAF50" />;
    }else if (behaviorText.toLowerCase().includes('excellent')) {
      return <Icon name="face-grin-stars" size={30} color="#F1E0A4" />;
    } else if (behaviorText.toLowerCase().includes('bad')) {
      return <Icon name="face-frown-open" size={30} color="#F1A4A4" />;
    } else {
      return <Icon name="face-meh" size={30} color="#A4CFF1" />; // Default neutral icon
    }
  };

  const renderRightActions = (progress, dragX, behaviorId) => (
    TeacherID ? (
      <TouchableOpacity onPress={() => handleDeleteBehavior(behaviorId)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    ) : null
  );

  const renderBehavior = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
    >
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <Text style={styles.dateText}>{item.Date}</Text>
          <Text style={styles.behaviorText}>Behavior</Text>
          <Text style={styles.statusText}>{item.Behavior}</Text>
          {/* Render the appropriate icon based on behavior text */}
          {getBehaviorIcon(item.Behavior)}
        </View>
      </View>
    </Swipeable>
  );

  // Function to navigate to the add behavior screen
  const handleAddBehavior = () => {
    navigation.navigate('AddBehavior', { studentId: studentId });
  };

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    refreshBehaviors();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={behaviors}
        renderItem={renderBehavior}
        keyExtractor={(item) => item.id}
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
    justifyContent: 'center', // Center contents horizontally
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around', // Space items evenly
    width: '100%', // Ensure items take full width
  },
  dateText: {
    fontSize: 16,
    color: '#FFF',
    paddingVertical: 10
  },
  behaviorText: {
    fontSize: 16,
    color: '#FFF',
    paddingHorizontal: 8,
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
