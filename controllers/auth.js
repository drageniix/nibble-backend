const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.getAllUsers = async (req, res, next) =>
  User.find()
    .select("email name privilege")
    .exec()
    .then(users => res.status(200).json({ message: "Users fetched.", users }))
    .catch(err => next(err));

exports.signup = async (req, res, next) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  new User({
    email,
    name,
    password: hashedPassword
  })
    .save()
    .then(user => {
      const response = login(user);
      return res.status(201).json(response);
    })
    .catch(err => next(err));
};

exports.login = async (req, res, next) =>
  User.findOne({ email: req.body.email })
    .then(user => {
      const response = login(user);
      res.status(200).json(response);
    })
    .catch(err => next(err));

exports.updateUserDetails = async (req, res, next) => {
  let updateInfo = {
    email: req.body.email,
    name: req.body.name
  };

  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    updateInfo.password = hashedPassword;
  }

  User.findOneAndUpdate(
    { _id: req.userId },
    { $set: updateInfo },
    { new: true }
  )
    .exec()
    .then(user =>
      res.status(201).json({
        user: getUser(user),
        message: "User updated."
      })
    )
    .catch(err => next(err));
};

function login(user) {
  return {
    token:
      "Bearer " +
      jwt.sign(
        {
          email: user.email,
          userId: user._id.toString()
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      ),
    user: getUser(user),
    userId: user._id.toString(),
    privilege: user.privilege
  };
}

function getUser(user) {
  return {
    email: user.email,
    privilege: user.privilege,
    name: user.name
  };
}
