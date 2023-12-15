const Users = require("../modals/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/nodemailer");

const SECRET = "HeyRides";

const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.status(403).json({
        error: err,
      });
    }
    let user = new Users({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPass,
    });

    user
      .save()
      .then((user) => {
        res.json({ message: "User added successfully" });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(403).json({
            error: { message: "User already exist" },
          });
        } else {
          res.status(403).json({
            error: err,
          });
        }
      });
  });
};
const login = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;

  Users.findOne({ $or: [{ email: email }, { password: password }] }).then(
    (user) => {
      if (user) {
        bcrypt.compare(password, user.password, function (err, data) {
          if (err) {
            res.status(403).json({
              error: err,
            });
          }
          if (data) {
            let token = jwt.sign({ id: user._id, email: user.email }, SECRET, {
              expiresIn: "7d",
            });
            res.json({
              message: "Login successfull",
              token: token,
              userType: user.userType,
              name: user.name,
            });
          } else {
            res.status(403).json({
              error: { message: "Password does not match" },
            });
          }
        });
      } else {
        res.status(403).json({
          error: { message: "User not found" },
        });
      }
    }
  );
};

const forgotPassword = (req, res, next) => {
  try {
    Users.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        const payload = { email: user.email };
        const token = jwt.sign(payload, SECRET + user._id, {
          expiresIn: "15m",
        });
        const link = `http://localhost:3000/reset-password/${user._id}/${token}`;

        // email

        const mailOptions = {
          from: "heyrides06@gmail.com",
          to: user.email,
          subject: "Reset password of Heyrides website",
          text: `Please click on the link to reset password. ${link}`,
        };

        sendMail(mailOptions);

        res
          .status(200)
          .json({ message: "A link has been send to the email id" });
      } else {
        res.status(403).json({
          error: { message: "User not found" },
        });
      }
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const resetPassword = (req, res, next) => {
  try {
    const payload = jwt.verify(req.body.token, SECRET + req.body.id);
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
      if (err) {
        res.status(403).json({
          error: err,
        });
      }
      Users.updateOne(
        {
          email: payload.email,
        },
        {
          $set: {
            password: hashedPass,
          },
        }
      )
        .then((user) => {
          if (user.matchedCount > 0) {
            res.status(200).json({ message: "Password updated successfully" });
          } else {
            res.status(403).json({ error: { message: "User not found" } });
          }
        })
        .catch((err) => {
          res.status(403).json({ error: { error: err } });
        });
    });
  } catch (error) {
    res.status(403).json({
      error: {
        message:
          "Link is expired. Please try to reset password again. Link is valid only for 15 minutes",
      },
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
