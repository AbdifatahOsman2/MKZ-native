import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const NotificationPage = ({ navigation }) => {

  const handleCustomizePress = () => {
    Alert.alert("notif");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Customize your notification experience</Text>
        <Text style={styles.cardText}>
          Set up push notifications, schedules, and customize swipe options.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleCustomizePress}>
          <Text style={styles.buttonText}>Customize your experience</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    marginTop: 100,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingBottom: 8,
    paddingTop: 16,
  },
  card: {
    marginTop: 25, // Added more vertical space above the card
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#1f2428',
    borderRadius: 8,
    shadowColor: '#fafbfc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fafbfc',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#fafbfc',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1B73E8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fafbfc',
    textAlign: 'center',
  },
});

export default NotificationPage;
