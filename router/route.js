import express from 'express'
import catchTry from '../errorhandler/catchTryBlock .js'
import ProductController from '../controller/productController.js'
import UserController from '../controller/userController.js'
import isAuthenticate from '../middlewere/auth.js'
import ReviewController from '../controller/reviewController.js'
import OrderController from '../controller/orderController.js'






const router = express.Router()

router.get('/product', (req, res)=>{
    console.log('its working....')
    res.status(200).json({
        msg:'its working'
    })
})

// product route --- >>>
router.post('/product/newproduct', catchTry(ProductController.createProduct))
router.get('/product/get', catchTry(ProductController.getProduct))
router.get('/product/get/:id', catchTry(ProductController.getProductById))
router.get('/product/search', catchTry(ProductController.searchProduct))
router.put('/product/update/:id', catchTry(ProductController.updateProduct))
router.delete('/product/delete/:id', catchTry(ProductController.deleteProduct))


// user route --- >>>
router.post('/auth/register', catchTry(UserController.registerUser))
router.put('/auth/update/:id', isAuthenticate, catchTry(UserController.updateUser))
router.get('/auth/alluser', isAuthenticate, catchTry(UserController.getAllUser))
router.get('/auth/user/:id', isAuthenticate, catchTry(UserController.getSingleUser))
router.get('/auth/me', isAuthenticate, catchTry(UserController.getUser))
router.post('/auth/login', catchTry(UserController.logInUser))
router.get('/auth/logout', isAuthenticate, catchTry(UserController.logOutUser))


// password route --- >>>
router.post('/auth/password/change', catchTry(UserController.changePassword))
router.post('/auth/password/forgot', catchTry(UserController.forgotPassword))
router.post('/auth/password/reset/:token', catchTry(UserController.resetPassword))


// review route --- >>>
router.post('/auth/review/:productId', isAuthenticate, catchTry(ReviewController.createReview))
router.put('/auth/review/update/:id', isAuthenticate, catchTry(ReviewController.updateReview))
router.delete('/auth/review/delete/:id', isAuthenticate, catchTry(ReviewController.deleteReview))
router.post('/auth/review/:id', isAuthenticate, catchTry(ReviewController.updateReview))


// order route --- >>>
router.post('/order/neworder',isAuthenticate, catchTry(OrderController.newOrders))
router.get('/order/allorder',isAuthenticate, catchTry(OrderController.getAllOrder))
router.get('/order/singleorder/:id',isAuthenticate, catchTry(OrderController.getSingleOrder))
router.get('/order/my',isAuthenticate, catchTry(OrderController.getMyOrder))
router.put('/order/update/:id',isAuthenticate, catchTry(OrderController.updateOrder))
router.delete('/order/delete/:id',isAuthenticate, catchTry(OrderController.deleteOrder))






export default router