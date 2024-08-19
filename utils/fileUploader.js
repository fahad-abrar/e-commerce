import fileUpload from "express-fileupload";
import ErrorHandler from "../errorhandler/errHandler.js";
import path from 'path'

const fileUploader = async (files) => {

    //create a array to store the file id and url
    const uploadedFiles = [];

    for (let file of files) {
        // create a unique name
        const fileExt = path.extname(file.name);
        const name = file.name
                        .replace(fileExt, '')
                        .toLowerCase()
                        .split(' ')
                        .join('-') + '-' + Date.now() + fileExt;

        // define the upload path
        const uploadPath = path.join(process.cwd(), 'public', name);

        // move the file to the specified path
        await file.mv(uploadPath, (err) => {

            if(err){
            console.log(err)
                new ErrorHandler('file is not uploaded',400)
            }
        })
        // push the image url and id to the array
        uploadedFiles.push({
            fileId: name,
            url: uploadPath
        });
    }

    return uploadedFiles;
}

export default fileUploader;
