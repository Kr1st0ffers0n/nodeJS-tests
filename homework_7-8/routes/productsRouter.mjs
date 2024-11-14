import express from 'express'
import ProductController from '../controllers/prodController.mjs'
import ProdValidator from '../validators/ProdValidator.mjs'
import { checkSchema } from 'express-validator'
import UploadManager from '../utils/UploadManager.mjs'

const upload = UploadManager.getUploadStorageProd(); 

const router = express.Router()

router.get('/', ProductController.ProductsList)
router.get('/add/:id?', ProductController.ProductForm)
router.post(
    '/add/:id?',
    upload.single('prodImage'),
    checkSchema(ProdValidator.productSchema),
    ProductController.addProduct
)
router.delete('/', ProductController.deleteProduct)

export default router