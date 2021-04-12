const express = require("express");
const USERDAO = require("../DAO/USERDAO.js");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, "./uploads/profile_pictures/");
  },

  filename: (_, file, callback) => {
    callback(
      null,
      file.fieldname + Date.now() + path.extname(file.originalname)
    );
  },
});

const filter = (_, file, callback) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    callback(new Error("Only image files are allowed."), false);
  } else callback(null, true);
};

router.get("/profile_pictures/:filename", (req, res) => {
  const { filename } = req.params;
  const readStream = fs.createReadStream(
    `./uploads/profile_pictures/${filename}`
  );

  readStream.on("open", function () {
    readStream.pipe(res);
  });

  readStream.on("error", function (err) {
    res.status(404).end(err.message);
  });
});

router.post("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const upload = multer({
      storage: storage,
      limits: 1,
      fileFilter: filter,
    }).single(id);

    upload(req, res, async (err) => {
      try {
        if (err) return res.json({ message: err.message });
        const user = await USERDAO.updateUserProfilePic(id, req.file.filename);
        return res.json({ user: user, message: null });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
