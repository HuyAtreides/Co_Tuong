const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const Oauth2 = google.auth.OAuth2;

const createTransporter = () => {
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
        reject();
      }
      resolve(token);
    });
  })

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });
  return [null, transporter];
 }
 catch(e) {
  return [e.toString(), null]
 }
};

const verifyEmail = async (emailOptions) => {
  const [err, transporter] = await createTransporter();
  if (err) return [err, null]
  return [null, await transporter.sendMail(emailOptions)];
}

module.exports = verifyEmail