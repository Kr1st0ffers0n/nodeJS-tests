import express from 'express'
import mainRoutes from './mainRoutes.mjs'
import authRoutes from './authRoutes.mjs'
import userRoutes from './userRoutes.mjs'
import productRoutes from './productRoutes.mjs'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/', mainRoutes)

export default router
