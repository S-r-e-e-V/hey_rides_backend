const Users = require("../modals/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
            let token = jwt.sign(
              { id: user._id, email: user.email },
              "HeyRides",
              { expiresIn: "7d" }
            );
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

const updatePassowrd = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.status(403).json({
        error: err,
      });
    }
    Users.updateOne(
      {
        email: req.body.email,
      },
      {
        $set: {
          password: hashedPass,
        },
      }
    )
      .then((user) => {
        if (user.matchedCount > 0) {
          res.json({
            message: "Password changed successfully",
          });
        } else {
          res.status(403).json({
            error: { message: "User not found" },
          });
        }
      })
      .catch((err) => {
        res.status(403).json({ error: err });
      });
  });
};

const updateProfile = (req, res, next) => {
  Users.updateOne(
    {
      email: req.user.email,
    },
    {
      $set: { name: req.body.name, phone: req.body.phone },
    }
  )
    .then((user) => {
      if (user.modifiedCount > 0) {
        res.json({
          message: "Profile updated successfully",
        });
      } else {
        res.status(403).json({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      res.status(403).json({ error: err });
    });
};
module.exports = { register, login, updatePassowrd, updateProfile };
