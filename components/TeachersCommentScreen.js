import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const TeachersCommentScreen = ({ route }) => {
  const { comments } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const openModal = (comment) => {
    setSelectedComment(comment);
    setModalVisible(true);
  };

  const renderComment = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>Comment Date: {item.Date}</Text>
      <TouchableOpacity onPress={() => openModal(item)}>
        <Text style={styles.viewText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
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
              <Text style={styles.modalText}>Comment: {selectedComment.Comment}</Text>
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
    paddingTop: 108
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  viewText: {
    color: 'blue',
    marginTop: 10,
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
