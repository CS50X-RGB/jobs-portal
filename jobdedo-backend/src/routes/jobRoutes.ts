import { Router } from "express";
import UserMiddleware from "../middleware/userMiddleware";
import JobsService from "../services/jobsService";

const router = Router();
const userMiddleware = new UserMiddleware();
const jobsService = new JobsService();

router.post(
  "/create",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.createJob.bind(jobsService),
);

router.get("/get/:page/:offset", jobsService.getJobs.bind(jobsService));

router.put(
  "/apply/:jobId",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.applyJob.bind(jobsService),
);

router.get(
  "/jobs/get/:jobId",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.getJobSingle.bind(jobsService),
);
export default router;
