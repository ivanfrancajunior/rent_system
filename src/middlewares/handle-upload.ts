import multer from "multer";
import { ulid } from "ulid";

const extractExtension = (value: string) => {
  const [filename, ext] = value.split(".");

  return ext;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp/");
  },

  filename: (req, file, cb) => {
    cb(null, ulid() + "." + extractExtension(file.originalname));
  },
});

export const upload = multer({ storage: storage });
