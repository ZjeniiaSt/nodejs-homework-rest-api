const express = require("express");
const ctrl = require("../../controllers/users");
const router = express.Router();
const { auth, upload } = require("../../middlewares");
const { ctrlWrapper, createError, sendMail } = require("../../helpers");
const { schemas, User } = require("../../models/user");
const { validation } = require("../../middlewares");

router.post("/singup", validation(schemas.singup), ctrlWrapper(ctrl.singup));
router.post("/login", validation(schemas.login), ctrlWrapper(ctrl.login));
router.get("/current", auth, ctrl.getCurrent);
router.get("/logout", auth, ctrlWrapper(ctrl.logout));
router.patch("/avatars", auth, upload.single("avatar"), ctrl.updateAvatar);
router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw createError(404);
    }
    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });
    res.json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
});

router.post("/verify", async (req, res, next) => {
  try {
    const { error } = schemas.verifyEmail.validate(req.body);
    if (error) {
      throw createError(400);
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401);
    }

    if (user.verify) {
      throw createError(400, "Verification has already been passed");
    }

    const mail = {
      to: email,
      subject: "Підтвердження реєстрації",
      html: `<a target=a"_blank" href="localhost:3000/api/auth/verify/${user.verificationToken}"> Натисніть для підтвердження email</a>`,
    };
    await sendMail(mail);
    res.json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
