import React from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import aboutBG from '../assets/aboutBG.png';

const AboutPage = () => {
  return (
    <ImageBackground source={aboutBG} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>About Us</Text>
          <Text style={styles.description}>
            Markaz al-Najah (Success Center) is a platform for teachers and students to connect and gain valuable insights into their Islamic and Quranic learning journey. It fosters communication and understanding, ensuring that everyone involved can monitor progress and contribute to a student’s spiritual and educational growth.
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#2a3232',
  },
  contentContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 150, // Pushes the text up by 50 units
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default AboutPage;
