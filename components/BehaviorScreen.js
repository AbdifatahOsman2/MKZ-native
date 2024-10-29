import React, { useState, useCallback, useEffect } from 'react';
import { View, SectionList, Text, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteBehavior, fetchStudentById } from '../services/airtableService';
import Icon from 'react-native-vector-icons/FontAwesome6'; // Import FontAwesome6 for icons
import { Ionicons } from '@expo/vector-icons'; // For the plus icon
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const BehaviorScreen = ({ route }) => {
  const navigation = useNavigation();
  const { behaviors: initialBehaviors, TeacherID } = route.params;
  const studentId = route.params.StudentID;
  const [behaviors, setBehaviors] = useState(initialBehaviors || []);
  const [groupedBehaviors, setGroupedBehaviors] = useState([]);
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
            },
          },
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
      return <Icon name="face-laugh" size={30} color="#03C03C" />;
    } else if (behaviorText.toLowerCase().includes('excellent')) {
      return <Icon name="face-grin-stars" size={30} color="#FFC000" />;
    } else if (behaviorText.toLowerCase().includes('bad')) {
      return <Icon name="face-frown-open" size={30} color="#FF1D18" />;
    } else {
      return <Icon name="face-meh" size={30} color="#A4CFF1" />; // Default neutral icon
    }
  };

  const renderRightActions = (progress, dragX, behaviorId) =>
    TeacherID ? (
      <TouchableOpacity onPress={() => handleDeleteBehavior(behaviorId)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    ) : null;

  const renderBehavior = ({ item }) => (
    <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}>
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

  // Render section headers
  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
      <View style={styles.sectionHeaderLine} />
    </View>
  );

  // Function to navigate to the add behavior screen
  const handleAddBehavior = () => {
    navigation.navigate('AddBehavior', { studentId: studentId });
  };

  // Function to process behaviors: sort by date descending and group by month
  const processBehaviors = useCallback(() => {
    if (!behaviors || behaviors.length === 0) {
      setGroupedBehaviors([]);
      return;
    }

    // Parse dates and sort behaviors by date descending
    const behaviorsWithParsedDates = behaviors
      .map((behavior) => {
        const dateObj = new Date(behavior.Date);
        return {
          ...behavior,
          dateObj,
        };
      })
      .filter((behavior) => !isNaN(behavior.dateObj)); // Filter out invalid dates

    // Sort by date descending
    behaviorsWithParsedDates.sort((a, b) => b.dateObj - a.dateObj);

    // Group by month and year
    const grouped = {};

    behaviorsWithParsedDates.forEach((behavior) => {
      const monthYear = behavior.dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(behavior);
    });

    // Convert grouped object to array of sections
    const sections = Object.keys(grouped).map((monthYear) => ({
      title: monthYear,
      data: grouped[monthYear],
    }));

    setGroupedBehaviors(sections);
  }, [behaviors]);

  // Process behaviors whenever behaviors state changes
  useEffect(() => {
    processBehaviors();
  }, [behaviors, processBehaviors]);

  // Function to handle refresh action
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const student = await fetchStudentById(studentId);
      const refreshedBehaviors = student.BehaviorData || [];
      setBehaviors(refreshedBehaviors);
    } catch (error) {
      console.error('Error refreshing behaviors:', error);
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
        sections={groupedBehaviors}
        keyExtractor={(item) => item.id}
        renderItem={renderBehavior}
        renderSectionHeader={renderSectionHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... existing styles remain unchanged
  container: {
    flex: 1,
    backgroundColor: '#192c3b', // Dark background
    padding: 16,
    paddingTop: 108,
  },
  itemContainer: {
    backgroundColor: '#f5f5dc', // Dark item background
    padding: 16,
    marginVertical: 4, // Adjusted for section headers
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
    color: '#000000',
    paddingVertical: 10,
  },
  behaviorText: {
    fontSize: 16,
    color: '#000000',
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
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

export default BehaviorScreen;
