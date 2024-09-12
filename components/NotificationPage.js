import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput, Alert } from 'react-native';

const NotificationPage = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState('');

  const handleInput = () => {
    setModalVisible(true); // Show the modal when the button is pressed
  };

  const handleSubmit = () => {
    if (comment.trim() === '') {
      Alert.alert('Error', 'Please enter a comment.');
    } else {
      Alert.alert('Comment Submitted', comment);
      setComment(''); // Clear the input field after submission
      setModalVisible(false); // Close the modal after submission
    }
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
        <TouchableOpacity style={styles.button} onPress={handleInput}>
          <Text style={styles.buttonText}>Customize your experience</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Input */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false); // Close modal if the user clicks outside
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter your comment:</Text>
            <TextInput
              style={styles.input}
              placeholder="Write a comment..."
              placeholderTextColor="#ccc"
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#1f2428',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#1f2428',
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    marginBottom: 20,
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#1B73E8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff0033',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default NotificationPage;
