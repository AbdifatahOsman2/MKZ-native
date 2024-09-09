import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import bg from '../assets/CharColBG.png';

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const auth = getAuth(); // Ensure you have initialized Firebase Auth
  const db = getFirestore(); // Ensure Firestore is initialized

  useEffect(() => {
    // Start fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const subscriber = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, fetch user data
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Use a timeout to ensure the SplashScreen is visible for at least 2.5 seconds
          setTimeout(() => {
            if (userData.role === 'Parent') {
              navigation.replace('StudentList', { ParentID: user.uid });
            } else if (userData.role === 'Teacher') {
              navigation.replace('TeachersView', { TeacherID: user.uid });
            }
          }, 2500);
        }
      } else {
        // No user is signed in
        setTimeout(() => {
          navigation.replace('AuthScreen');
        }, 2500);
      }
    });

    // Cleanup on unmount
    return () => subscriber();
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.imageContainer, opacity: fadeAnim }}>
        <Image source={bg} style={styles.backgroundImage} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default SplashScreen;

// #24292e	
// #2b3137
// #2dba4e