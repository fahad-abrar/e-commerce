import ErrorHandler from "../errorhandler/errHandler.js";
import fileUploader from "../helper/multer.js";
import User from "../model/userModel.js";
import Product from "../model/productModel.js";
import File from "../model/fileModel.js";
import path from "path";
import fs from "fs";

class FileController {
  static async fileUpload(req, res, next) {
    // find the user profile
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("user is not found", 400));
    }

    // check if the incomimg file is avatar or image
    if (!req.files || (!req.files.avatar && !req.files.image)) {
      return res.status(400).json({
        success: false,
        message: "no files were uploaded or file fields are missing",
      });
    }

    // handle the avatar file
    if (req.files.avatar && req.files.avatar.length > 0) {
      const files = req.files.avatar;

      // set up a file skeleton
      const file = files.map((file) => {
        const fileSkeleton = {
          userId: id,
          public_id: file.filename,
          url: file.path,
        };
        return fileSkeleton;
      });

      // store the avatar file in the data base
      const avatar = await File.create(file);

      //update the avatar of the profile
      user.avatar.public_id = file[0].public_id;
      user.avatar.url = file[0].url;
      await user.save({
        validateBeforeSave: false,
      });

      // return the response
      return res.status(200).json({
        success: true,
        message: "avatar file is uploaded",
        avatar,
      });
    }

    // handle the image file
    console.log("image file is received");
    if (req.files.image && req.files.image.length > 0) {
      console.log(" igame file received =>>> ", req.files.image);

      // check if the product is exist or not
      const { productId } = req.params;
      const product = await Product.findById(productId);
      if (!product) {
        return next(new ErrorHandler("product is not found", 404));
      }

      const files = req.files.image;

      // set up the skeleton
      console.log(files);
      const file = files.map((file) => {
        const fileSkeleton = {
          productId,
          userId: id,
          public_id: file.filename,
          url: file.path,
        };
        return fileSkeleton;
      });

      // store image file in data base
      const image = await File.create(file);

      // push the file id and url in the user profile
      product.image.push(...file);
      await product.save({
        validateBeforeSave: false,
      });

      // return the response
      return res.status(200).json({
        success: true,
        message: "image file is uploaded",
        product,
      });
    }
  }

  static async profileFileUpdate(req, res, next) {
    const { id } = req.params;

    // check if the file is exist or not
    const file = await File.findById(id);
    if (!file) {
      return next(new ErrorHandler("file is not find", 400));
    }

    //find the authe user
    const user = await User.findById(req.user.id);

    // check if the user is authorized to update the file
    if (req.user.id !== file.userId) {
      return next(
        new ErrorHandler("user is not authorized to update the file", 400)
      );
    }

    // access the uploaded file
    if (!req.file || req.file.fieldname !== "avatar") {
      return next(new ErrorHandler("No file uploaded", 400));
    }

    // store the new file and set up a skeleton
    const newFile = req.file;
    const updateFileSkeleton = {
      public_id: newFile.filename,
      url: newFile.path,
    };

    // update the file
    const updateFile = await File.findByIdAndUpdate(id, updateFileSkeleton, {
      new: true,
      runValidators: true,
    });

    // update the file id and url of the user profile
    user.avatar.public_id = newFile.filename;
    user.avatar.url = newFile.path;
    await user.save({
      validateBeforeSave: false,
    });

    // send the response
    return res.status(200).json({
      success: true,
      message: "File uploaded",
      updateFile,
    });
  }

  static async profileFiledelete(req, res, next) {
    const { id } = req.params;

    // check if the file is exist or not
    const file = await File.findById(id);
    if (!file) {
      return next(new ErrorHandler("file is not found", 404));
    }

    //find the authe user
    const user = await User.findById(req.user.id);

    // check if the user is authorized to delete the file
    if (req.user.id !== file.userId) {
      return next(
        new ErrorHandler("user is not authorized to delete the file", 400)
      );
    }

    // deleted the file
    const deletefile = await File.findByIdAndDelete(id);

    // update the file id and url of the user profile
    user.avatar.public_id = undefined;
    user.avatar.url = undefined;
    await user.save({
      validateBeforeSave: false,
    });

    // send the response
    return res.status(200).json({
      success: true,
      message: "File is deleted",
      deletefile,
    });
  }

  static async productFileUpdate(req, res, next) {
    const { id } = req.params;
    const { productId } = req.body;

    // check if the file is exist or not
    const file = await File.findById(id);
    if (!file) {
      return next(new ErrorHandler("file is not find", 400));
    }

    // check if the file is exist or not
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorHandler("product is not find", 400));
    }

    // check if the user is authorized to update the file
    if (id !== file._id.toString()) {
      return next(
        new ErrorHandler("this requsest is not valid for this product", 400)
      );
    }

    // access the uploaded file
    if (!req.file || req.file.fieldname !== "image") {
      return next(new ErrorHandler(" image filed is not valid", 400));
    }

    // store the new file and set up a skeleton
    const newFile = req.file;

    console.log(newFile);
    const updateFileSkeleton = {
      public_id: newFile.filename,
      url: newFile.path,
    };

    // update the file
    const updateFile = await File.findByIdAndUpdate(id, updateFileSkeleton, {
      new: true,
      runValidators: true,
    });

    // update the file id and url of the user profile
    product.image.public_id = newFile.filename;
    product.image.url = newFile.path;
    await product.save({
      validateBeforeSave: false,
    });

    // send the response
    return res.status(200).json({
      success: true,
      message: "File uploaded",
      updateFile,
    });
  }

  static async productFileDelete(req, res, next) {
    // check if the product is exist or not
    const { productId, id } = req.params;
    console.log(productId, id);
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorHandler("product is not found", 404));
    }
    //console.log("product-->>", product);

    // check if the file is exist or not
    const file = await File.findById(id);
    if (!file) {
      return next(new ErrorHandler("file is not found", 404));
    }
    console.log("file-->>", file);

    // deleted the file
    const deletefile = await File.findByIdAndDelete(id);

    // remove the file (image) from the product database
    product.image = product.image.filter((img) => {
      return img._id.toString() !== id;
    });

    // save the product
    await product.save({
      validateBeforeSave: false,
    });

    // send the response
    return res.status(200).json({
      success: true,
      message: "File is deleted",
      deletefile,
    });
  }

  static async getprofileFile(req, res, next) {
    const { id } = req.user;
    // check if the file is exist or not
    const file = await File.find({
      userId: id,
    });
    if (!file) {
      return next(new ErrorHandler("file is no found", 404));
    }
    return res.status(200).json({
      success: true,
      message: "file is retrieved",
      file,
    });
  }

  static async getFileById(req, res, next) {
    const { id } = req.params;
    // check if the file is exist or not
    const file = await File.findById(id);
    if (!file) {
      return next(new ErrorHandler("file is no found", 404));
    }
    return res.status(200).json({
      success: true,
      message: "file is retrieved",
      file,
    });
  }

  static async getallFile(req, res, next) {
    const files = await File.find();
    if (files.length < 0) {
      return next(new ErrorHandler("file is no found", 404));
    }
    return res.status(200).json({
      success: true,
      message: "all the files are retrieved",
      files,
    });
  }
}

export default FileController;
