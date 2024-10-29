import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Modal, Alert, RefreshControl } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteTeachersComment } from '../services/airtableService';
import { Ionicons } from '@expo/vector-icons'; // For the plus and back icons
import { useNavigation } from '@react-navigation/native';

const TeachersCommentScreen = ({ route }) => {
  const navigation = useNavigation();
  const { TeacherID, comments } = route.params;

  // Combine comments and IDs (this comes from the previous screen)
  const formattedComments = Array.isArray(comments)
    ? comments.map((comment, index) => ({
        id: comment.id, 
        comment: comment.comment, 
        index: index,                            
      }))
    : [];

  const [comment, setComments] = useState(formattedComments);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

  // Set header with back button and plus icon
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: TeacherID
        ? () => (
            <TouchableOpacity onPress={handleAddComment} style={{ paddingRight: 10 }}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          )
        : null,
    });
  }, [navigation, TeacherID]);

  // Open modal to view comment details
  const openModal = (comment) => {
    setSelectedComment(comment);
    setModalVisible(true);
  };

  // Handle comment deletion (only if TeacherID exists)
  const handleDeleteComment = async (commentId) => {
    if (!TeacherID) return; // Prevent deletion if not a teacher

    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!commentId) {
              Alert.alert('Error', 'Invalid comment ID');
              return;
            }

            try {
              console.log('Deleting comment ID:', commentId);
              await deleteTeachersComment([commentId]); // Pass ID in an array
              setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
              Alert.alert('Success', 'Comment deleted successfully');
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert('Error', 'Failed to delete comment. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Render the swipeable right action to delete a comment (only for teachers)
  const renderRightActions = (commentId) => (
    TeacherID ? (
      <TouchableOpacity onPress={() => handleDeleteComment(commentId)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    ) : null
  );

  // Render each comment item
  const renderComment = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <Text style={styles.commentText}>Teacher comment #{item.index + 1}</Text>
          <TouchableOpacity style={styles.viewButton} onPress={() => openModal(item)}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );

  // Handle navigation to add new comment screen (only for teachers)
  const handleAddComment = () => {
    if (TeacherID) {
      navigation.navigate('AddComment', { studentId: route.params.StudentID });
    }
  };

  // Function to handle refresh action
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request to refresh the data
    setTimeout(() => {
      setComments(formattedComments); // Replace with actual data fetching logic
      setRefreshing(false);
    }, 2000); // Simulating a 2-second network request
  }, [formattedComments]);

  return (
    <View style={styles.container}>
      <FlatList
        data={comment}
        renderItem={renderComment}
        keyExtractor={(item) => item.id ? item.id.toString() : item.index.toString()} // Use ID or index if no ID
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
              <Text style={styles.modalText}>{selectedComment ? selectedComment.comment : 'No comment available'}</Text>
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
    backgroundColor: '#192c3b',
    padding: 16,
    paddingTop: 108,
  },
  itemContainer: {
    backgroundColor: '#f5f5dc',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  viewButton: {
    backgroundColor: '#6699CC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  viewButtonText: {
    fontSize: 14,
    color: '#000000',
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
  },
});

export default TeachersCommentScreen;
