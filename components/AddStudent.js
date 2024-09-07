import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { createStudent, fetchTeachers } from '../services/airtableService';
import RNPickerSelect from 'react-native-picker-select';
import { getParentIds } from '../firebaseConfig';

const AddStudent = ({ navigation }) => {
    const [studentName, setStudentName] = useState('');
    const [age, setAge] = useState('');
    const [classroom, setClassroom] = useState('Quran');
    const [schedule, setSchedule] = useState('Sat-Sun');
    const [gender, setGender] = useState('Male');
    const [parentId, setParentId] = useState('');
    const [parentIds, setParentIds] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState(''); // For selected teacher
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        async function loadInitialData() {
            try {
                const ids = await getParentIds();
                setParentIds(ids.map(id => ({ label: id, value: id })));

                const fetchedTeachers = await fetchTeachers();
                setTeachers(fetchedTeachers.map(teacher => ({
                    label: teacher.Name,
                    value: teacher.id
                })));
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        }

        loadInitialData();
    }, []);

    const handleSubmit = async () => {
        if (!studentName || !age || !classroom || !schedule || !gender || !parentId || !selectedTeacherId) {
            setError('Please fill in all fields.');
            return;
        }

        const studentData = {
            StudentName: studentName,
            Age: age,
            class: classroom,
            schedule: schedule,
            Gender: gender,
            ParentID: parentId,
            Teachers: [selectedTeacherId]
        };

        try {
            await createStudent(studentData);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Failed to create student:', error);
            setError('Failed to submit. Please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Student Name</Text>
            <TextInput
                placeholder="Student Name"
                value={studentName}
                onChangeText={setStudentName}
                style={styles.input}
            />
            
            <Text style={styles.label}>Age</Text>
            <TextInput
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                style={styles.input}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Class</Text>
            <RNPickerSelect
                onValueChange={(value) => setClassroom(value)}
                items={[
                    { label: 'Quran', value: 'Quran' },
                    { label: 'Alif', value: 'Alif' },
                ]}
                style={pickerSelectStyles}
                value={classroom}
            />

            <Text style={styles.label}>Schedule</Text>
            <RNPickerSelect
                onValueChange={(value) => setSchedule(value)}
                items={[
                    { label: 'Sat-Sun', value: 'Sat-Sun' },
                    { label: 'Mon-Fri', value: 'Mon-Fri' },
                ]}
                style={pickerSelectStyles}
                value={schedule}
            />

            <Text style={styles.label}>Gender</Text>
            <RNPickerSelect
                onValueChange={(value) => setGender(value)}
                items={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                ]}
                style={pickerSelectStyles}
                value={gender}
            />

            <Text style={styles.label}>Parent ID</Text>
            <RNPickerSelect
                onValueChange={(value) => setParentId(value)}
                items={parentIds}
                style={pickerSelectStyles}
                value={parentId}
                placeholder={{ label: "Select Parent ID", value: null }}
            />

            <Text style={styles.label}>Teacher</Text>
            <RNPickerSelect
                onValueChange={(value) => setSelectedTeacherId(value)}
                items={teachers}
                style={pickerSelectStyles}
                value={selectedTeacherId}
                placeholder={{ label: "Select Teacher", value: null }}
            />


            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Button title="Submit" onPress={handleSubmit} color="#2dba4e" style= {{paddingTop: 20}} />

            {showSuccessModal && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showSuccessModal}
                    onRequestClose={() => {
                        setShowSuccessModal(false);
                        navigation.goBack();
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Student added successfully!</Text>
                            <TouchableOpacity
                                style={styles.buttonClose}
                                onPress={() => {
                                    setShowSuccessModal(false);
                                    navigation.goBack();
                                }}
                            >
                                <Text style={styles.textStyle}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 125,
        backgroundColor: '#252C30',
    },
    input: {
        height: 50,
        backgroundColor: '#333840',
        borderColor: '#666',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#FFF',
        borderRadius: 5,
    },
    label: {
        fontSize: 16,
        color: '#FFF',
        marginBottom: 20
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalView: {
        margin: 20,
        backgroundColor: '#333840',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    buttonClose: {
        backgroundColor: "#1B73E8",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: '#FFF',
    },
    buttonContainer: {
        marginTop: 20,
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 4,
        color: '#FFF',
        paddingRight: 30, // to ensure the text is never behind the icon
        backgroundColor: '#333840',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 8,
        color: '#FFF',
        paddingRight: 30, // to ensure the text is never behind the icon
        backgroundColor: '#333840',
    },
});

export default AddStudent;
