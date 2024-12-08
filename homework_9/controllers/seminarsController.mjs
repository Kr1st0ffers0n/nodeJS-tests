import SeminarsDBService from '../models/seminars/SeminarDBService.mjs';
import StudentsDBService from '../models/students/StudentsDBService.mjs';
import CoursesDBService from '../models/courses/CoursesDBService.mjs';

class SeminarController {
  // Отримати всі семінари
  static async getAllSeminars(req, res) {
    try {
      const seminars = await SeminarsDBService.getList(); // Отримуємо список семінарів
      res.json(seminars); // Повертаємо семінари у вигляді JSON
    } catch (error) {
      console.error('Error fetching seminars:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  // Форма для створення/редагування семінару
  static async registerSeminarForm(req, res) {
    try {
      const id = req.params.id || null;
      const seminar = id ? await SeminarsDBService.getById(id) : null; // Отримуємо семінар по ID
      const students = await StudentsDBService.getList(); // Отримуємо список студентів
      const courses = await CoursesDBService.getList(); // Отримуємо список курсів

      res.render('seminarRegister', {
        seminar: seminar || { topic: '', duration: 0, student: null, course: null },
        students,
        courses,
      });
    } catch (error) {
      console.error('Error loading seminar form:', error);
      res.status(500).json({ error: 'Error loading seminar form' });
    }
  }

  // Збереження або оновлення семінару
  static async saveSeminar(req, res) {
    try {
      const { topic, duration, student, course } = req.body;

      const seminarData = {
        topic,
        duration: Number(duration),
        student,
        course,
      };

      if (req.params.id) {
        // Якщо є ID семінару, оновлюємо його
        await SeminarsDBService.update(req.params.id, seminarData);
      } else {
        // Якщо ID немає, створюємо новий семінар
        await SeminarsDBService.create(seminarData);
      }

      res.redirect('/courses'); // Перенаправляємо на список курсів
    } catch (error) {
      console.error('Error saving seminar:', error);
      res.status(500).render('seminarRegister', {
        errors: [{ error: error.message }],
        seminar: req.body, // Передаємо введені дані назад у форму
      });
    }
  }

  // Видалення семінару
  static async deleteSeminar(req, res) {
    try {
      await SeminarsDBService.delete(req.params.id);
      res.redirect('/courses'); // Після видалення перенаправляємо на список курсів
    } catch (error) {
      console.error('Error deleting seminar:', error);
      res.status(500).json({ error: 'Error deleting seminar' });
    }
  }
}

export default SeminarController;
