import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: mongoose.Schema.Types.ObjectId;
  applicants: mongoose.Schema.Types.ObjectId[];
  description: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  experienceNeeded: {
    min: string;
    max: string;
  };
  jobLocation: String;
  salary: {
    min: number;
    max: number;
  };
  isClosed: boolean;
  progress: mongoose.Schema.Types.ObjectId[];
}

const JobsSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
    jobLocation: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    experienceNeeded: {
      min: { type: String, required: true },
      max: { type: String, required: true },
    },
    salary: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    progress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job_progress",
        default: [],
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<IJob>("job", JobsSchema);
