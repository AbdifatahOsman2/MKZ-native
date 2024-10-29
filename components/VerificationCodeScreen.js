import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerificationCodeScreen = ({ route, navigation }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { phoneNumber, verificationId } = route.params;
  const handleVerifyCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      const userCredential = await signInWithCredential(auth, credential);

      const userDocRef = doc(db, 'users', userCredential.user.uid);
      let userSnapshot = await getDoc(userDocRef);

      // If user document doesn't exist, create it with phone number and role 'Parent'
      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          role: 'Parent',
          phoneNumber: phoneNumber,
          name: '', 
        });
        userSnapshot = await getDoc(userDocRef); // Re-fetch to get the latest data
      } else {

        const userData = userSnapshot.data();
        if (!userData.phoneNumber) {
          await setDoc(userDocRef, { ...userData, phoneNumber }, { merge: true });
        }
      }


      const updatedUserData = (await getDoc(userDocRef)).data();
      const token = await userCredential.user.getIdToken();
      await AsyncStorage.setItem('userToken', token);

      if (updatedUserData.role === 'Parent') {
        navigation.replace('StudentList', { ParentID: userCredential.user.uid, phoneNumber });
      } else {
        Alert.alert('Authorization Error', 'This role requires email login.');
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Verification Error: ', error);
      Alert.alert('Verification Error', 'Failed to verify code.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter code</Text>
      <Text style={styles.subTitle}>
        We’ve sent an SMS with an activation code to {phoneNumber}
      </Text>

      <TextInput
        placeholder="Enter verification code"
        style={styles.input}
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyCode}>
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f263d',
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    width: '85%',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  verifyButton: {
    backgroundColor: '#107E4D',
    borderRadius: 10,
    height: 50,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerificationCodeScreen;