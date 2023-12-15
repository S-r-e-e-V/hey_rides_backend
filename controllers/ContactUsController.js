const sendMail = require("../utils/nodemailer");

const ContactUs = async (req, res, next) => {
  try {
    const mailOptions = {
      from: "heyrides06@gmail.com",
      to: "heyrides06@gmail.com",
      subject: "Queries related to Heyrides",
      text: `Name: ${req.body.name}
Email: ${req.body.email}
             
Message: ${req.body.message}`,
    };

    sendMail(mailOptions);
    res.status(200).json({ message: "Email send successfully" });
    // res.status(403).json({ error: { message: "Booking exist for this city" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
module.exports = { ContactUs };
