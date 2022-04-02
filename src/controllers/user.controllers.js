const express = require("express");

const User = require("../models/user.models");

 const {uploadFiles,uploads} = require("../middlewares/uploads");

 const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)


const router = express.Router();

router.get("", async (req, res) => {
  try {
    const users = await User.find().lean().exec();

    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.post("", uploads.single("profilePic"), async (req, res) => {
  try {
    
    const user = await User.create({
      firstName: req.body.firstName,
      profilePic: req.file.path,
    });
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.post("/multiple", uploads.any("profilePic"), async (req, res) => {
  try {
    const filePaths = req.files.map((file) => {
      return file.path;
    });

    const user = await User.create({
      firstName: req.body.firstName,
      profilePic: filePaths,
    });

    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});


router.post("", uploadFiles("profilePic", "single"), async (req, res) => {
  try {

    const user = await User.create({
      firstName: req.body.firstName,
      profilePic: req.file.path,
    });
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.post(
  "/multiple",
  uploadFiles("profilePic", "multiple"),
  async (req, res) => {
    try {
      const filePaths = req.files.map((file) => {
        return file.path;
      });

      const user = await User.create({
        firstName: req.body.firstName,
        profilePic: filePaths,
      });

      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  }
);

router.post('/api/profilePic',uploadFiles("profilePic", "single"), async (req, res) =>{
    
    await unlinkAsync(req.profilePic.path)

    res.end("UPLOAD COMPLETED!")
});

router.post('/api/profilePic',uploadFiles("profilePic", "multiple"), async (req, res) =>{
    
    await unlinkAsync(req.profilePic.path)

    res.end("UPLOAD COMPLETED!")
});

module.exports = router;
