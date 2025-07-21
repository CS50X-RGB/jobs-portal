import JobsRepo from "../database/repositories/jobsRepo";
import { Request, Response } from "express";

class JobsService {
  private jobsRepo: JobsRepo;
  constructor() {
    this.jobsRepo = new JobsRepo();
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
}
export default JobsService;
