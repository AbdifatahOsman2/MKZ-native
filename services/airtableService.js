import axios from 'axios';
import {EXPO_AIRTABLE_API_KEY, EXPO_AIRTABLE_BASE_ID} from '@env'
const STUDENTS_TABLE = 'Students';
const LESSONS_TABLE = 'Lessons';
const BEHAVIOR_TABLE = 'Behavior';
const ATTENDANCE_TABLE = 'Attendance';
const TEACHERS_COMMENT_TABLE = 'TeachersComment';
// const TEACHERS_TABLE = 'Teachers';

const apiKey =  'patdQUtrzEpyj0U1m.679c92bc19ac4eb1afc4f3ed725f5bd8037a0536531344351d5dba4509c415f1';
const baseId = 'appGLLUgRGvgQGyXC';

const airtableHeaders = {
  Authorization: `Bearer ${apiKey}`,
};

const fetchTableData = async (tableName, recordIds = []) => {
  // Ensure recordIds is always an array
  if (!Array.isArray(recordIds)) {
    recordIds = [];
  }

  const filterByFormula = recordIds.length ? `OR(${recordIds.map(id => `RECORD_ID()='${id}'`).join(',')})` : '';
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}?${filterByFormula ? `filterByFormula=${filterByFormula}` : ''}`;

  try {
    const response = await axios.get(url, { headers: airtableHeaders });
    return response.data.records.map(record => ({
      id: record.id,
      ...record.fields,
    }));
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    throw error;
  }
};

export const fetchLessons = async (lessonIds) => {
  return fetchTableData(LESSONS_TABLE, lessonIds);
};

export const fetchBehavior = async (behaviorIds) => {
  return fetchTableData(BEHAVIOR_TABLE, behaviorIds);
};

export const fetchAttendance = async (attendanceIds) => {
  return fetchTableData(ATTENDANCE_TABLE, attendanceIds);
};

export const fetchTeachersComment = async (commentIds) => {
  return fetchTableData(TEACHERS_COMMENT_TABLE, commentIds);
};


// airtableService.js (modify fetchStudents)
export const fetchStudents = async (ParentID = null) => {
  try {
    let url = `https://api.airtable.com/v0/${baseId}/${STUDENTS_TABLE}`;
    if (ParentID) {
      const filterByFormula = `AND({ParentID} = '${ParentID}')`;
      url += `?filterByFormula=${encodeURIComponent(filterByFormula)}`;
    }

    const response = await axios.get(url, { headers: airtableHeaders });
    const students = response.data.records.map(record => ({
      id: record.id,
      ...record.fields,
    }));

    // Fetch linked data for each student
    for (const student of students) {
      if (student.Lessons) {
        student.LessonsData = await fetchLessons(student.Lessons);
      }
      if (student.Behavior) {
        student.BehaviorData = await fetchBehavior(student.Behavior);
      }
      if (student.Attendance) {
        student.AttendanceData = await fetchAttendance(student.Attendance);
      }
      if (student.Comment) {
        student.CommentData = await fetchTeachersComment(student.Comment);
      }
    }

    return students;
  } catch (error) {
    console.error('Error fetching students with linked data:', error);
    throw error;
  }
};

export const createStudent = async (studentData) => {
  const url = `https://api.airtable.com/v0/${baseId}/${STUDENTS_TABLE}`;
  try {
    const response = await axios.post(url, {
      fields: studentData,
    }, { headers: airtableHeaders });
    return response.data;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

// Update an existing record
export const updateStudent = async (recordId, updatedData) => {
  const url = `https://api.airtable.com/v0/${baseId}/${STUDENTS_TABLE}/${recordId}`;
  try {
    const response = await axios.patch(url, {
      fields: updatedData,
    }, { headers: airtableHeaders });
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

// Delete a record
export const deleteStudent = async (recordId) => {
  const url = `https://api.airtable.com/v0/${baseId}/${STUDENTS_TABLE}/${recordId}`;
  try {
    const response = await axios.delete(url, { headers: airtableHeaders });
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};