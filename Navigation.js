import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthScreen from './components/AuthScreen';
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
import FeedbackScreen from './components/FeedbackScreen';
import ParentID from './components/ParentID';
import AdminView from './components/AdminView';

const Stack = createStackNavigator();

const Navigation = () => {
  const screenOptions = ({ navigation }) => ({
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
    ),
    title: '',
    headerTransparent: true,
    headerStyle: { backgroundColor: 'rgba(0, 0, 0, 0)' },
  });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StudentList" component={StudentListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StudentDetail" component={StudentDetailScreen} options={screenOptions} />
        <Stack.Screen name="Lessons" component={LessonsScreen} options={screenOptions} />
        <Stack.Screen name="Behavior" component={BehaviorScreen} options={screenOptions} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} options={screenOptions} />
        <Stack.Screen name="TeachersComment" component={TeachersCommentScreen} options={screenOptions} />
        <Stack.Screen name="SettingsPage" component={SettingsPage} options={screenOptions} />
        <Stack.Screen name="AboutPage" component={AboutPage} options={screenOptions} />
        <Stack.Screen name="TeachersView" component={TeachersView} options={{ headerShown: false, headerTransparent: true, headerLeft: ()=> null, }}/>
        <Stack.Screen name="AdminView" component={AdminView} options={{ headerShown: false, headerTransparent: true, headerLeft: ()=> null, }}/>
        <Stack.Screen name="TeacherStudentDetail" component={TeacherStudentDetailScreen} options={screenOptions} />
        <Stack.Screen name="AddStudent" component={AddStudent} options={screenOptions} />
        <Stack.Screen name="AddLesson" component={AddLesson} options={screenOptions} />
        <Stack.Screen name="AddBehavior" component={AddBehavior} options={screenOptions} />
        <Stack.Screen name="AddAttendance" component={AddAttendance} options={screenOptions} />
        <Stack.Screen name="AddComment" component={AddComment} options={screenOptions} />
        <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} options={screenOptions} />
        <Stack.Screen name="ParentID" component={ParentID} options={screenOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
