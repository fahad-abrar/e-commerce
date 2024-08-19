import express from 'express'
import catchTry from '../errorhandler/catchTryBlock .js'
import ProductController from '../controller/productController.js'

const router = express.Router()

router.get('/product', (req, res)=>{
    console.log('its working....')
    res.status(200).json({
        msg:'its working'
    })
})

router.post('/product/createproduct', catchTry(ProductController.createProduct))
router.post('/product/upload', catchTry(ProductController.uploadProduct))






export default router