const nodemailer = require("nodemailer");

const sendMail = (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "oauth2",
      user: "heyrides06@gmail.com",
      clientId:
        "344515196022-pct3rhfjv2eharesnt2493udv802bncq.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken:
        "1//04vA1WP4ONodBCgYIARAAGAQSNwF-L9IrRtlHCTYg_LuDRvVO07w_C0J1p_I5vrImW2PdwrRM8kXFCbvbRVNILCbWi3Q67_QK2e4",
      // accessToken: access_token,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
module.exports = sendMail;
