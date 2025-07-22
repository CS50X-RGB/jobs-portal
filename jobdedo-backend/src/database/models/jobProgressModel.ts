import mongoose, { Document, Schema } from "mongoose";

export enum JobProgressStatus {
  APPLIED = "applied",
  RESUME_VIEWED = "resume_viewed",
  INTERVIEW_ADDED = "interview_added",
  SHORTLISTED = "shortlisted",
  REJECTED = "rejected",
}

export interface IJobProgress extends Document {
  jobId: mongoose.Schema.Types.ObjectId;
  progress: JobProgressStatus;
  applyDate: Date;
  appliedBy: mongoose.Schema.Types.ObjectId;
  statusBy: mongoose.Schema.Types.ObjectId;
}

const jobProgressSchema = new Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },
    progress: {
      type: String,
      enum: Object.values(JobProgressStatus),
      require: true,
    },
    applyDate: {
      type: Date,
    },
    appliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    statusBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IJobProgress>("job_progress", jobProgressSchema);
