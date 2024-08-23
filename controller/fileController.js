import ErrorHandler from "../errorhandler/errHandler.js";
import fileUploader from "../helper/multer.js";
import User from "../model/userModel.js";
import Product from "../model/productModel.js";
import File from "../model/fileModel.js";
import path from "path";
import fs from "fs";

class FileController {
  static async singleFile(req, res, next) {
    // find the user profile
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("user is not found", 400));
    }

    // access the uploaded file
    if (!req.file || req.file.fieldname !== "avatar") {
      return next(new ErrorHandler("No file uploaded", 400));
    }

    // store the file and set up a file skeleton
    const file = req.file;
    const fileSkeleton = {
      userId: req.user.id,
      public_id: file.filename,
      url: file.path,
    };

    // store the file in the data base
    const avatar = await File.create(fileSkeleton);

    // push the file id and url in the user profile
    user.avatar.public_id = file.filename;
    user.avatar.url = file.path;
    await user.save({
      validateBeforeSave: false,
    });

    // return the response
    res.status(200).json({
      success: true,
      message: "File uploaded",
      avatar,
    });
  }

  static async updateSingleFile(req, res, next) {
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

  static async deleteSingleFile(req, res, next) {
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

  static async deleteSingleFiles(req, res, next) {
    const { id } = req.params;

    // check if the file is exist or not
    const file = await File.findById(id);
    if (!file) {
      return next(new ErrorHandler("file is not found", 404));
    }

    console.log(file);

    //find the authe user
    const user = await User.findById(req.user.id);

    // check if the user is authorized to delete the file
    if (req.user.id !== file.userId) {
      return next(
        new ErrorHandler("user is not authorized to delete the file", 400)
      );
    }

    // delete the file from storage
    const filePath = path.join(process.cwd(), "/public", file.url);
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      return next(new ErrorHandler("File deletion failed", 500));
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
      message: "File deleted",
      deletefile,
    });
  }

  static async multiFile() {}
}

export default FileController;
