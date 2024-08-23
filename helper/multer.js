import multer from "multer";
import path from "path";
import ErrorHandler from "../errorhandler/errHandler.js";

const storage = multer.diskStorage({
  // define the upload path

  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "/public");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // extract the file ext
    const fileExt = path.extname(file.originalname);

    // define  unique name for the uploaded file
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("_") +
      Date.now() +
      fileExt;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: {
    // define the limit of uploaded file
    fileSize: 10 * 1024 * 1024, //10MB
  },
  fileFilter: (req, file, cb) => {
    // extract the file ext
    const fileExt = path.extname(file.originalname).toLowerCase();

    //allowed file ext
    const allowedExt = [".png", ".jpg", ".jpeg", ".gif"];

    // check if the file file is valid or not
    if (!allowedExt.includes(fileExt)) {
      return cb(new ErrorHandler("file formate is not valid", 404), false);
    }
    cb(null, true);
  },
});

export default upload;
