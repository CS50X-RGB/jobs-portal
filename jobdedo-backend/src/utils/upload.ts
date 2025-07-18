import multer from "multer";
import path from "path";

function fileFilter(req: any, file: Express.Multer.File, cb: any) {
  if (file.fieldname === "resume") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for resume"), false);
    }
  } else if (file.fieldname === "images") {
    if (file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only PNG images are allowed"), false);
    }
  } else {
    cb(new Error("Invalid field Name"), false);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "resume") {
      cb(null, "./uploads/resumes");
    } else if (file.fieldname === "images") {
      cb(null, "./uploads/images");
    } else {
      cb(new Error("Invalid field name"), "");
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  },
});

export const uploadMultiple = multer({
  storage,
  limits: { files: 5 },
}).array("images", 5);

export const uploadFiles = multer({
  storage,
  fileFilter,
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
