import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app, auth, db } from '../firebaseConfig'; // Import Firestore from config

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Parent');
  const [invitationCode, setInvitationCode] = useState(''); // New state for the invitation code

  // Fetch and validate the invitation code for teacher registration
  const validateInvitationCode = async () => {
    const codeDocRef = doc(db, 'invitationCodes', invitationCode);
    const codeDocSnap = await getDoc(codeDocRef);

    if (!codeDocSnap.exists || codeDocSnap.data().used) {
      throw new Error('Invalid or already used invitation code.');
    }
  };

  const handleAuth = async () => {
    try {
      let userCredential;

      if (isLogin) {
        // Attempt to sign in
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Validate invitation code if role is Teacher
        if (role === 'Teacher') {
          await validateInvitationCode();
        }

        // Register the new user and set additional data
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
          role: role,
          [`${role}ID`]: userCredential.user.uid,
        });
      }

      // Get the token for session persistence
      const token = await userCredential.user.getIdToken();
      await AsyncStorage.setItem('userToken', token);

      // Fetch user data to determine the next screen
      const userData = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      // Use replace to transition to the appropriate screen based on the role
      if (userData.data().role === 'Parent') {
        navigation.replace('StudentList', { ParentID: userCredential.user.uid });
      } else {
        navigation.replace('TeachersView', { TeacherID: userCredential.user.uid });
      }
      
    } catch (error) {
      console.error(error);
      handleAuthError(error);
    }
  };

  // Function to handle authentication errors and show specific error messages
  const handleAuthError = (error) => {
    let errorMessage;

    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'The email address is not valid.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This user account has been disabled.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email. Please check or register.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'The email address is already in use by another account.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters.';
        break;
      default:
        errorMessage = 'Authentication failed. Please try again.';
        break;
    }

    Alert.alert("Authentication Error", errorMessage);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
      <Image source={require('../assets/Logo.png')} style={styles.logo} />

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
          <View>
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
            {/* Show invitation code input only when registering as a teacher */}
            {role === 'Teacher' && (
              <TextInput
                placeholder="Invitation Code"
                style={styles.input}
                value={invitationCode}
                onChangeText={setInvitationCode}
              />
            )}
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
    backgroundColor: '#0f263d',
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
