import Job from "../models/jobsModel";
import User from "../models/userModel";

class JobsRepo {
  constructor() {}
  public async createJob(userId: any, data: any) {
    try {
      const userModal: any = await User.findById(userId);
      let item: any = {
        ...data,
        createdBy: userId,
      };
      if (userModal.company) {
        item.company = userModal.company;
      }
      const createNewJob = await Job.create(item);
      return createNewJob.toObject();
    } catch (error: any) {
      console.log(error, "error");
      throw new Error(`Error for creating job ${error}`);
    }
  }
  public async applyOnJob(userId: any, jobId: any) {
    try {
      // Optional: Check if already applied
      const job = await Job.findById(jobId);
      if (!job) {
        throw new Error("Job not found");
      }
      // if (job.applicants.includes(userId)) {
      //   throw new Error("User already applied to this job");
      // }
      const jobModal = await Job.findByIdAndUpdate(
        jobId,
        {
          $push: {
            applicants: userId,
          },
        },
        {
          new: true,
        },
      );

      await User.findByIdAndUpdate(userId, {
        $inc: {
          applies: 1,
        },
      });

      return jobModal;
    } catch (error: any) {
      throw new Error(`Error while applying on job: ${error.message}`);
    }
  }
  public async getJobs(page: any, offset: any) {
    try {
      const allJobs: any = await Job.find()
        .populate("company applicants")
        .skip((page - 1) * 10)
        .limit(offset);
      return allJobs;
    } catch (error: any) {
      throw new Error(`Error while getting jobs`);
    }
  }
  public async getJobById(jobId: any) {
    try {
      const jobEntity = await Job.findById(jobId)
        .populate("createdBy company")
        .lean();

      return jobEntity;
    } catch (error: any) {
      throw new Error(`Error while getting job by id: ${error.message}`);
    }
  }
}

export default JobsRepo;
