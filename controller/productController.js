import ErrorHandler from "../errorhandler/errHandler.js"
import Product from "../model/productModel.js"
import fileUploader from '../utils/fileUploader.js'

class ProductController{
    // create product 
    static async createProduct( req, res){
        const {name, description, price, rating, category, stock, noOFReview, review} = req.body

        if(!name || !description || !price || !category || !stock){
            throw new ErrorHandler('all the fields are required', 404)
        }

        const productData = {
            name, 
            description, 
            price, 
            category, 
            stock,
            rating,
            noOFReview,
            review: [{ review}] 
        }

        console.log(productData)

        const product = await Product.create(productData)

        console.log(product)

        if (req.files && req.files.image) {
            const files = req.files.image
            files.forEach(file=> {
                console.log('image file -->>>>>', file)
            });
            product.image = files.map((file)=>({
                public_id : file.filename,
                url: file.path
            }))

            console.log('publicid--->>>', public_id)
            console.log('url--->>>', url)            
        }

        // save the image in the product 
        await product.save()

        res.status(200).json({
            success: true,
            product: product
        })

    }

    static async uploadProduct( req, res){
        const file = req.files.image
        console.log(req.files.image)

        const image = await fileUploader(file)
        return res.status(200).json({
            image
        })

    }








}


export default ProductController