const mongoose = require("mongoose");
const doctorsSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Users",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    specialist: {
      type: String,
      required: [true, "Please add your speciality"],
    },
    experience: {
      type: String,
      required: [true, "Please add experiences in years"],
    },
    fees: {
      type: String,
      required: [true, "Please add Consulting fees"],
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    salt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctors", doctorsSchema);
