import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const AboutPage = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.description}>
        This app is a platform for teachers, parents, and students to connect and gain valuable insights into their Islamic and Quranic learning journey. It fosters communication and understanding, ensuring that everyone involved can monitor progress and contribute to a student’s spiritual and educational growth.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24, // Enhanced readability with increased line height
    color: '#666',  // Softened text color for better readability
  },
});

export default AboutPage;
