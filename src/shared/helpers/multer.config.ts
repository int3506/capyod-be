import { diskStorage } from "multer";
import { extname, join } from "path";

export const multerConfig = {
    storage: diskStorage({
        destination: function (req, file, cb) {
            const path = join(process.cwd(), 'uploads', 'images');
            cb(null, path);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        }
    }),
}

export const multerOptions = {
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file. Only jpg, jpeg, png, gif are accepted.'), false);
        }
    },
};