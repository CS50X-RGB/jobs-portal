import { JobProgressStatus } from "../database/models/jobProgressModel";
import JobsRepo from "../database/repositories/jobsRepo";
import InterviewRepo from "../database/repositories/interviewRepo";
import { Request, Response } from "express";

class JobsService {
  private jobsRepo: JobsRepo;
  private interviewRepo: InterviewRepo;
  constructor() {
    this.jobsRepo = new JobsRepo();
    this.interviewRepo = new InterviewRepo();
  }
  public async createJob(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.sendError(
          `Error while creating job`,
          "Error while creating job",
          400,
        );
      }
      const { data }: any = req.body;
      const { _id, ...other }: any = req.user;
      const createJob = await this.jobsRepo.createJob(_id, data);
      return res.sendFormatted(createJob, "Created Job Sucessfully", 200);
    } catch (error: any) {
      return res.sendError(
        `Error while creating job`,
        "Creating Job error",
        400,
      );
    }
  }

  public async getJobs(req: Request, res: Response) {
    try {
      const { page, offset }: any = req.params;
      const getJobsOject = await this.jobsRepo.getJobs(page, offset);
      return res.sendArrayFormatted(getJobsOject, "Jobs Object Fetched", 200);
    } catch (error: any) {
      return res.sendError(
        `Error while getting job objects`,
        "Jobs Object fetching error",
        400,
      );
    }
  }

  public async applyJob(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.sendError(
          `Error while creating job`,
          "Error while creating job",
          400,
        );
      }
      const { _id, ...other }: any = req.user;
      const { jobId }: any = req.params;
      const updateJob = await this.jobsRepo.applyOnJob(_id, jobId);
      return res.sendFormatted(updateJob, "Job Applied", 200);
    } catch (error: any) {
      return res.sendError(`Error while applying for job`);
    }
  }

  public async getJobSingle(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const jobEntity = await this.jobsRepo.getJobById(jobId);
      return res.sendFormatted(jobEntity, "Entity for job fetched", 200);
    } catch (error: any) {
      return res.sendError(
        `Erorr while getting single job`,
        "Error while getting job",
        400,
      );
    }
  }
  public async getJobApplicants(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const jobEntity = await this.jobsRepo.getJobByIdApplicants(jobId);
      return res.sendFormatted(jobEntity, "Entity for job fetched", 200);
    } catch (error: any) {
      return res.sendError(
        `Erorr while getting single job`,
        "Error while getting job",
        400,
      );
    }
  }

  public async getAppliedJobsByUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.sendError("Not logged in", "Not logged in", 400);
      }
      const { _id, ...other } = req.user;
      const appliedJob = await this.jobsRepo.getJobsAppliedByUser(_id);
      return res.sendArrayFormatted(appliedJob, "Jobs Fetched", 200);
    } catch (error: any) {
      return res.sendError(
        "Error while applying to job",
        "Error while applying to job",
        400,
      );
    }
  }

  public async updateStatusResumeViewed(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.sendError("User Not logged in", "UserNot Logged in", 400);
      }
      const { _id, ...other }: any = req.user;
      const { jobId } = req.params;
      const { userId } = req.body;
      const jobsResume = await this.jobsRepo.updateJobProgress(
        _id,
        jobId,
        JobProgressStatus.RESUME_VIEWED,
        userId,
      );
      return res.sendFormatted(jobsResume, "Job Progress Updated", 200);
    } catch (error: any) {
      return res.sendError(
        "Error while updating",
        "Errror while updating",
        400,
      );
    }
  }

  public async getProgressUpdatesByJobById(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.sendError("User not logged in", "User not logged in", 400);
      }
      const { _id, ...other } = req.user;
      const { jobId } = req.params;
      console.log(jobId, "jobId");
      const jobsProgressUpdates = await this.jobsRepo.getProgressUpdatesByJobId(
        jobId,
        _id,
      );
      return res.sendArrayFormatted(
        jobsProgressUpdates,
        "Job Progress Update Fetched",
        200,
      );
    } catch (error: any) {
      return res.sendError(
        "Error while getting progress updating",
        "Error while fetching job progress Updates",
        400,
      );
    }
  }

  public async rejectCandidate(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.sendError("User not logged in", "User not logged in", 400);
      }
      const { _id, ...other } = req.user;
      const { jobId }: any = req.params;
      const { data } = req.body;
      const jobsResume = await this.jobsRepo.updateJobProgress(
        _id,
        jobId,
        JobProgressStatus.REJECTED,
        data.userId,
      );
      return res.sendFormatted(jobsResume, "Jobs Progress Update", 200);
    } catch (error: any) {
      return res.sendError(
        `Error while updating rejecting candidate`,
        "Rejecting Candidate",
        400,
      );
    }
  }

  public async createInterview(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.sendError(`User not logged in`, "User not logged in", 400);
      }
      const { _id, ...other }: any = req.user;
      const { job }: any = req.params;
      const { data } = req.body;
      console.log(data);
      const jobsResume = await this.jobsRepo.updateJobProgress(
        _id,
        job,
        JobProgressStatus.INTERVIEW_ADDED,
        data.userId,
      );

      const jobsInterview = await this.interviewRepo.createInterview(
        data,
        _id,
        job,
      );

      return res.sendFormatted(jobsInterview, "Interview Added", 200);
    } catch (error) {
      return res.sendError(
        `Error while creating interview`,
        `Error while creating interview`,
        400,
      );
    }
  }

  public async getInterviewsByUserId(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.sendError(
          `Error while getting interviews`,
          "Error while getting interviwes",
          400,
        );
      }
      const { _id, ...other } = req.user;
      const interviews = await this.interviewRepo.getInterviewsByUserId(_id);
      return res.sendArrayFormatted(interviews, `User got the interviews`, 200);
    } catch (error: any) {
      return res.sendError(
        `Error while getting interviews`,
        "Error while getting interviews",
        400,
      );
    }
  }
}
export default JobsService;
