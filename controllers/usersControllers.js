const Users = require("../models/users.model");
const Doctors = require("../models/doctors.model");
const Appointments = require("../models/appointments.model");
const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");

const userRegister = async (req, res) => {
  // console.log(req.body);
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || !req.file) {
      return res.status(400).json("All fields are mandatory!");
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path); // Remove the file after uploading to Cloudinary

    const userAvailable = await Users.findOne({ email });
    if (userAvailable) {
      return res.status(400).json("Email is already used!");
    }

    const newUser = await Users.create({
      name,
      email,
      password,
      imageUrl: result.secure_url,
    });

    if (newUser) {
      return res.status(201).json("Account has been created");
    } else {
      return res.status(400).json("User data is not valid!");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const userLogin = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "All fields are mandatory" });
  }
  try {
    const { user, token } = await Users.matchPasswordAndCreateToken(
      email,
      password
    );
    res.status(200).cookie("token", token).json({
      access_token: token,
      user: user,
      message: "Login successful!",
    });
  } catch (error) {
    res.status(401).json({
      error: "Authentication failed!",
    });
  }
};

const updateUserInfo = async (req, res) => {
  // console.log(req.params);
  try {
    const user = await Users.findById(req.params.id);
    const { name, email, gender, phone, age, address, password } = req.body;
    // console.log(user);
    if (user) {
      const isMatched = await Users.isPasswordMatched(email, password);
      if (isMatched) {
        user.name = name;
        user.email = email;
        user.gender = gender;
        user.phone = phone;
        user.age = age;
        user.address = address;
        await user.save();
        return res.status(200).json(user);
      } else {
        return res.status(401).json("Authentication failed!");
      }
    } else {
      return res.status(404).json("User not found!");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find()
      .find({ _id: { $ne: req.locals } })
      .select("-password");
    return res.send(users);
  } catch (error) {
    res.status(500).send("Unable to get all users");
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await Users.findByIdAndDelete(req.params.id);
    const removeDoc = await Doctors.findOneAndDelete({
      userId: req.params.id,
    });
    const removeAppoint = await Appointments.findOneAndDelete({
      userId: req.params.id,
    });
    return res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Unable to delete user");
  }
};

module.exports = {
  userLogin,
  userRegister,
  updateUserInfo,
  getAllUsers,
  deleteUser,
};
