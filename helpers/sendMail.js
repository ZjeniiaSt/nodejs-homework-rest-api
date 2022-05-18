const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (data) => {
  try {
    const mail = { ...data, from: "jane0704@ukr.net" };
    await sgMail.send(mail);
    return true;
  } catch (error) {
    throw Error;
  }
};

module.exports = sendMail;
