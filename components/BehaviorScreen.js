// BehaviorScreen.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const BehaviorScreen = ({ route }) => {
  const { behaviors } = route.params;

  return (
    <ScrollView>
      <View style={{ marginBottom: 20, padding: 10, borderWidth: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Behavior</Text>
        {behaviors.map(behavior => (
          <Text key={behavior.id}>Behavior Date: {behavior.Date}, Behavior: {behavior.Behavior}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default BehaviorScreen;
