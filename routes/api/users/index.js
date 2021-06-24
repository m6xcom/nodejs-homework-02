const express = require("express");
const router = express.Router();
const guard = require("../../../helpers/guard");
const { validationSignUp, validationSignIn } = require("./validation");
const {
  signup,
  login,
  logout,
  current,
  updateAvatar,
} = require("../../../controllers/users");
const upload = require("../../../helpers/upload");

router.post("/signup", validationSignUp, signup);
router.post("/login", validationSignIn, login);
router.post("/logout", guard, logout);
router.post("/current", guard, current);
router.patch("/avatars", guard, upload.single("avatar"), updateAvatar);
module.exports = router;
