// airtableService.test.js

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  fetchLessons,
  fetchBehavior,
  fetchAttendance,
  fetchTeachersComment,
  createLesson,
  deleteLesson
} from '../services/airtableService'; // Assuming the file is airtableService.js
import config from '../config';
// Initialize axios mock adapter
const mock = new MockAdapter(axios);

// const TEACHERS_TABLE = 'Teachers';

const apiKey =  config.AIRTABLE_API_KEY;
const baseId = config.AIRTABLE_BASE_ID;
const airtableHeaders = {
  Authorization: `Bearer ${apiKey}`,
};

// Test fetchStudents
describe('Airtable API Service', () => {
  
  afterEach(() => {
    mock.reset(); // Reset the mock after each test
  });

  it('should fetch students successfully', async () => {
    const mockResponse = {
      records: [
        { id: 'rec1', fields: { Name: 'John Doe', Lessons: ['lesson1'] } },
        { id: 'rec2', fields: { Name: 'Jane Doe' } },
      ],
    };

    // Mock the GET request to the Airtable API
    mock.onGet(`https://api.airtable.com/v0/${baseId}/Students`).reply(200, mockResponse);

    const students = await fetchStudents();

    expect(students).toEqual([
      { id: 'rec1', Name: 'John Doe', Lessons: ['lesson1'] },
      { id: 'rec2', Name: 'Jane Doe' },
    ]);
  });

  it('should handle error when fetching students', async () => {
    // Mock error response
    mock.onGet(`https://api.airtable.com/v0/${baseId}/Students`).reply(500);

    await expect(fetchStudents()).rejects.toThrow('Request failed with status code 500');
  });

  it('should create a student successfully', async () => {
    const studentData = { Name: 'John Doe' };
    const mockResponse = { records: [{ id: 'rec1', fields: { Name: 'John Doe' } }] };

    // Mock POST request
    mock.onPost(`https://api.airtable.com/v0/${baseId}/Students`).reply(200, mockResponse);

    const createdStudent = await createStudent(studentData);

    expect(createdStudent.records[0]).toEqual({
      id: 'rec1',
      fields: { Name: 'John Doe' },
    });
  });

  it('should update a student successfully', async () => {
    const recordId = 'rec1';
    const updatedData = { Name: 'Updated Name' };
    const mockResponse = { id: 'rec1', fields: updatedData };

    // Mock PATCH request
    mock.onPatch(`https://api.airtable.com/v0/${baseId}/Students/${recordId}`).reply(200, mockResponse);

    const updatedStudent = await updateStudent(recordId, updatedData);

    expect(updatedStudent).toEqual(mockResponse);
  });

  it('should delete a student successfully', async () => {
    const recordId = 'rec1';
    const mockResponse = { deleted: true, id: recordId };

    // Mock DELETE request
    mock.onDelete(`https://api.airtable.com/v0/${baseId}/Students/${recordId}`).reply(200, mockResponse);

    const deletedStudent = await deleteStudent(recordId);

    expect(deletedStudent).toEqual(mockResponse);
  });

  it('should fetch lessons successfully', async () => {
    const lessonIds = ['lesson1'];
    const mockResponse = {
      records: [{ id: 'lesson1', fields: { Name: 'Math' } }],
    };

    mock.onGet(`https://api.airtable.com/v0/${baseId}/Lessons?filterByFormula=OR(RECORD_ID()='lesson1')`)
      .reply(200, mockResponse);

    const lessons = await fetchLessons(lessonIds);

    expect(lessons).toEqual([{ id: 'lesson1', Name: 'Math' }]);
  });

  it('should create a lesson successfully', async () => {
    const lessonData = { Name: 'Science' };
    const mockResponse = { id: 'lesson2', fields: lessonData };

    mock.onPost(`https://api.airtable.com/v0/${baseId}/Lessons`).reply(200, mockResponse);

    const createdLesson = await createLesson(lessonData);

    expect(createdLesson).toEqual(mockResponse);
  });

  it('should delete lessons successfully', async () => {
    const lessonIds = ['lesson1'];
    const mockResponse = { deleted: true, id: 'lesson1' };

    mock.onDelete(`https://api.airtable.com/v0/${baseId}/Lessons`).reply(200, mockResponse);

    const deletedLesson = await deleteLesson(lessonIds);

    expect(deletedLesson).toEqual({ deleted: true, id: 'lesson1' });
  });

});
