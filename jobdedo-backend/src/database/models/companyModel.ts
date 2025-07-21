import mongoose, { Document, Schema } from "mongoose";

export enum Level {
  STARTUP = "0-10",
  INTERMEDIATE = "10-50",
  MIDLEVEL = "50-500",
  BIGLEVEL = "500+",
}

export interface ICompanyInterface extends Document {
  name: string;
  description: string;
  level: Level;
  foundationDate: Date;
  jobs: mongoose.Schema.Types.ObjectId[];
  logo: String;
  categories: String[];
  users: mongoose.Schema.Types.ObjectId[];
}

const CompanySchema = new Schema<ICompanyInterface>({
  name: {
    type: String,
    required: true,
  },
  foundationDate: {
    type: Date,
  },
  description: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: Object.values(Level),
    required: true,
  },
  logo: {
    type: String,
  },
  categories: [
    {
      type: String,
    },
  ],
  jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

export default mongoose.model<ICompanyInterface>("company", CompanySchema);
