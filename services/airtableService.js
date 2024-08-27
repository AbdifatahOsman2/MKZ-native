import axios from 'axios';

const STUDENTS_TABLE = 'Students';
const LESSONS_TABLE = 'Lessons';
const BEHAVIOR_TABLE = 'Behavior';
const ATTENDANCE_TABLE = 'Attendance';
const TEACHERS_COMMENT_TABLE = 'TeachersComment';
const TEACHERS_TABLE = 'Teachers';
const apiKey = precess.env.EXPO_AIRTABLE_API_KEY;
const baseId = precess.env.EXPO_AIRTABLE_BASE_ID;


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

export const fetchTeachers = async (teacherIds) => {
  return fetchTableData(TEACHERS_TABLE, teacherIds);
};

export const fetchStudents = async () => {
  try {
    const students = await fetchTableData(STUDENTS_TABLE);

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
      if (student.teacher) {
        // Fetch the teacher's details based on the array of linked teacher IDs
        const teacherDetails = await fetchTeachers(student.teacher);
        // Assuming you want to display the teacher's name(s)
        student.teacherName = teacherDetails.map(teacher => teacher.Name).join(', ') || 'Unknown';
      }
    }
    return students;
  } catch (error) {
    console.error('Error fetching students with linked data:', error);
    throw error;
  }
};
