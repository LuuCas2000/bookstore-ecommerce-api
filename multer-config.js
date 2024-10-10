import multer from "multer";
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `${import.meta.dirname}/images/`);
    },
    filename: function(req, file, cb) {
        const uniqueId = uuidv4();
        cb(null, file.originalname);
    }
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    let extname;
    if ("originalname" in file) {
        extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    }
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Image Only!'));
    }
};