import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createLesson, deleteLesson } from '../services/airtableService';
import config from '../config.js'  // Replace this with the correct path to your config file

const LESSONS_TABLE = 'Lessons';
const baseId = config.AIRTABLE_BASE_ID;
const apiKey = config.AIRTABLE_API_KEY;

const mock = new MockAdapter(axios);
const baseURL = `https://api.airtable.com/v0/${baseId}/${LESSONS_TABLE}`;

const airtableHeaders = {
  Authorization: `Bearer ${apiKey}`,
};

describe('airtableService', () => {

  afterEach(() => {
    mock.reset(); // Reset mock after each test to avoid interference
  });

  describe('createLesson', () => {
    it('should create a new lesson and return the created lesson data', async () => {
      const lessonData = {
        Students: ['rec12345'],
        Date: '2024-09-07',
        Passed: 'Passed Full',
      };

      const mockResponse = {
        id: 'rec67890',
        fields: lessonData,
      };

      mock.onPost(baseURL, { fields: lessonData }).reply(200, mockResponse);

      const result = await createLesson(lessonData);

      expect(result).toEqual(mockResponse);
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toBe(baseURL);
      expect(mock.history.post[0].headers).toEqual(expect.objectContaining(airtableHeaders));
    });

    it('should throw an error if creating a lesson fails', async () => {
      const lessonData = {
        Students: ['rec12345'],
        Date: '2024-09-07',
        Passed: 'Passed Full',
      };

      mock.onPost(baseURL).reply(500, { error: 'Internal Server Error' });

      await expect(createLesson(lessonData)).rejects.toThrow('Error creating lesson');
    });
  });

  describe('deleteLesson', () => {
    it('should delete a lesson and return success response', async () => {
      const lessonId = 'rec67890';

      mock.onDelete(`${baseURL}/${lessonId}`).reply(200, { deleted: true, id: lessonId });

      const result = await deleteLesson(lessonId);

      expect(result).toEqual({ deleted: true, id: lessonId });
      expect(mock.history.delete.length).toBe(1);
      expect(mock.history.delete[0].url).toBe(`${baseURL}/${lessonId}`);
      expect(mock.history.delete[0].headers).toEqual(expect.objectContaining(airtableHeaders));
    });

    it('should throw an error if deleting a lesson fails', async () => {
      const lessonId = 'rec67890';

      mock.onDelete(`${baseURL}/${lessonId}`).reply(500, { error: 'Internal Server Error' });

      await expect(deleteLesson(lessonId)).rejects.toThrow('Error deleting lesson');
    });
  });
});
