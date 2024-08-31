import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet } from 'react-native';
import { createStudent } from '../services/airtableService';

const AddStudent = ({ navigation }) => {
    const [studentName, setStudentName] = useState('');
    const [age, setAge] = useState('');
    const [classroom, setClassroom] = useState('');
    const [schedule, setSchedule] = useState('');
    const [TeacherID, setTeacherID] = useState('');
    const [gender, setGender] = useState('');
    const [parentID, setParentID] = useState('');

    const handleSubmit = async () => {
        const studentData = {
            StudentName: studentName,
            Age: age,
            class: classroom,
            schedule: schedule,

            Gender: gender,
            ParentID: parentID
        };
        try {
            await createStudent(studentData);
            navigation.goBack(); // Navigate back after submission
        } catch (error) {
            console.error('Failed to create student:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Student Name</Text>
            <TextInput style={styles.input} onChangeText={setStudentName} value={studentName} />

            <Text style={styles.label}>Age</Text>
            <TextInput style={styles.input} onChangeText={setAge} value={age} />

            <Text style={styles.label}>Class</Text>
            <TextInput style={styles.input} onChangeText={setClassroom} value={classroom} />

            <Text style={styles.label}>Schedule</Text>
            <TextInput style={styles.input} onChangeText={setSchedule} value={schedule} />


            <Text style={styles.label}>Gender</Text>
            <TextInput style={styles.input} onChangeText={setGender} value={gender} />

            <Text style={styles.label}>Parent ID</Text>
            <TextInput style={styles.input} onChangeText={setParentID} value={parentID} />

            <Text style={styles.label}>Teacher ID</Text>
            <TextInput style={styles.input} onChangeText={setTeacherID} value={TeacherID} />

            <Button title="Submit" onPress={handleSubmit} />
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    label: {
        fontSize: 18,
        marginBottom: 10
    },
    input: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
        fontSize: 16
    }
});

export default AddStudent;
