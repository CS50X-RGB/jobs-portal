import Job from "../models/jobsModel";
import User from "../models/userModel";
import Company from "../models/companyModel";
import JobProgress, { JobProgressStatus } from "../models/jobProgressModel";
import InterviewRepo from "./interviewRepo";

class JobsRepo {
  private interviewRepo: InterviewRepo;
  constructor() {
    this.interviewRepo = new InterviewRepo();
  }
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
      if (item.company) {
        const newCompany = await Company.findByIdAndUpdate(
          item.company,
          {
            $push: {
              jobs: createNewJob._id,
            },
          },
          { new: true },
        );
      }
      return createNewJob.toObject();
    } catch (error: any) {
      throw new Error(`Error for creating job ${error}`);
    }
  }
  public async applyOnJob(userId: any, jobId: any) {
    try {
      const job = await Job.findById(jobId);
      if (!job) {
        throw new Error("Job not found");
      }
      if (job.applicants.includes(userId)) {
        throw new Error("User already applied to this job");
      }
      const jobProgress = {
        jobId: jobId,
        statusBy: userId,
        appliedBy: userId,
        applyDate: new Date(),
        progress: JobProgressStatus.APPLIED,
      };
      const jobProgressModal = await JobProgress.create(jobProgress);
      const jobModal = await Job.findByIdAndUpdate(
        jobId,
        {
          $push: {
            applicants: userId,
            progress: jobProgressModal.toObject()._id,
          },
        },
        {
          new: true,
        },
      );

      const user = await User.findByIdAndUpdate(
        userId,
        {
          $inc: {
            applies: 1,
          },
        },
        {
          new: true,
        },
      );

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
        .populate("createdBy company applicants progress")
        .lean();

      if (!jobEntity || !Array.isArray(jobEntity.progress)) {
        return {
          ...jobEntity,
          progress: [],
        };
      }

      const enrichedProgress = await Promise.all(
        jobEntity.progress.map(async (p: any) => {
          if (p.progress === "interview_added") {
            const interviews =
              await this.interviewRepo.getInterviewsByUserIdJobId(
                p.appliedBy,
                jobId,
              );

            return {
              ...p,
              interviews,
            };
          }

          return p;
        }),
      );

      return {
        ...jobEntity,
        progress: enrichedProgress,
      };
    } catch (error: any) {
      throw new Error(`Error while getting job by id: ${error.message}`);
    }
  }

  public async getJobByIdApplicants(jobId: any) {
    try {
      const jobEntity = await Job.findById(jobId)
        .populate([
          {
            path: "applicants",
            select: "-password -role",
            populate: [
              {
                path: "experinces",
              },
              {
                path: "education",
              },
              {
                path: "language",
              },
            ],
          },
        ])
        .select("applicants")
        .lean();

      return jobEntity;
    } catch (error: any) {
      throw new Error(`Error while getting job by id: ${error.message}`);
    }
  }
  public async getJobsAppliedByUser(userId: any) {
    try {
      const getJobsObject = await Job.find({
        applicants: { $in: [userId] },
      }).populate("company progress applicants");
      return getJobsObject;
    } catch (error) {
      throw new Error(`Error while getting applied jobs`);
    }
  }
  public async updateJobProgress(
    userId: any,
    jobId: any,
    status: any,
    appliedBy: any,
  ) {
    try {
      const item = {
        jobId,
        progress: status,
        statusBy: userId,
        applyDate: new Date(),
        appliedBy,
      };

      const newJobProgress = await JobProgress.create(item);
      const updateJob = await Job.findByIdAndUpdate(
        jobId,
        {
          $push: {
            progress: newJobProgress.toObject()._id,
          },
        },
        {
          new: true,
        },
      );
      return updateJob;
    } catch (error: any) {
      throw new Error(`Error while updating resume`);
    }
  }
  public async getProgressUpdatesByJobId(jobId: any, userId: any) {
    try {
      const jobsProgressModels = await JobProgress.find({
        jobId,
        appliedBy: userId,
      }).populate([
        {
          path: "jobId",
          populate: [
            {
              path: "company",
            },
          ],
        },
      ]);
      return jobsProgressModels;
    } catch (error: any) {
      throw new Error(`Error while getting progress Updates`);
    }
  }
}

export default JobsRepo;
