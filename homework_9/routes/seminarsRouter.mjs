import express from 'express';
import UploadManager from '../utils/UploadManager.mjs';
import SeminarsController from '../controllers/seminarsController.mjs';

const router = express.Router();

// Роут для отримання всіх семінарів
router.get('/', SeminarsController.getAllSeminars);

// Роут для відображення форми реєстрації/редагування семінару
router.get('/register/:id?', SeminarsController.registerSeminarForm);

// Роут для збереження нового або оновленого семінару
router.post('/register/:id?', UploadManager.none(), SeminarsController.saveSeminar);

// Роут для видалення семінару
router.delete('/', SeminarsController.deleteSeminar);

export default router;
