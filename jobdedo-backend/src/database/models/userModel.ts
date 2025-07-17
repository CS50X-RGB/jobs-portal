import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  dob: Date;
  profile_image: String;
  resume_link: String;
  isBlocked: boolean;
  experinces: mongoose.Schema.Types.ObjectId[];
  education: mongoose.Schema.Types.ObjectId[];
  language: mongoose.Schema.Types.ObjectId[];
  role: mongoose.Schema.Types.ObjectId;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    dob: {
      type: Date,
    },
    profile_image: {
      type: String,
    },
    resume_link: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      unique: true,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    experinces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "experince",
      },
    ],
    education: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "education_model",
      },
    ],
    language: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "languages",
      },
    ],
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser>("user", UserSchema);
