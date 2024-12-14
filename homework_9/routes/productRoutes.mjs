import express from 'express'
import ProductController from '../controllers/productController.mjs'
import { ensureAuthenticated, ensureAdmin } from '../middleware/auth.mjs'
import upload from '../middleware/UploadManager.mjs'

const router = express.Router()

router.get('/', ProductController.getAllProducts)
// router.get('/:id', ProductController.getProduct)
router.get('/register/:id?', ProductController.registerForm)
router.post(
  '/:id?',
  ensureAuthenticated,
  upload.single('image'),
  ProductController.registerProduct
)
router.put(
  '/:id',
  ensureAuthenticated,
  upload.single('image'),
  ProductController.registerProduct
)
router.delete(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  ProductController.deleteProduct
)

export default router
