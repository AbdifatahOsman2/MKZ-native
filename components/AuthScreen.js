import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming this is installed
import Logo from '../assets/Logo.png';
const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Markaz Al-Najaax</Text>

      {/* Toggle between Login and Register */}
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

      {/* Input fields */}
      <View style={styles.inputContainer}>
        <TextInput placeholder="Your email" style={styles.input} />
        <TextInput placeholder="Password" style={styles.input} secureTextEntry />
        {isLogin ? (
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('StudentList')}>
        <Text style={styles.submitButtonText}>{isLogin ? 'Log In' : 'Register'}</Text>
      </TouchableOpacity>

      {/* Social Media Sign In Options */}
      <View style={styles.orContainer}>
      <Text style={styles.orText}>Other sign in options</Text>
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity style={styles.socialIcon}>
        <Icon name="facebook" size={30} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
        <Icon name="google" size={30} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
        <Icon name="apple" size={30} color="#000" />
        </TouchableOpacity>
        </View>
        </View>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ECECF8',
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
    color: '#000',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#FFF',
    borderColor: '#000',
    borderBottomWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  inactiveButton: {
    backgroundColor: '#F0F0F0',
  },
  activeText: {
    color: '#000',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#000',
    fontWeight: '600',
    marginTop: 10,
  },
  submitButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#000',
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
  orText: {
    marginBottom: 10,
    color: '#888',

  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  orContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 120,
    gap: 10,
  },
});

export default AuthScreen;
