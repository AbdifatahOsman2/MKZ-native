import React, { useState, useRef } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { app, auth, db } from '../firebaseConfig';

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(''); // Added state for name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Parent');
  const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number
  const [verificationCode, setVerificationCode] = useState(''); // State for OTP
  const [verificationId, setVerificationId] = useState(null); // Store verificationId from Firebase
  const [attempts, setAttempts] = useState(0);
  const [isThrottled, setIsThrottled] = useState(false);

  const recaptchaVerifier = useRef(null); // Ref for RecaptchaVerifier

  // Function to validate phone number format (E.164)
  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\+1[2-9]\d{9}$/; // E.164 format validation for US numbers
    return phoneRegex.test(number);
  };

  const handlePhoneLogin = async () => {
    if (isThrottled) {
      Alert.alert('Too Many Attempts', 'Please wait before trying again.');
      return;
    }

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
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          formattedPhoneNumber,
          recaptchaVerifier.current
        );
        setVerificationId(confirmationResult.verificationId);
        Alert.alert('Verification Code Sent', 'Please check your phone for the verification code.');
        setAttempts((prev) => prev + 1);
        if (attempts >= 3) {
          setIsThrottled(true);
          setTimeout(() => {
            setIsThrottled(false);
            setAttempts(0);
          }, 60000);
        }
      } else {
        const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
        const userCredential = await signInWithCredential(auth, credential);

        const userRef = doc(db, 'users', userCredential.user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          await setDoc(userRef, {
            role: 'Parent',
            phoneNumber: formattedPhoneNumber,
            name: name || '', // Store name if provided
          });
        }

        const token = await userCredential.user.getIdToken();
        await AsyncStorage.setItem('userToken', token);

        const userData = await getDoc(userRef);
        console.log(formattedPhoneNumber, "formattedPhoneNumber");

        if (userData.data().role === 'Parent') {
          navigation.replace('StudentList', {
            ParentID: userCredential.user.uid,
            name: userData.data().name,
            phoneNumber: formattedPhoneNumber,
          });
        } else {
          Alert.alert('If you are a teacher or admin, please use email login.');
        }
      }
    } catch (error) {
      console.error('Phone Login Error: ', error);

      if (error.code === 'auth/too-many-requests') {
        Alert.alert('Too Many Requests', 'You have made too many requests. Please try again later.');
      } else {
        Alert.alert('Authentication Error', 'Failed to login with phone number.');
      }
    }
  };

  const handleEmailLogin = async () => {
    try {
      if (isLogin) {
        // Existing login logic
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Handle post-login actions
        await postAuthActions(userCredential);
      } else {
        // Registration logic

        // Prevent users from registering as Admin
        if (role === 'Admin') {
          Alert.alert('Registration Error', 'You cannot register as an Admin through the app.');
          return;
        }

        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Set user document in Firestore
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
          role: role,
          [`${role}ID`]: userCredential.user.uid,
          name: name, // Store the name
        });

        // Handle post-authentication actions
        await postAuthActions(userCredential);
      }
    } catch (error) {
      console.error(error);
      handleAuthError(error);
    }
  };

  const postAuthActions = async (userCredential) => {
    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem('userToken', token);

    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const userData = await getDoc(userDocRef);

    const userName = userData.data().name || '';

    if (userData.data().role === 'Parent') {
      navigation.replace('StudentList', { ParentID: userCredential.user.uid, name: userName });
    } else if (userData.data().role === 'Teacher') {
      navigation.replace('TeachersView', { TeacherID: userCredential.user.uid, name: userName });
    } else if (userData.data().role === 'Admin') {
      navigation.replace('AdminView', { AdminID: userCredential.user.uid, name: userName });
    } else {
      Alert.alert('Login Error', 'User role is not recognized.');
    }
  };

  const handleAuth = () => {
    if (phoneNumber) {
      // Prevent teachers and admins from registering with phone number
      if (!isLogin && (role === 'Teacher' || role === 'Admin')) {
        Alert.alert('Registration Error', 'Teachers and Admins must register with an email address.');
        return;
      }
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
        firebaseConfig={app.options}
        attemptInvisibleVerification={true}
      />

      <View style={styles.logoContainer}>
        <Image source={require('../assets/MKZlogo.png')} style={styles.logo} />
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

        {!isLogin && (
          <View>
            <TextInput
              placeholder="Your Name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Register as:</Text>
              <View style={styles.roleButtonContainer}>
                <TouchableOpacity style={styles.roleButton} onPress={() => setRole('Parent')}>
                  <Text style={role === 'Parent' ? styles.activeText : styles.inactiveText}>Parent</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.roleButton} onPress={() => setRole('Teacher')}>
                  <Text style={role === 'Teacher' ? styles.activeText : styles.inactiveText}>Teacher</Text>
                </TouchableOpacity>
                {/* Admin role is not selectable during registration */}
              </View>
            </View>
          </View>
        )}

        {phoneNumber && verificationId && (
          <TextInput
            placeholder="Verification Code"
            style={styles.input}
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
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
    width: 150,
    height: 150,
    paddingHorizontal: 10,
    resizeMode: 'contain',
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
    backgroundColor: '#107E4D',
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#107E4D',
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
    color: '#E2A12F',
    fontWeight: 'bold',
  },
  roleInactiveText: {
    color: '#888',
  },
  submitButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#107E4D',
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
