import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';

const TeachersCommentScreen = ({ route, navigation }) => {
  const { TeacherID, cm } = route.params;
  

  // Transform string comments into objects
  const formattedComments = cm.map((comment, index) => ({
    id: index.toString(), // Create a unique ID since your data may not include it
    comment: comment,
    index: index + 1 
  }));

  const [comments, setComments] = useState(formattedComments);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const openModal = (comment) => {
    setSelectedComment(comment);
    setModalVisible(true);
  };


  const renderComment = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <Text style={styles.commentText}>Teacher comment #{item.index}</Text>
        <TouchableOpacity style={styles.viewButton} onPress={() => openModal(item)}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleAddComment = () => {
    navigation.navigate('AddComment', { studentId: route.params.StudentID });
  };

  return (
    <View style={styles.container}>
      {TeacherID && (
        <Button
          title="Add New Comment"
          onPress={handleAddComment}
          color="#007BFF"
        />
      )}
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
      />

      {selectedComment && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{selectedComment ? selectedComment.comment : "No comment available"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  commentText: {
    fontSize: 16,
    color: '#333',
  },
  viewButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  viewButtonText: {
    fontSize: 14,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeText: {
    color: 'blue',
    textAlign: 'center',
  },
});


export default TeachersCommentScreen;