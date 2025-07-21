import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  dob: Date;
  phoneno: string;
  profile_image: String;
  resume_link: String;
  isBlocked: boolean;
  experinces: mongoose.Schema.Types.ObjectId[];
  education: mongoose.Schema.Types.ObjectId[];
  language: mongoose.Schema.Types.ObjectId[];
  skills: String[];
  applies: Number;
  searches: Number;
  state: String;
  company: mongoose.Schema.Types.ObjectId;
  role: mongoose.Schema.Types.ObjectId;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    phoneno: {
      type: String,
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
    state: {
      type: String,
    },
    applies: {
      type: Number,
      default: 0,
    },
    searches: {
      type: Number,
      default: 0,
    },
    experinces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "experince",
      },
    ],
    skills: [
      {
        type: String,
      },
    ],
    education: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "education_model",
      },
    ],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
    },
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
