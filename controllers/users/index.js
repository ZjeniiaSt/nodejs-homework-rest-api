const singup = require("./singup");
const login = require("./login");
const getCurrent = require("./getCurrent");
const logout = require("./logout");
const updateAvatar = require("./updateAvatar");
const verificationTokenEmail = require("./verificationTokenEmail");
const verifyEmail = require("./verifyEmail");

module.exports = {
  singup,
  login,
  getCurrent,
  logout,
  updateAvatar,
  verificationTokenEmail,
  verifyEmail,
};
