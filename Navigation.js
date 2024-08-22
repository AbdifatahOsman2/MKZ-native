import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Importing Ionicons for the back arrow
import StudentListScreen from './components/StudentListScreen';
import StudentDetailScreen from './components/StudentDetailScreen';
import LessonsScreen from './components/LessonsScreen';
import BehaviorScreen from './components/BehaviorScreen';
import AttendanceScreen from './components/AttendanceScreen';
import TeachersCommentScreen from './components/TeachersCommentScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StudentList">
        <Stack.Screen
          name="StudentList"
          component={StudentListScreen}
          options={{ headerShown: true , headerTransparent: true,
            headerStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0)',  // Transparent background
            }}}  // Hiding the header
          
        />

        <Stack.Screen
          name="StudentDetail"
          component={StudentDetailScreen}
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
            title: 'Student Detail',
            headerTransparent: true,  // Make the header background transparent
            headerStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0)',  // Transparent background
            },
          })}
        />
        <Stack.Screen
          name="Lessons"
          component={LessonsScreen}
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
            title: 'Lessons',
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0)',
            },
          })}
        />
        <Stack.Screen
          name="Behavior"
          component={BehaviorScreen}
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
            title: 'Behavior',
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0)',
            },
          })}
        />
        <Stack.Screen
          name="Attendance"
          component={AttendanceScreen}
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
            title: 'Attendance',
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0)',
            },
          })}
        />
        <Stack.Screen
          name="TeachersComment"
          component={TeachersCommentScreen}
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
            title: 'Teachers Comment',
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0)',
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
