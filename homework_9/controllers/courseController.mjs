import CoursesDBService from '../models/courses/CoursesDBService.mjs';
import StudentsDBService from '../models/students/StudentsDBService.mjs'; // Імпортуйте сервіс для студентів

class CourseController {
  // Отримати всі курси
  static async getAllCourses(req, res) {
    try {
      const courses = await CoursesDBService.getList(); // отримуємо список курсів
      res.render('coursesList', { courses }); // передаємо курси на шаблон
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  // Форма для створення/редагування курсу
  static async registerCourseForm(req, res) {
    try {
      const id = req.params.id || null;
      const course = id ? await CoursesDBService.getCourseById(id) : null;
      const students = await StudentsDBService.getList();
  
      res.render('courseRegister', {
        course: course ? { ...course, students: course.students || [] } : { students: [] }, // Перевірка і ініціалізація порожнього масиву студентів
        students: students || [],
      });
    } catch (error) {
      res.status(500).json({ error: 'Error loading form' });
    }
  }

  // Збереження або оновлення курсу
  static async saveCourse(req, res) {
    try {
      const { title, description, students } = req.body;
      const courseData = { title, description, students: students || [] };

      // Якщо передано ID курсу, виконуємо оновлення
      if (req.params.id) {
        const courseId = req.params.id;
        await CoursesDBService.updateCourse(courseId, courseData);
      } else {
        await CoursesDBService.createCourse(courseData); // Для нового курсу
      }

      res.redirect('/courses');
    } catch (error) {
      console.error('Error saving course:', error);
      res.status(500).render('courseRegister', {
        errors: [{ error: error.message }],
        course: req.body,
      });
    }
  }

  // Оновлення курсу за ID
  static async updateCourse(courseId, courseData) {
    try {
      const course = await Course.findById(courseId); // Знайти курс за ID
      if (!course) {
        throw new Error('Course not found');
      }
      // Оновлюємо дані курсу
      Object.assign(course, courseData);
      await course.save(); // Зберігаємо оновлений курс
      return course;
    } catch (error) {
      throw new Error('Error updating course: ' + error.message);
    }
  }

  // Видалення курсу
  static async deleteCourse(req, res) {
    try {
      // Видаляємо курс по ID
      await CoursesDBService.deleteCourse(req.params.id);
      res.redirect('/courses'); // Після видалення перенаправляємо на список курсів
    } catch (error) {
      res.status(500).json({ error: 'Error deleting course' });
    }
  }

  // Функція для створення курсу
  static async createCourse(courseData) {
    try {
      const newCourse = new Course(courseData);
      await newCourse.save();
      return newCourse;
    } catch (error) {
      throw new Error('Error creating course: ' + error.message);
    }
  }

  // Функція для видалення курсу
  static async deleteCourseById(courseId) {
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      await course.remove();
      return course;
    } catch (error) {
      throw new Error('Error deleting course: ' + error.message);
    }
  }
}

export default CourseController;
