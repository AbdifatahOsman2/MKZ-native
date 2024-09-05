import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteTeachersComment } from '../services/airtableService';

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

  const handleDeleteComment = (commentId) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this comment?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => {
        deleteTeachersComment(commentId)
          .then(() => {
            // Refresh the list or remove the item from the local state to update the UI
            console.log('Comment deleted successfully');
            setComments(comments.filter(comment => comment.id !== commentId));
          })
          .catch(error => console.error('Error deleting comment:', error));
      }}
    ]);
  };

  const renderRightActions = (progress, dragX, commentId) => {
    return (
      <TouchableOpacity onPress={() => handleDeleteComment(commentId)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderComment = ({ item }) => (
    <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}>
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <Text style={styles.commentText}>Teacher comment #{item.index}</Text>
          <TouchableOpacity style={styles.viewButton} onPress={() => openModal(item)}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
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
    backgroundColor: '#252C30',
    padding: 16,
    paddingTop: 108,
  },
  itemContainer: {
    backgroundColor: '#333840',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  viewButton: {
    backgroundColor: '#3A3B3C',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  viewButtonText: {
    fontSize: 14,
    color: '#FFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#333840',
    borderRadius: 8,
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 20,
  },
  closeText: {
    color: 'blue',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default TeachersCommentScreen;
