import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet } from 'react-native';
import { createStudent } from '../services/airtableService';
import RNPickerSelect from 'react-native-picker-select'; // Import the Picker Select

const AddStudent = ({ navigation }) => {
    const [studentName, setStudentName] = useState('');
    const [age, setAge] = useState('');
    const [classroom, setClassroom] = useState('Quran');
    const [schedule, setSchedule] = useState('Sat-Sun');
    const [gender, setGender] = useState('Male');
    const [parentID, setParentID] = useState('');
    const [teacherID, setTeacherID] = useState('');
    
    const handleSubmit = async () => {
        const studentData = {
            StudentName: studentName,
            Age: age, // Convert age to integer
            class: classroom,
            schedule: schedule,
            Gender: gender,
            ParentID: parentID
        };
        try {
            const result = await createStudent(studentData);
            console.log('Student Created:', result);
            navigation.goBack(); // Navigate back after submission
        } catch (error) {
            console.error('Failed to create student:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

        <TextInput placeholder="Student Name" value={studentName} onChangeText={setStudentName} style={styles.input} />
        <TextInput placeholder="Age" value={age} onChangeText={setAge} style={styles.input} keyboardType="numeric" />

            <Text>Class</Text>
            <RNPickerSelect
                onValueChange={(value) => setClassroom(value)}
                items={[
                    { label: 'Quran', value: 'Quran' },
                    { label: 'Alif', value: 'Alif' },
                ]}
                style={pickerSelectStyles}
                value={classroom}
            />

            <Text>Schedule</Text>
            <RNPickerSelect
                onValueChange={(value) => setSchedule(value)}
                items={[
                    { label: 'Sat-Sun', value: 'Sat-Sun' },
                    { label: 'Mon-Fri', value: 'Mon-Fri' },
                ]}
                style={pickerSelectStyles}
                value={schedule}
            />

            <Text>Gender</Text>
            <RNPickerSelect
                onValueChange={(value) => setGender(value)}
                items={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                ]}
                style={pickerSelectStyles}
                value={gender}
            />

            <TextInput placeholder="Parent ID" value={parentID} onChangeText={setParentID} style={styles.input} />

            <Button title="Submit" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    input: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default AddStudent;
