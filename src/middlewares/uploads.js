const path = require("path");
const multer = require("multer");
const req = require("express/lib/request");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../my-uploads"));
  },
  filename: function (req, file, callback) {
    const uniquePrefix = Date.now();
    callback(null, uniquePrefix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
 
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(new Error("Incorrect mime type"), false);
  }
};

const options = {
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
};


const uploads = multer(options);


const uploadFiles = (formKey, method) => {
  return function (req, res, next) {
    let uploadedItem;
    if (method == "single") {
      uploadedItem = uploads.single(formKey);
    } else if (method == "multiple") {
      uploadedItem = uploads.any(formKey);
    }

    return uploadedItem(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).send({ message: err.message });
      } else if (err) {
      
        return res.status(501).send({ message: err.message });
      }

      return next();
    });
  };
};

module.exports = {uploadFiles,uploads}


const upload = multer({ storage: storage }).single('file')


