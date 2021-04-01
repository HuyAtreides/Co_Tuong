const nodemailer = require("nodemailer");

const createTransporter = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    return transporter;
  } catch (err) {
    throw new Error(err.toString());
  }
};

const verifyEmail = async (emailOptions) => {
  try {
    const transporter = await createTransporter();
    const result = await transporter.sendMail(emailOptions);
    return result;
  } catch (err) {
    throw new Error(err.toString());
  }
};

module.exports = verifyEmail;
