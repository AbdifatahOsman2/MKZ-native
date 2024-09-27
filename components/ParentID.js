import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const ParentID = ({ route }) => {
  const ParentID = route.params.ParentID;

  // Extract the last 4 characters and convert to uppercase
  const formattedParentID = ParentID.slice(-4).toUpperCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.description}>
        Here is your Code:   
        <Text style={{ fontWeight: 'bold', color: '#2dba4e', fontSize: 25, margin: 10 }}> {formattedParentID}</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    flexDirection: 'row',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'semibold',
    lineHeight: 24, // Enhanced readability with increased line height
    color: '#fff',  // Softened text color for better readability
  },
});

export default ParentID;
