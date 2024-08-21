import express from 'express'
import catchTry from '../errorhandler/catchTryBlock .js'
import ProductController from '../controller/productController.js'
import UserController from '../controller/userController.js'
import isAuthenticate from '../middlewere/auth.js'







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


// user route 
router.post('/auth/register', catchTry(UserController.registerUser))
router.put('/auth/update/:id', catchTry(UserController.updateUser))
router.get('/auth/alluser', catchTry(UserController.getAllUser))
router.get('/auth/user/:id', catchTry(UserController.getSingleUser))


router.post('/auth/login', catchTry(UserController.logInUser))
router.get('/auth/logout', isAuthenticate, catchTry(UserController.logOutUser))

// password route
router.post('/auth/password/change', catchTry(UserController.changePassword))
router.post('/auth/password/forgot', catchTry(UserController.forgotPassword))
router.post('/auth/password/reset/:hashToken', catchTry(UserController.resetPassword))


export default router