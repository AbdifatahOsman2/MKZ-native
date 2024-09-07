import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app, auth } from '../firebaseConfig'; 
import Logo from '../assets/Logo.png';

const db = getFirestore(app);

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Parent'); // Default role is Parent

  const handleAuth = async () => {
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Additional logic for setting up a new user
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
          role: role,
          [`${role}ID`]: userCredential.user.uid,
        });
      }
      // Store user token for session persistence
      const token = await userCredential.user.getIdToken();
      await AsyncStorage.setItem('userToken', token);

      // Navigation based on user role
      const userData = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userData.data().role === 'Parent') {
        navigation.navigate('StudentList', { ParentID: userCredential.user.uid, });
      } else {
        navigation.navigate('TeachersView', { TeacherID: userCredential.user.uid,});
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Authentication Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} />
      </View>
      <Text style={styles.title}>Markaz Al-Najaax</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isLogin ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setIsLogin(true)}
        >
          <Text style={isLogin ? styles.activeText : styles.inactiveText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isLogin ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setIsLogin(false)}
        >
          <Text style={!isLogin ? styles.activeText : styles.inactiveText}>Register</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Your email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {!isLogin && (
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Register as:</Text>
            <View style={styles.roleButtonContainer}>
              <TouchableOpacity style={styles.roleButton} onPress={() => setRole('Parent')}>
                <Text style={role === 'Parent' ? styles.roleActiveText : styles.roleInactiveText}>Parent</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.roleButton} onPress={() => setRole('Teacher')}>
                <Text style={role === 'Teacher' ? styles.roleActiveText : styles.roleInactiveText}>Teacher</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleAuth}>
        <Text style={styles.submitButtonText}>{isLogin ? 'Log In' : 'Register'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#24292e',
    paddingTop: 80,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#2b3137',
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#007BFF',
  },
  inactiveButton: {
    backgroundColor: '#2b3137',
  },
  activeText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#888',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 15,
    backgroundColor: '#FFF',
  },
  roleContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  roleLabel: {
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  roleButton: {
    padding: 10,
    borderRadius: 5,
  },
  roleActiveText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  roleInactiveText: {
    color: '#888',
  },
  submitButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AuthScreen;
