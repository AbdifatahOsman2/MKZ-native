import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const ParentID = ({route}) => {

    const ParentID = route.params.ParentID;
    console.log("de", route.params.ParentID);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.description}>
        Here is you Parent ID: <Text style={{ fontWeight: 'bold', color: '#2dba4e', fontSize: 18}}> {ParentID}</Text>
         </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    flexDirection: 'column',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
