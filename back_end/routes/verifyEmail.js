const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const Oauth2 = google.auth.OAuth2;

const createTransporter = async () => {
  try {
    const oauth2Client = new Oauth2(
      process.env.SEND_EMAIL_CLIENT_ID,
      process.env.SEND_EMAIL_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.SEND_EMAIL_REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        accessToken,
        clientId: process.env.SEND_EMAIL_CLIENT_ID,
        clientSecret: process.env.SEND_EMAIL_CLIENT_SECRET,
        refreshToken: process.env.SEND_EMAIL_REFRESH_TOKEN,
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
