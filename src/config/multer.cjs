const {extname, resolve, default: path} = require("node:path");
const {v4} = require("uuid");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, resolve(__dirname, "../", "../", "uploads"));
	},
	filename: (request, file, cb) => {
		const filename = `${Date.now()}-${file.originalname}`;
		cb(null, filename);
	},
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png", "image/gif"];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Formato de arquivo inválido. Apenas imagens são permitidas."));
    }
};


module.exports = multer({
	storage,
	fileFilter
});
