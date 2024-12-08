import Course from './Course.mjs';
import MongooseCRUDManager from '../MongooseCRUDManager.mjs';

class CoursesDBService extends MongooseCRUDManager {
  async getList(filters = {}) {
    try {
      // Викликаємо populate на запиті
      const courses = await Course.find(filters).populate('students').populate('seminars');
      return courses;
    } catch (error) {
      console.error("Error fetching courses list:", error);
      return [];
    }
  }
  static async createCourse(courseData) {
    try {
      const newCourse = new Course(courseData); // Створюємо новий об'єкт курсу
      await newCourse.save(); // Зберігаємо в базі даних
      return newCourse;
    } catch (error) {
      throw new Error('Error creating course: ' + error.message); // Обробка помилок
    }
  }

  async getCourseById(id) {
    try {
      const course = await Course.findById(id).populate('students').populate('seminars');
      return course;
    } catch (error) {
      console.error("Error fetching course by ID:", error);
      return null;
    }
  }

  async createCourse(courseData) {
    try {
      const course = new Course(courseData);
      await course.save();
      return course;
    } catch (error) {
      console.error("Error creating course:", error);
      return null;
    }
  }

  async updateCourse(id, courseData) {
    try {
      const updatedCourse = await Course.findByIdAndUpdate(id, courseData, { new: true });
      return updatedCourse;
    } catch (error) {
      console.error("Error updating course:", error);
      return null;
    }
  }

  async deleteCourse(id) {
    try {
      await Course.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error("Error deleting course:", error);
      return false;
    }
  }
}

export default new CoursesDBService(Course);
