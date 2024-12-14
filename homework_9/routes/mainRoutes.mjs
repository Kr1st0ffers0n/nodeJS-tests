import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Express',
    user: req.user,
    currentRoute: '/'  // передаємо поточний маршрут
  });
});

export default router
