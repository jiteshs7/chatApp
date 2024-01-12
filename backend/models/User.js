const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");
const { USER_STATUS } = require("../shared/Constants");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: USER_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPass) {
  const result = await bcrypt.compare(enteredPass, this.password);
  return result;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) return next();

  const salt = await bcrypt.genSalt(10);
  const result = await bcrypt.hash(this.password, salt);
  this.password = result;
});

module.exports = mongoose.model("User", userSchema);
