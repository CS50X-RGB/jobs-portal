import mongoose, { Document, Schema } from "mongoose";

export enum LevelsEnum {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  EXPERT = "expert",
}

export interface ILanguageModel extends Document {
  name: string;
  levels: LevelsEnum;
}

const LangSchema = new Schema<ILanguageModel>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  levels: {
    type: String,
    enum: Object.values(LevelsEnum),
    required: true,
  },
});

export default mongoose.model<ILanguageModel>("languages", LangSchema);
