import CoursesDBService from '../models/courses/CoursesDBService.mjs';
import StudentsDBService from '../models/students/StudentsDBService.mjs'; // Імпортуйте сервіс для студентів
import SeminarsDBService from '../models/seminars/SeminarDBService.mjs';

class CourseController {
  // Отримати всі курси
  static async getAllCourses(req, res) {
    try {
      
      const seminars = await SeminarsDBService.getList();

      const students = await StudentsDBService.getList({});

      const courses = await CoursesDBService.getList();
      courses.forEach((item, ind, arr) => {
        arr[ind].students = item.students.map((student) => student.name).join(","); 
      })
      res.render('coursesList', {
        courses,
        seminars,
        students,
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  // Форма для створення/редагування курсу
  static async registerCourseForm(req, res) {
    let course = null;
    const id = req.params.id;
    try {
      if (id) {
        course = await CoursesDBService.getById(id);
      }
      const students = await StudentsDBService.getList();

      const seminars = await SeminarsDBService.getList();

      res.render("courseRegister", { course, students, seminars });
    } catch (error) {
      res.status(500).json({ error: 'Error loading form' });
    }
  }

  // Збереження або оновлення курсу
  static async saveCourse(req, res) {
    try {
  
      // Перевірка, чи seminars є масивом
      let seminars = req.body.seminars || [];
      if (Array.isArray(seminars)) {
        // Якщо seminars - це масив, все ок
        console.log('Seminars selected:', seminars);
      } else {
        // Якщо seminars не є масивом, передаємо порожній масив
        seminars = [];
        console.log('Invalid seminars data. Defaulting to empty array.');
      }
  
      const { title, duration, students } = req.body;
      const courseData = { title, duration, students: students || [], seminars };
  
      if (req.params.id) {
        const courseId = req.params.id;
        await CoursesDBService.updateCourse(courseId, courseData);
      } else {
        await CoursesDBService.createCourse(courseData);
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
      const course = await CoursesDBService.getById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      Object.assign(course, courseData);
      await course.save();

      return course;
    } catch (error) {
      console.error('Error updating course:', error);
      throw new Error('Error updating course: ' + error.message);
    }
  }

  // Функція для створення курсу
  static async createCourse(courseData) {
    try {
      const newCourse = new Course(courseData);
      await newCourse.save();

      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Error creating course: ' + error.message);
    }
  }

  // Функція для видалення курсу
  static async deleteCourse(req, res) {
    try {
      await CoursesDBService.deleteById(req.body.id)
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete course' })
    }
  }
}

export default CourseController;
