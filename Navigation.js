import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Importing Ionicons for the back arrow
import AuthScreen from './components/AuthScreen'; // Import the new AuthScreen
import StudentListScreen from './components/ParentsView';
import StudentDetailScreen from './components/ParentsViewTwo';
import LessonsScreen from './components/LessonsScreen';
import BehaviorScreen from './components/BehaviorScreen';
import AttendanceScreen from './components/AttendanceScreen';
import SplashScreen from './components/SplashScreen';
import TeachersCommentScreen from './components/TeachersCommentScreen';
import SettingsPage from './components/SettingsPage';
import AboutPage from './components/AboutPage';
import TeachersView from './components/TeachersView';
import TeacherStudentDetailScreen from './components/TeacherStudentDetailScreen';
import AddStudent from './components/AddStudent';
import AddLesson from './components/AddLesson';
import AddBehavior from './components/AddBehavior';
import AddAttendance from './components/AddAttendance';
import AddComment from './components/AddComment';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
      name="SplashScreen"
      component={SplashScreen}
      options={{ headerShown: false }} // Hiding the header for the auth screen
    />
        <Stack.Screen
          name="AuthScreen"
          component={AuthScreen}
          options={{ headerShown: false }} // Hiding the header for the auth screen
        />
        <Stack.Screen
          name="StudentList"
          component={StudentListScreen}
          options={{ headerShown: false }}
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
            headerTransparent: true,
            headerStyle: { backgroundColor: 'rgba(0, 0, 0, 0)' },
          })}
        />
        {/* Other Screens */}
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
            headerStyle: { backgroundColor: 'rgba(0, 0, 0, 0)' },
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
            headerStyle: { backgroundColor: 'rgba(0, 0, 0, 0)' },
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
            headerStyle: { backgroundColor: 'rgba(0, 0, 0, 0)' },
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
            headerStyle: { backgroundColor: 'rgba(0, 0, 0, 0)' },
          })}
        />
        <Stack.Screen name="SettingsPage" component={SettingsPage} />
        <Stack.Screen name="AboutPage" component={AboutPage} />
        <Stack.Screen name="TeachersView" component={TeachersView} options={{ headerShown: false }}/>
        <Stack.Screen name="TeacherStudentDetail" component={TeacherStudentDetailScreen} />
        <Stack.Screen name="AddStudent" component={AddStudent} />
        <Stack.Screen name="AddLesson" component={AddLesson} />
        <Stack.Screen name="AddBehavior" component={AddBehavior} />
        <Stack.Screen name="AddAttendance" component={AddAttendance} />
        <Stack.Screen name="AddComment" component={AddComment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
