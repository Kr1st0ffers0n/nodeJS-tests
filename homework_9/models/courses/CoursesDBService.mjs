import Course from './Course.mjs';
import MongooseCRUDManager from '../MongooseCRUDManager.mjs';

class CoursesDBService extends MongooseCRUDManager {
  async getList(filters = {}) {
    try {
      // Викликаємо populate на запиті, щоб отримати студентів і семінари
      const courses = await Course.find(filters)
        .populate('students')
        .populate({
          path: 'seminars',
          populate: { path: 'responsibleStudent', select: 'name' },
        });
      return courses;
    } catch (error) {
      console.error("Error fetching courses list:", error);
      return [];
    }
  }

  async getCourseById(id) {
    try {
      const course = await Course.findById(id)
        .populate('students')  // Популюємо студентів
        .populate('seminars');  // Популюємо семінари
      return course;
    } catch (error) {
      console.error("Error fetching course by ID:", error);
      return null;
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
  static async addSeminarToCourse(courseId, seminarId) {
    try {
      const course = await Course.findById(courseId);
      if (!course) throw new Error('Course not found');

      course.seminars.push(seminarId);
      await course.save();
    } catch (error) {
      console.error('Error adding seminar to course:', error);
      throw new Error('Failed to add seminar to course');
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

}

export default new CoursesDBService(Course);
