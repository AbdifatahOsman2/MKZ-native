// airtableService.js
import axios from 'axios';

const AIRTABLE_API_KEY = 'patdQUtrzEpyj0U1m.679c92bc19ac4eb1afc4f3ed725f5bd8037a0536531344351d5dba4509c415f1';
const AIRTABLE_BASE_ID = 'appGLLUgRGvgQGyXC';
const STUDENTS_TABLE = 'Students';
const LESSONS_TABLE = 'Lessons';
const BEHAVIOR_TABLE = 'Behavior';
const ATTENDANCE_TABLE = 'Attendance';

const airtableHeaders = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
};

const fetchTableData = async (tableName, recordIds = []) => {
  const filterByFormula = recordIds.length ? `OR(${recordIds.map(id => `RECORD_ID()='${id}'`).join(',')})` : '';
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}?${filterByFormula ? `filterByFormula=${filterByFormula}` : ''}`;

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
fetchAttendance();
export const fetchStudents = async () => {
  try {
    const students = await fetchTableData(STUDENTS_TABLE);
    console.log('Students:', students[0].Attendance);

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
    }


    return students;
  } catch (error) {
    console.error('Error fetching students with linked data:', error);
    throw error;
  }
};

// fetchStudents();
