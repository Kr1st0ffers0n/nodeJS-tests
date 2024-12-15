import express from 'express'
import ProductController from '../controllers/productController.mjs'
/*  Ці ensure... Додаються до маршрута і тим самим дають
змогу користувачам певного типу (ролі) право за цим маршрутом
здійснювати дії над об'єктами сторінки
*/
// ==== Старий метод для кожного окремо =====
// import { ensureAuthenticated, ensureAdmin, ensureManager, ensureGuest } from '../middleware/auth.mjs'
// !!! ==== Універсальний метод
import { ensureAuthenticated, ensureRole } from '../middleware/auth.mjs'
import upload from '../middleware/UploadManager.mjs'

//  !!!====== Не забути перед кодуванням встановити модуль
// !!!====== npm i passport та npm i passport-local 

const router = express.Router()

router.get('/', ProductController.getAllProducts)
// router.get('/:id', ProductController.getProduct)
router.get('/register/:id?', ProductController.registerForm)
router.post(
  '/:id?',
  ensureAuthenticated,
  // ensureManager,
  // !!! === Універсальний метод в якому можна декільком ролям давати права
  ensureRole(['admin', 'manager']),
  upload.single('image'),
  ProductController.registerProduct
)

router.put(
  '/:id',
  ensureAuthenticated,
  // ensureManager,
  // !!! === Універсальний метод в якому можна декільком ролям давати права
  ensureRole(['admin', 'manager']),
  upload.single('image'),
  ProductController.registerProduct
)

router.delete(
  '/',
  ensureAuthenticated,
  // ensureAdmin,
  // !!! === Універсальний метод в якому можна декільком ролям давати права
  ensureRole(['admin']),
  ProductController.deleteProduct
)

export default router
