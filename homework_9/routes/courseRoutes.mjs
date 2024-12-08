import express from 'express';
import UploadManager from '../utils/UploadManager.mjs';  
import CourseController from '../controllers/courseController.mjs';

const router = express.Router();

// Роут для отримання всіх курсів
router.get('/', CourseController.getAllCourses);

// Роут для відображення форми реєстрації або редагування курсу
router.get('/register/:id?', CourseController.registerCourseForm);

// Роут для збереження нового або оновленого курсу
router.post('/register/:id?', UploadManager.none(), CourseController.saveCourse);

// Роут для видалення курсу
router.delete('/:id', CourseController.deleteCourse);

export default router;
