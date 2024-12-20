import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  FlatList,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // New Date Picker
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createTeachersComment } from '../services/airtableService';

const AddTeachersComment = ({ navigation, route }) => {
  const { studentId } = route.params;
  const [date, setDate] = useState(new Date());
  const [comment, setComment] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const commentOptions = [
    { label: 'Excellent progress', value: 'Excellent progress' },
    { label: 'Needs improvement', value: 'Needs improvement' },
    { label: 'Outstanding performance', value: 'Outstanding performance' },
    { label: 'Other', value: 'Other' },
  ];

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    let finalComment = selectedComment === 'Other' ? comment : selectedComment;

    if (!finalComment || !finalComment.trim()) {
      setError('Please select or enter a comment.');
      return;
    }

    const commentData = {
      Student: [studentId],
      Date: formatDate(date),
      Comment: `${finalComment} | ${formatDate(date)}`,
    };

    try {
      await createTeachersComment(commentData);
      setShowConfirmationModal(true);
    } catch (error) {
      console.error("Failed to create teacher's comment:", error);
      setError('Failed to submit comment. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Teacher's Comment</Text>

      <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
        <Icon name="calendar-today" size={20} color="#fff" />
        <Text style={styles.datePickerText}>Pick Date</Text>
      </TouchableOpacity>

      <Text style={styles.dateDisplay}>Date: {formatDate(date)}</Text>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        themeVariant="light"
        textColor="#000"
      />

      {/* Custom Dropdown for Comment */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(true)}
      >
        <Text
          style={
            selectedComment
              ? styles.dropdownButtonText
              : styles.dropdownPlaceholderText
          }
        >
          {selectedComment || "Select a comment..."}
        </Text>
        <Icon name="arrow-drop-down" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        />
        <View style={styles.dropdownModal}>
          <FlatList
            data={commentOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedComment(item.value);
                  setError('');
                  setDropdownVisible(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Conditional Text Input for 'Other' Option */}
      {selectedComment === 'Other' && (
        <TextInput
          placeholder="Enter teacher's comment"
          placeholderTextColor="#ccc"
          value={comment}
          onChangeText={(text) => {
            setComment(text);
            setError('');
          }}
          style={styles.input}
        />
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Comment</Text>
      </TouchableOpacity>

      {showConfirmationModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showConfirmationModal}
          onRequestClose={() => {
            setShowConfirmationModal(false);
            navigation.goBack();
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Comment added successfully!</Text>
              <TouchableOpacity
                style={styles.buttonClose}
                onPress={() => {
                  setShowConfirmationModal(false);
                  navigation.goBack();
                }}
              >
                <Text style={styles.textStyle}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Existing styles
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#252C30',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF',
  },
  input: {
    height: 50,
    backgroundColor: '#333840',
    borderColor: '#666',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#FFF',
    borderRadius: 5,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B73E8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerText: {
    color: '#FFF',
    marginLeft: 10,
  },
  dateDisplay: {
    fontSize: 18,
    color: '#FFF',
    paddingVertical: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#1B73E8',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#333840',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFF',
  },
  buttonClose: {
    backgroundColor: '#1B73E8',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // New styles for the custom dropdown
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333840',
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20,
  },
  dropdownButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  dropdownPlaceholderText: {
    color: '#ccc',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownModal: {
    position: 'absolute',
    top: '55%',
    left: '10%',
    right: '10%',
    backgroundColor: '#333840',
    borderRadius: 5,
    padding: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: '#666',
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default AddTeachersComment;
