import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const SettingsPage = ({ navigation, route }) => {
  const auth = getAuth();
  const ParentID = route.params ? route.params.ParentID : null;

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Reset navigation stack and redirect to login screen after successful logout
        navigation.reset({
          index: 0,
          routes: [{ name: 'AuthScreen' }],
        });
      })
      .catch((error) => {
        Alert.alert('Logout Error', error.message);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('AboutPage')}>
          <Text style={styles.optionText}>About</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
        </TouchableOpacity>
        {ParentID && (
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ParentID', { ParentID })}>
            <Text style={styles.optionText}>Parent Code</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Text style={styles.signOutText}>Sign out</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
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
  section: {
    marginTop: 100,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingBottom: 8,
    paddingTop: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
  signOutText: {
    fontSize: 16,
    color: '#ff0033',
  },
});
export default SettingsPage;
