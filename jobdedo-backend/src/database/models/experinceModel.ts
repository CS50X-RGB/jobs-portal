import mongoose, { Document, Schema } from "mongoose";

export interface IExperinceModel extends Document {
  postion: string;
  description: string;
  startDate: Date;
  endDate: Date;
  companyName: String;
}

const ExperinceSchema = new Schema<IExperinceModel>({
  postion: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  companyName: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IExperinceModel>("experince", ExperinceSchema);
