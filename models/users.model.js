const mongoose = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

const { createHmac, randomBytes } = require("crypto");

const usersSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the name"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please upload Image"],
    },
    gender: {
      type: String,
      esum: ["Male", "Female", "Null"],
      default: "",
    },
    phone: { type: String, default: "" },
    age: { type: String, default: "" },
    address: { type: String, default: "" },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
  },
  {
    timestamps: true,
  }
);

usersSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
    return;
  }
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

usersSchema.static("isPasswordMatched", async function (email, password) {
  const user = await this.findOne({ email });
  console.log("->", user);
  if (!user) throw new Error("User not found!");

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userProvidedHash) {
    return false;
  }
  return true;
});

usersSchema.static(
  "matchPasswordAndCreateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    console.log("->", user);
    if (!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedHash) {
      throw new Error("Incorrect Email or Password");
    }
    const token = createTokenForUser(user);
    return { user, token };
  }
);

module.exports = mongoose.model("Users", usersSchema);
