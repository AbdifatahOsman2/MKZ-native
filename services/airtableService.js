import axios from 'axios';
const STUDENTS_TABLE = 'Students';
const LESSONS_TABLE = 'Lessons';
const BEHAVIOR_TABLE = 'Behavior';
const ATTENDANCE_TABLE = 'Attendance';
const TEACHERS_COMMENT_TABLE = 'TeachersComment';

// const TEACHERS_TABLE = 'Teachers';

const apiKey =  process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

const airtableHeaders = {
  Authorization: `Bearer ${apiKey}`,
};

export const fetchStudentById = async (studentId) => {
  try {
    const url = `https://api.airtable.com/v0/${baseId}/${STUDENTS_TABLE}/${studentId}`;
    const response = await axios.get(url, { headers: airtableHeaders });

    const student = {
      id: response.data.id,
      ...response.data.fields,
    };
    

    // Fetch linked data for the student
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

    return student;
  } catch (error) {
    console.error('Error fetching student:', error.response?.data || error.message);
    throw error;
  }
};

const fetchTableData = async (tableName, recordIds = []) => {
  // Ensure recordIds is always an array
  if (!Array.isArray(recordIds)) {
    recordIds = [];
  }

  const filterByFormula = recordIds.length
    ? `OR(${recordIds.map((id) => `RECORD_ID()='${id}'`).join(',')})`
    : '';
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}?${
    filterByFormula ? `filterByFormula=${filterByFormula}` : ''
  }`;

  try {
    const response = await axios.get(url, { headers: airtableHeaders });
    return response.data.records.map((record) => ({
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



// airtableService.js

export const fetchStudents = async (teacherName) => {
  try {
    let url = `https://api.airtable.com/v0/${baseId}/${STUDENTS_TABLE}`;

    if (teacherName) {
      // Escape double quotes in teacherName for the formula
      const escapedTeacherName = teacherName.replace(/"/g, '\\"');
      const filterByFormula = `{TeacherName} = "${escapedTeacherName}"`;
      url += `?filterByFormula=${encodeURIComponent(filterByFormula)}`;
    }

    const response = await axios.get(url, { headers: airtableHeaders });
    const students = response.data.records.map((record) => ({
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

export const fetchAllStudents = async () => {
  try {
    const url = `https://api.airtable.com/v0/${baseId}/${STUDENTS_TABLE}`;
    const response = await axios.get(url, { headers: airtableHeaders });
    const students = response.data.records.map((record) => ({
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
    console.error('Error fetching all students with linked data:', error);
    throw error;
  }
};

export const fetchStudentsWithPhoneNumbers = async (phoneNumber = null, ParentID = null) => {
  try {
    const url = `https://api.airtable.com/v0/${baseId}/${STUDENTS_TABLE}`;
    const params = new URLSearchParams();

    // Initialize an array to hold individual filter conditions
    let filterConditions = [];

    // Add conditions based on provided parameters
    if (phoneNumber) {
      filterConditions.push(`{PhoneNumber} = '${phoneNumber}'`);
    }
    if (ParentID) {
      filterConditions.push(`{ParentID} = '${ParentID}'`);
    }

    // Build the filter formula
    if (filterConditions.length > 0) {
      // For OR condition between the filters
      // const filterByFormula = `OR(${filterConditions.join(',')})`;

      // For AND condition between the filters
      const filterByFormula = `OR(${filterConditions.join(',')})`;

      // Append the filterByFormula to the query parameters
      params.append('filterByFormula', filterByFormula);
    }

    // Construct the full URL with query parameters
    const fullUrl = `${url}?${params.toString()}`;

    const response = await axios.get(fullUrl, { headers: airtableHeaders });
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
    console.error('Error fetching students with linked data:', error.response?.data || error.message);
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
          fields: studentData,
        },
      ],
    };

    const response = await axios.post(url, payload, { headers: airtableHeaders });
    return response.data;
  } catch (error) {
    console.error(
      'Error creating student:',
      error.response ? error.response.data : error
    ); // Log detailed error
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
// Helper to prepare records for deletion in the correct format
const prepareDeleteParams = (recordIds) => {
  const params = new URLSearchParams();
  recordIds.forEach(id => {
    params.append('records[]', id);
  });
  return params;
};

// Function to delete lessons
export const deleteLesson = async (lessonIds) => {
  const url = `https://api.airtable.com/v0/${baseId}/${LESSONS_TABLE}`;
  const params = prepareDeleteParams(lessonIds);
  try {
    const response = await axios.delete(url, {
      headers: airtableHeaders,
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};

// Function to delete behaviors
export const deleteBehavior = async (behaviorIds) => {
  const url = `https://api.airtable.com/v0/${baseId}/${BEHAVIOR_TABLE}`;
  const params = prepareDeleteParams(behaviorIds);
  try {
    const response = await axios.delete(url, {
      headers: airtableHeaders,
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting behavior:', error);
    throw error;
  }
};

// Function to delete attendance
export const deleteAttendance = async (attendanceIds) => {
  const url = `https://api.airtable.com/v0/${baseId}/${ATTENDANCE_TABLE}`;
  const params = prepareDeleteParams(attendanceIds);
  try {
    const response = await axios.delete(url, {
      headers: airtableHeaders,
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting attendance:', error);
    throw error;
  }
};


// Function to delete teacher's comments
export const deleteTeachersComment = async (commentIds) => {
  const url = `https://api.airtable.com/v0/${baseId}/${TEACHERS_COMMENT_TABLE}`;
  const params = prepareDeleteParams(commentIds);
  try {
    const response = await axios.delete(url, {
      headers: airtableHeaders,
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting teacher\'s comment:', error.response?.data || error.message);
    throw error;
  }
};


export const fetchTeachers = async () => {
  const tableName = 'Teachers'; // Make sure this matches exactly with the table name in Airtable
  try {
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
    const response = await axios.get(url, { headers: airtableHeaders });
    const teachers = response.data.records.map(record => ({
      id: record.id,
      ...record.fields,
    }));

    return teachers;
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    throw error;
  }
};
