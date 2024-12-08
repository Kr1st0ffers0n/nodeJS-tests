import Student from './Student.mjs';
import MongooseCRUDManager from '../MongooseCRUDManager.mjs';

class StudentsDBService extends MongooseCRUDManager {
  async getList(filters = {}) {
    try {
      const students = await Student.find(filters); 
      return students;
    } catch (error) {
      console.error("Error fetching students list:", error);
      return [];
    }
  }
}

export default new StudentsDBService(Student);
