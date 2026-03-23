import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() + "-" + Math.round(Math.random() * 1e9) +
            path.extname(file.originalname)
        );
    }

});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024   // 5MB limit (Recommended 🔥)
    }
});

export default upload;