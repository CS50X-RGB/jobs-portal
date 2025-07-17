import mongoose, { Document, Schema } from "mongoose";

export enum EducationTypeEnum {
  HIGH_SCHOOL = "high_school",
  BACHELORS = "bachelors",
  MASTERS = "masters",
  PHD = "phd",
  DIPLOMA = "diploma",
  OTHER = "other",
}

export interface IEducationModel extends Document {
  type: EducationTypeEnum;
  schoolName: String;
  startDate: Date;
  endDate: Date;
  result: String;
}

const EducationModel = new Schema<IEducationModel>({
  type: {
    type: String,
    enum: Object.values(EducationTypeEnum),
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  result: {
    type: String,
  },
  endDate: {
    type: Date,
  },
});

export default mongoose.model<IEducationModel>(
  "education_model",
  EducationModel,
);
