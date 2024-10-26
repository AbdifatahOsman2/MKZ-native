import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { signInWithPhoneNumber } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, app } from '../firebaseConfig';

const PhoneNumberScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isThrottled, setIsThrottled] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const recaptchaVerifier = useRef(null);

  const validatePhoneNumber = (number) => /^\+1[2-9]\d{9}$/.test(number); // E.164 format validation for US numbers

  const handleContinue = async () => {
    if (isThrottled) {
      Alert.alert('Too Many Attempts', 'Please wait before trying again.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid US phone number.');
      return;
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.current);
      navigation.navigate('VerificationCode', { phoneNumber, verificationId: confirmationResult.verificationId });
      setAttempts((prev) => prev + 1);
      if (attempts >= 3) {
        setIsThrottled(true);
        setTimeout(() => {
          setIsThrottled(false);
          setAttempts(0);
        }, 60000);
      }
    } catch (error) {
      console.error('Phone Login Error: ', error);
      Alert.alert('Authentication Error', 'Failed to send verification code.');
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        attemptInvisibleVerification={true}
      />
      <Image source={require('../assets/pbg.png')} style={styles.backgroundImage} />
      <View style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/MKZlogo.png')} style={styles.logo} />
        </View>
        <Text style={styles.title}>Continue with Phone Number</Text>
        <Text style={styles.subTitle}>
          Please confirm your country code and enter your phone number.
        </Text>

        <TextInput
          placeholder="+1 123 456 7890"
          style={styles.input}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text.startsWith('+1') ? text : `+1${text}`)}
          keyboardType="phone-pad"
        />

        <Text style={styles.warningText}>
          <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#ff6347" />
          {' '}Teachers must log in or register with an email address.
        </Text>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <MaterialCommunityIcons name="phone" size={24} color="#fff" />
          <Text style={styles.continueButtonText}>Continue with Phone Number</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f263d',
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 12,
    color: '#ff6347',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    width: '100%',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#107E4D',
    borderRadius: 10,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default PhoneNumberScreen;
