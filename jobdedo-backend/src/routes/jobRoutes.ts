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

router.get(
  "/get/applicants/employeer/:jobId",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.getJobApplicants.bind(jobsService),
);

router.get(
  "/applied/jobs",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.getAppliedJobsByUser.bind(jobsService),
);

router.put(
  "/resume/apply/:jobId",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.updateStatusResumeViewed.bind(jobsService),
);

router.get(
  "/progress/:jobId",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.getProgressUpdatesByJobById.bind(jobsService),
);

router.post(
  "/create/interview/:job",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.createInterview.bind(jobsService),
);

router.put(
  "/reject/candidate/:jobId",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.rejectCandidate.bind(jobsService),
);

router.get(
  "/fetch/interviews",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.getInterviewsByUserId.bind(jobsService),
);

router.post(
  "/create/invite/:job_id",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.createInvite.bind(jobsService),
);

router.get(
  "/invites/count",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.getInviteCount.bind(jobsService),
);

router.get(
  "/invites/get",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.getInvitesByUsers.bind(jobsService),
);

router.put(
  "/put/invites/:inviteId",
  userMiddleware.verify.bind(userMiddleware),
  jobsService.updateInviteById.bind(jobsService),
);
export default router;
