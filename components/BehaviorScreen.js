import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

const BehaviorScreen = ({ route }) => {
  const { behaviors } = route.params;

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

  return (
    <View style={styles.container}>
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
