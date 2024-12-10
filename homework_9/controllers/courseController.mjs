import CoursesDBService from '../models/courses/CoursesDBService.mjs';
import StudentsDBService from '../models/students/StudentsDBService.mjs'; // Імпортуйте сервіс для студентів
import SeminarsDBService from '../models/seminars/SeminarDBService.mjs';

class CourseController {
  // Отримати всі курси
  static async getAllCourses(req, res) {
    try {
      console.log('Fetching all courses, seminars, and students...');
      const seminars = await SeminarsDBService.getList();
      console.log('Fetched seminars:', seminars);

      const students = await StudentsDBService.getList({});
      console.log('Fetched students:', students);

      const courses = await CoursesDBService.getList();
      courses.forEach((item, ind, arr) => {
        arr[ind].students = item.students.map((student) => student.name).join(","); 
      })
      console.log('Fetched courses:', courses);

      res.render('coursesList', {
        courses,
        seminars,
        students
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
    console.log('Register course form requested. Course ID:', id);
    try {
      if (id) {
        course = await CoursesDBService.getById(id);
        const seminars = await SeminarsDBService.getList();
        console.log('Fetched course for editing:', course);
      }
      const students = await StudentsDBService.getList();
      console.log('Fetched students for form:', students);

      const seminars = await SeminarsDBService.getList();

      res.render("courseRegister", { course, students, seminars });
    } catch (error) {
      console.error('Error loading form:', error);
      res.status(500).json({ error: 'Error loading form' });
    }
  }

  // Збереження або оновлення курсу
  static async saveCourse(req, res) {
    try {
      console.log('Saving course. Request body:', req.body);
  
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
      console.log('Prepared course data:', courseData);
  
      if (req.params.id) {
        const courseId = req.params.id;
        console.log('Updating existing course. Course ID:', courseId);
        await CoursesDBService.updateCourse(courseId, courseData);
      } else {
        console.log('Creating new course.');
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
    console.log('Updating course with ID:', courseId, 'Data:', courseData);
    try {
      const course = await CoursesDBService.getById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      console.log('Found course to update:', course);

      Object.assign(course, courseData);
      await course.save();
      console.log('Updated course:', course);

      return course;
    } catch (error) {
      console.error('Error updating course:', error);
      throw new Error('Error updating course: ' + error.message);
    }
  }

  // Видалення курсу
  static async deleteCourse(req, res) {
    try {
      const courseId = req.params.id;
      console.log('Deleting course with ID:', courseId);

      await CoursesDBService.deleteCourse(courseId);
      console.log('Deleted course with ID:', courseId);

      res.redirect('/courses');
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ error: 'Error deleting course' });
    }
  }

  // Функція для створення курсу
  static async createCourse(courseData) {
    console.log('Creating course with data:', courseData);
    try {
      const newCourse = new Course(courseData);
      await newCourse.save();
      console.log('Created new course:', newCourse);

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
