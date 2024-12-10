import StudentsDBService from '../models/students/StudentsDBService.mjs';
import CoursesDBService from '../models/courses/CoursesDBService.mjs';

class StudentController {
  static async getAllStudents(req, res) {
    try {
      const studentsList = await StudentsDBService.getList({}, 1);
      res.render('studentList', {
        students: studentsList,
        user: req.user,
        title: 'Students',
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching students' });
    }
  }

  static async registerStudentForm(req, res) {
    try {
      const id = req.params.id;
      let student = null;

      if (id) {
        student = await StudentsDBService.getById(id);
      }

      const courses = await CoursesDBService.getList();

      res.render('studentRegister', {
        student,
        courses,
        user: req.user,
        title: id ? 'Edit Student' : 'Add Student',
      });
    } catch (error) {
      res.status(500).json({ error: 'Error loading form' });
    }
  }

  static async saveStudent(req, res) {
    try {
      const { name, age, averageGrade, courseId } = req.body;
      let studentData = { name, age, averageGrade };

      // Перевіряємо, чи є фото студента
      if (req.file) {
        studentData.photo = req.file.path; // Шлях до завантаженого фото
      }

      let student;
      if (req.params.id) {
        student = await StudentsDBService.updateById(req.params.id, studentData);
      } else {
        student = await StudentsDBService.create(studentData);
      }

      if (courseId) {
        await CoursesDBService.updateById(courseId, {
          $addToSet: { students: student._id },
        });
      }

      res.redirect('/student');
    } catch (error) {
      res.status(500).send('Error saving student');
    }
  }

  static async deleteStudent(req, res) {
    try {
      const id = req.params.id;
      await StudentsDBService.deleteById(id);
      res.redirect('/student');
    } catch (error) {
      res.status(500).json({ error: 'Error deleting student' });
    }
  }
}

export default StudentController;
