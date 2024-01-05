const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const auth = {
  type: "oauth2",
  user: "heyrides06@gmail.com",
  clientId:
    "344515196022-pct3rhfjv2eharesnt2493udv802bncq.apps.googleusercontent.com",
  clientSecret: "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",
  refreshToken:
    "1//04A4I2bQ7tZc7CgYIARAAGAQSNwF-L9IrDk3aQtWwf5P_2Ibypav6gsU6i4QEiu9aAzkJHpkKms0mnAhotjOvpFiA7BmZLSgCU-U",
  // accessToken: access_token,
};
const sendMail = (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: auth,
  });

  const AuthClient = new google.auth.OAuth2(
    auth.clientId,
    auth.clientSecret,
    auth.refreshToken
  );
  AuthClient.setCredentials({ refresh_token: auth.refreshToken });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
module.exports = sendMail;
