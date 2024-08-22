import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

const BehaviorScreen = ({ route }) => {
  const { behaviors } = route.params;

  const renderBehavior = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>Behavior Date: {item.Date}</Text>
      <Text>Behavior: {item.Behavior}</Text>
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
    paddingTop: 108
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default BehaviorScreen;
