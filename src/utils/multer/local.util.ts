import multer from "multer";
import path from "node:path";
import fs from "node:fs";

export const localFileUpload = ({customPath='general'}:{customPath?:string})=>{
    let basePath = `uploads/${customPath}`
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            if(req.user?._id){
                basePath += `/${req.user._id}`;
            }
            const fullPath = path.resolve(`./src/${basePath}`);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
            }
            cb(null, fullPath);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + Math.random()+ '-' +file.originalname);
        }
    })
    return multer({
        storage
    })
}