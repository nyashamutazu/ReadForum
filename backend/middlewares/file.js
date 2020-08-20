const path = require("path");
const multer = require("multer");
const slug = require('slug');

const storage = multer.diskStorage({
  destination: __dirname + "/../uploads/",
  filename: function(req, file, cb) {
    cb(
      null,
      slug(req.body.title) +
      "-" +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36) + path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("imageFile");

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
    console.log("Failed check");
  }
}

module.exports = upload;