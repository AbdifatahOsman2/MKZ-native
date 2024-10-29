import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ImageBackground } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const SettingsPage = ({ navigation, route }) => {
  const auth = getAuth();
  const ParentID = route.params ? route.params.ParentID : null;

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch((error) => {
        Alert.alert('Logout Error', error.message);
      });
  };

  return (
    <ImageBackground source={require('../assets/settingsbg.png')} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('AboutPage')}>
            <Text style={styles.optionText}>About</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#334f7d" />
          </TouchableOpacity>
          {ParentID && (
            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ParentID', { ParentID })}>
              <Text style={styles.optionText}>Parent Code</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#334f7d" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.option} onPress={handleLogout}>
            <Text style={styles.signOutText}>Sign out</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#334f7d" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#203344',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  section: {
    marginTop: 120,
    paddingHorizontal: 24,
    backgroundColor: '#e5ecf4',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#12273e',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#12273e',
    paddingBottom: 8,
    paddingTop: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cfd8e3',
  },
  optionText: {
    fontSize: 16,
    color: '#334f7d',
  },
  signOutText: {
    fontSize: 16,
    color: '#ff0033',
  },
});

export default SettingsPage;
