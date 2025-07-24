import mongoose, { Document, Schema } from "mongoose";

export interface IInterviewModel extends Document {
  interviewDate: Date;
  startTime: Date;
  endTime: Date;
  createdBy: mongoose.Schema.Types.ObjectId;
  companyId: mongoose.Schema.Types.ObjectId;
  jobId: mongoose.Schema.Types.ObjectId;
  attendies: mongoose.Schema.Types.ObjectId[];
}

const interviewSchema = new Schema<IInterviewModel>(
  {
    interviewDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "job",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    attendies: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IInterviewModel>("Interview", interviewSchema);
