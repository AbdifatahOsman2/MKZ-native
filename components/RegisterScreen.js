// RegisterScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../firebaseConfig';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await AsyncStorage.setItem('userToken', token);
      }
    });
    return unsubscribe;
  }, []);

  const handleEmailRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        role: 'Parent',
        ParentID: userCredential.user.uid,
        name,
      });

      await postAuthActions(userCredential);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const postAuthActions = async (userCredential) => {
    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem('userToken', token);

    navigation.replace('StudentList', { ParentID: userCredential.user.uid });
  };

  const handleAuthError = (error) => {
    let errorMessage;

    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'The email address is not valid.';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'The email address is already in use by another account.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters.';
        break;
      default:
        errorMessage = 'Registration failed. Please try again.';
        break;
    }

    Alert.alert('Registration Error', errorMessage);
  };

  return (
    <View style={styles.outerContainer}>
      <Image source={require('../assets/BG4.png')} style={styles.backgroundImage} />
      <View style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/MKZlogo.png')} style={styles.logo} />
        </View>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subTitle}>
          Already have an account?{' '}
          <Text style={styles.signInLink} onPress={() => navigation.navigate('Login')}>
            Log In
          </Text>
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>


        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleEmailRegister}
        >
          <Text style={styles.registerButtonText}>Register with Email</Text>
        </TouchableOpacity>


        <Text style={styles.orText}>Or</Text>

        <TouchableOpacity
          style={styles.phoneRegisterButton}
          onPress={() => navigation.navigate('PhoneNumber')}
        >
          <MaterialCommunityIcons name="phone" size={24} color="#107E4D" />
          <Text style={styles.phoneRegisterButtonText}>Register with Phone Number</Text>
        </TouchableOpacity>
        

        <TouchableOpacity
          onPress={() => navigation.navigate('TeacherRegister')}
          style={styles.teacherLinkContainer}
        >
        <MaterialCommunityIcons name="clipboard-account" size={24} color="#000000" />
          <Text style={styles.teacherLinkText}>Register as a Teacher</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0f263d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.2,
  },
  innerContainer: {
    width: '85%',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  signInLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  registerButton: {
    backgroundColor: '#107E4D',
    borderRadius: 10,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    color: '#777',
    marginBottom: 10,
  },
  phoneRegisterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f0e4',
    borderRadius: 10,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 10,
  },
  phoneRegisterButtonText: {
    color: '#333',
    fontSize: 16,
    marginLeft: 10,
  },
  teacherLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9EEDC',
    borderRadius: 10,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    marginTop: 10,
  },
  teacherLinkText: {
    color: '#333',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default RegisterScreen;
