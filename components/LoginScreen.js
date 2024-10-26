// LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({ navigation }) => {
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

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await postAuthActions(userCredential);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const postAuthActions = async (userCredential) => {
    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem('userToken', token);

    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const userData = await getDoc(userDocRef);

    if (!userData.exists()) {
      Alert.alert('Login Error', 'User data not found.');
      return;
    }

    const { name = '', role, ParentID, TeacherID, AdminID } = userData.data();

    if (role === 'Parent') {
      navigation.replace('StudentList', { ParentID, name });
    } else if (role === 'Teacher') {
      navigation.replace('TeachersView', { TeacherID, name });
    } else if (role === 'Admin') {
      navigation.replace('AdminView', { AdminID, name });
    } else {
      Alert.alert('Login Error', 'User role is not recognized.');
    }
  };

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
      default:
        errorMessage = 'Authentication failed. Please try again.';
        break;
    }

    Alert.alert('Authentication Error', errorMessage);
  };

  return (
    <View style={styles.outerContainer}>
      <Image source={require('../assets/BG4.png')} style={styles.backgroundImage} />
      <View style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/MKZlogo.png')} style={styles.logo} />
        </View>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subTitle}>
          Don’t have an account?{' '}
          <Text style={styles.signUpLink} onPress={() => navigation.navigate('Register')}>
            Sign Up
          </Text>
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
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
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleEmailLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or</Text>

        <View style={styles.socialLoginContainer}>
          <TouchableOpacity style={styles.phoneButton} onPress={() => navigation.navigate('PhoneNumber')}>
            <MaterialCommunityIcons name="phone" size={24} color="#107E4D" />
            <Text style={styles.socialButtonText}>Continue with Phone Number</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <MaterialCommunityIcons name="google" size={24} color="#333" />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <MaterialCommunityIcons name="facebook" size={24} color="#333" />
            <Text style={styles.socialButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#e0e5ec',
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
    color: '#000000',
    fontWeight: 'semibold',
    marginBottom: 20,
  },
  signUpLink: {
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
  loginButton: {
    backgroundColor: '#107E4D',
    borderRadius: 10,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialLoginContainer: {
    width: '100%',
    alignItems: 'center',
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f0e4',
    borderRadius: 10,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 10,
  },
  orText: {
    color: '#000000',
    marginVertical: 10,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    marginVertical: 5,
  },
  socialButtonText: {
    color: '#333',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default LoginScreen;
