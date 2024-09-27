import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPhoneNumber } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'; // Import Firebase Recaptcha Modal
import { app, auth, db } from '../firebaseConfig'; // Import Firebase configuration

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Parent');
  const [invitationCode, setInvitationCode] = useState(''); // For Teacher Invitation Code
  const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number
  const [verificationCode, setVerificationCode] = useState(''); // State for OTP
  const [verificationId, setVerificationId] = useState(null); // Store verificationId from Firebase

  const recaptchaVerifier = useRef(null); // Ref for RecaptchaVerifier

  // Function to validate phone number format (E.164)
  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\+1[2-9]\d{9}$/; // E.164 format validation for US numbers
    return phoneRegex.test(number);
  };

  // Ensure the phone number starts with +1 for the US, and perform login/signup
  const handlePhoneLogin = async () => {
    let formattedPhoneNumber = phoneNumber;
    if (!phoneNumber.startsWith('+1')) {
      formattedPhoneNumber = `+1${phoneNumber}`;
      setPhoneNumber(formattedPhoneNumber);
    }

    if (!validatePhoneNumber(formattedPhoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid US phone number.');
      return;
    }

    try {
      if (!verificationId) {
        const phoneProvider = new signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier.current);
        const confirmationResult = await phoneProvider;
        setVerificationId(confirmationResult.verificationId);
        Alert.alert('Verification Code Sent', 'Please check your phone for the verification code.');
      } else {
        // Verify the OTP
        const credential = await auth.PhoneAuthProvider.credential(verificationId, verificationCode);
        const userCredential = await auth.signInWithCredential(credential);

        // Persist user token in AsyncStorage
        const token = await userCredential.user.getIdToken();
        await AsyncStorage.setItem('userToken', token);

        // Fetch user data and navigate accordingly
        const userData = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userData.data().role === 'Parent') {
          navigation.replace('StudentList', { ParentID: userCredential.user.uid });
        } else {
          navigation.replace('TeachersView', { TeacherID: userCredential.user.uid });
        }
      }
    } catch (error) {
      console.error('Phone Login Error: ', error);
      Alert.alert('Authentication Error', 'Failed to login with phone number.');
    }
  };

  const handleEmailLogin = async () => {
    try {
      let userCredential;

      if (isLogin) {
        // Attempt to sign in
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Validate invitation code if role is Teacher
        if (role === 'Teacher') {
          const codeDocRef = doc(db, 'invitationCodes', invitationCode);
          const codeDocSnap = await getDoc(codeDocRef);

          if (!codeDocSnap.exists || codeDocSnap.data().used) {
            throw new Error('Invalid or already used invitation code.');
          }
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

  const handleAuth = () => {
    if (phoneNumber) {
      handlePhoneLogin();
    } else {
      handleEmailLogin();
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

    Alert.alert('Authentication Error', errorMessage);
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options} // Pass Firebase config here
        attemptInvisibleVerification={true} // Enable invisible verification
      />

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
          placeholder="Your email or phone"
          style={styles.input}
          value={phoneNumber || email}
          onChangeText={(text) => {
            if (text.includes('@')) {
              setEmail(text);
              setPhoneNumber('');
            } else {
              setPhoneNumber(text);
              setEmail('');
            }
          }}
        />
        {!phoneNumber && (
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        )}

        {phoneNumber && verificationId && (
          <TextInput
            placeholder="Verification Code"
            style={styles.input}
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
        )}

        {!isLogin && !phoneNumber && (
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

      <View id="recaptcha-container" />
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
