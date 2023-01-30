const express = require("express");
const router = express.Router();
const { login, createUser, getUserById, update, autoLogin, logout } = require("../controllers/users");
const multer = require("multer");
const path = require("path");
const UserModel = require("../models/users");
const checkAuth = require("../middleware/checkAuth");

const storage = multer.diskStorage({
    destination: "./public/uploads/images",
    filename: (req, file, cb) => {
      return cb(
        null,
        `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const uploadFile = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 2048 * 2048 * 5,
    },
  });

router.post("/login", login);
router.get("/autologin", autoLogin);
router.get("/logout", logout);
router.post("/create", createUser);
router.get("/info/:user_id", [checkAuth], getUserById);
router.put("/info/:user_id", [checkAuth], update);

module.exports = router;