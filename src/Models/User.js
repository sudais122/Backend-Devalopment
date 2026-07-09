import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const Userschema = new Schema(
  {
    usename: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      require: true,
    },
    coverimage: {
      type: String,
    },
    watchhistory: [
      {
        type: Schema.Types.ObjectID,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      require: true,
    },
    refreshtoken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

Userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password, 10);
  next();
});

Userschema.methods.ispasswordcorrect = async function (password) {
  return await bcrypt.compare(password, this.password);

};
export const User = mongoose.model("User", Userschema);
