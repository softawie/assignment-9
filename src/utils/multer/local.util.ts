import multer from "multer";
import path from "node:path";

export const localFileUpload = ()=>{
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve( "./uploads"));
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + Math.random()+ '-' +file.originalname);
        }
    })
    return multer({
        storage
    })
}