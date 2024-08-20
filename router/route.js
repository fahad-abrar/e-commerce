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

// product route
router.post('/product/createproduct', catchTry(ProductController.createProduct))
router.get('/product/get', catchTry(ProductController.getProduct))
router.get('/product/get/:id', catchTry(ProductController.getProductById))
router.get('/product/search', catchTry(ProductController.searchProduct))
router.put('/product/update/:id', catchTry(ProductController.updateProduct))
router.delete('/product/delete/:id', catchTry(ProductController.deleteProduct))






export default router