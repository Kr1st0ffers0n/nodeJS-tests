import SeminarsDBService from '../models/seminars/SeminarDBService.mjs';
import StudentsDBService from '../models/students/StudentsDBService.mjs';


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
    let seminar = null;
    const id = req.params.id;
    try {
      if (id) seminar = await SeminarsDBService.getSeminarById(id);
  
      const students = await StudentsDBService.getList().catch(error => {
        console.error('Error fetching students:', error);
        return [];
      });
  
      res.render('seminarRegister', {
        seminar: seminar || { topic: '', duration: 0, responsibleStudent: null},
        students,
      });
    } catch (error) {
      console.error('Error loading seminar form:', error);
      res.status(500).send('Error loading seminar form');
    }
  }

  // Збереження або оновлення семінару
  static async saveSeminar(req, res) {
    try {
      const { topic, duration, responsibleStudent } = req.body;

      const seminarData = {
        topic,
        duration: Number(duration),
        responsibleStudent,
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
