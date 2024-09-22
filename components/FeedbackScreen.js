import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { addUserFeedback } from '../firebaseConfig'; // Import the updated feedback function

const FeedbackScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(''); // State for name input
  const [comment, setComment] = useState('');

  const handleInput = () => {
    setModalVisible(true); // Show the modal when the button is pressed
  };

  const handleSubmit = async () => {
    if (name.trim() === '' || comment.trim() === '') {
      Alert.alert('Error', 'Please enter both name and comment.');
    } else {
      try {
        // Call the addUserFeedback function and pass the name and comment
        await addUserFeedback(name, comment);
        Alert.alert('Feedback Submitted', 'Thank you for your feedback!');
        setName(''); // Clear name input
        setComment(''); // Clear the input field after submission
        setModalVisible(false); // Close the modal after submission
      } catch (error) {
        Alert.alert('Error', 'There was an issue submitting your feedback. Please try again.');
        console.error(error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Send Us Your Feedback</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Help Improve Our App</Text>
        <Text style={styles.cardText}>
          We value your feedback! Share your thoughts and suggestions to help us enhance your experience.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleInput}>
          <Text style={styles.buttonText}>Submit Feedback</Text>
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
            <Text style={styles.modalText}>Enter your name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="#ccc"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.modalText}>Enter your comment:</Text>
            <TextInput
              editable
              multiline
              numberOfLines={4}
              maxLength={40}
              style={styles.inputComment}
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
    marginTop: 25,
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
  inputComment: {
    backgroundColor: '#1f2428',
    color: '#fff',
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 30,
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

export default FeedbackScreen;
