import axios from 'axios';
const STUDENTS_TABLE = 'Students';
const LESSONS_TABLE = 'Lessons';
const BEHAVIOR_TABLE = 'Behavior';
const ATTENDANCE_TABLE = 'Attendance';
const TEACHERS_COMMENT_TABLE = 'TeachersComment';
import config from '../config';
// const TEACHERS_TABLE = 'Teachers';

const apiKey =  config.AIRTABLE_API_KEY;
const baseId = config.AIRTABLE_BASE_ID;

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
    // Format the data as an array of record objects
    const payload = {
      records: [
        {
          fields: studentData
        }
      ]
    };

    const response = await axios.post(url, payload, { headers: airtableHeaders });

    return response.data;
  } catch (error) {
    console.error('Error creating student:', error.response ? error.response.data : error);  // Log detailed error
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


export const createLesson = async (lessonData) => {
  const url = `https://api.airtable.com/v0/${baseId}/${LESSONS_TABLE}`;
  try {
    const response = await axios.post(url, { fields: lessonData }, { headers: airtableHeaders });
    return response.data;
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
};

export const createBehavior = async (behaviorData) => {
  const url = `https://api.airtable.com/v0/${baseId}/${BEHAVIOR_TABLE}`;
  try {
    const response = await axios.post(url, { fields: behaviorData }, { headers: airtableHeaders });
    return response.data;
  } catch (error) {
    console.error('Error creating behavior:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createAttendance = async (attendanceData) => {
  const url = `https://api.airtable.com/v0/${baseId}/${ATTENDANCE_TABLE}`;
  try {
    const response = await axios.post(url, { fields: attendanceData }, { headers: airtableHeaders });
    return response.data;
  } catch (error) {
    console.error('Error creating behavior:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createTeachersComment = async (commentData) => {
  const url = `https://api.airtable.com/v0/${baseId}/${TEACHERS_COMMENT_TABLE}`;
  try {
    const response = await axios.post(url, { fields: commentData }, { headers: airtableHeaders });
    return response.data;
  } catch (error) {
    console.error('Error creating teacher\'s comment:', error);
    throw error;
  }
};

// New delete functions for Lessons, Behavior, Attendance, and TeachersComment
export const deleteLesson = async (lessonId) => {
  const url = `https://api.airtable.com/v0/${baseId}/${LESSONS_TABLE}/${lessonId}`;
  try {
    const response = await axios.delete(url, { headers: airtableHeaders });
    return response.data;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};

export const deleteBehavior = async (behaviorId) => {
  const url = `https://api.airtable.com/v0/${baseId}/${BEHAVIOR_TABLE}/${behaviorId}`;
  try {
    const response = await axios.delete(url, { headers: airtableHeaders });
    return response.data;
  } catch (error) {
    console.error('Error deleting behavior:', error);
    throw error;
  }
};

export const deleteAttendance = async (attendanceId) => {
  const url = `https://api.airtable.com/v0/${baseId}/${ATTENDANCE_TABLE}/${attendanceId}`;
  try {
    const response = await axios.delete(url, { headers: airtableHeaders });
    return response.data;
  } catch (error) {
    console.error('Error deleting attendance:', error);
    throw error;
  }
};

export const deleteTeachersComment = async (commentId) => {
  const url = `https://api.airtable.com/v0/${baseId}/${TEACHERS_COMMENT_TABLE}/${commentId}`;
  try {
    const response = await axios.delete(url, { headers: airtableHeaders });
    return response.data;
  } catch (error) {
    console.error('Error deleting teacher\'s comment:', error);
    throw error;
  }
};

