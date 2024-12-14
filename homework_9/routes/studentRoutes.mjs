import express from 'express';
import StudentController from '../controllers/studentController.mjs';
import UploadManager from '../utils/UploadManager.mjs'; // Використовуємо UploadManager для Multer

const router = express.Router();

// Отримуємо всіх студентів
router.get('/', StudentController.getAllStudents);

// Отображаємо форму реєстрації/редагування студента
router.get('/register/:id?', StudentController.registerStudentForm);

// Оновлюємо або додаємо нового студента
router.post(
  '/register/:id?',
  UploadManager.none(), // Тут ми використовуємо Multer для обробки одного файлу
  StudentController.saveStudent // Далі йде обробка студента
);

// Видалення студента
router.post('/delete/:id', StudentController.deleteStudent);

export default router;
