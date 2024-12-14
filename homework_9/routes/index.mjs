import express from 'express'
import mainRoutes from './mainRoutes.mjs'
import authRoutes from './authRoutes.mjs'
import userRoutes from './userRoutes.mjs'
import productRoutes from './productRoutes.mjs'
import courseRoutes from './courseRoutes.mjs'
import studentRoutes from './studentRoutes.mjs'
import seminarsRoutes from './seminarsRouter.mjs'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/courses', courseRoutes)
router.use('/student', studentRoutes)
router.use('/seminars', seminarsRoutes)
router.use('/', mainRoutes)

export default router
