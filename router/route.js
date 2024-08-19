import express from 'express'
import ProductController from '../controller/productController.js'

const router = express.Router()

router.post('auth/createproduct', ProductController )






export default router