const { User } = require("../../models/user");
const bcrypt = require("bcryptjs");
const { createError, sendMail } = require("../../helpers");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");

const singup = async (req, res, next) => {
  const { email, password } = req.body;
  const result = await User.findOne({ email });
  if (result) {
    throw createError(409, "Email already exist ");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4();
  await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const mail = {
    to: email,
    subject: "Підтвердження реєстрації",
    html: `<a target=a"_blank" href="localhost:3000/api/auth/verify/${verificationToken}"> Натисніть для підтвердження email</a>`,
  };
  await sendMail(mail);
  res.status(201).json({
    user: {
      email,
    },
  });
};

module.exports = singup;
