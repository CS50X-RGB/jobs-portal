import InterviewModel from "../models/interviewModel";
import User from "../models/userModel";
import mongoose from "mongoose";

class InterviewRepo {
  constructor() {}
  public async createInterview(interviewData: any, userId: any, jobId: any) {
    try {
      const user: any = await User.findOne({ _id: userId });
      if (!user.company) {
        throw new Error(`Error while getting user object`);
      }
      // const { data }: any = interviewData;
      let update = {
        ...interviewData,
        createdBy: userId,
        companyId: user.company,
        jobId,
      };
      // console.log(data, "data");
      const interview = await InterviewModel.create(update);
      return interview.toObject();
    } catch (error: any) {
      console.log(error, "error");
      throw new Error(`Error while creating interview`);
    }
  }
  public async getInterviewsByUserId(userId: any) {
    try {
      const interviews = await InterviewModel.find({
        attendies: {
          $in: [new mongoose.Types.ObjectId(userId)],
        },
      })
        .populate("jobId companyId")
        .lean();
      return interviews;
    } catch (error: any) {
      throw new Error(`Error while getting interviews by user`);
    }
  }
  public async getInterviewsByCompanyId(companyId: any) {
    try {
      const interviews = await InterviewModel.find({
        companyId: companyId,
      }).lean();
      return interviews;
    } catch (error: any) {
      throw new Error(`Error while getting interviews by user`);
    }
  }
  public async getInterviewsByUserIdJobId(userId: any, jobId: any) {
    try {
      const interviews = await InterviewModel.find({
        jobId,
        attendies: {
          $in: [new mongoose.Types.ObjectId(userId)],
        },
      })
        .populate("jobId companyId attendies")
        .lean();
      return interviews;
    } catch (error: any) {
      throw new Error(`Error while getting interviews by user`);
    }
  }
}

export default InterviewRepo;
