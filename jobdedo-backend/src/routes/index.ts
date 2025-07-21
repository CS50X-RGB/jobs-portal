import { Router } from "express";
import roleRouter from "./roleRoute";
import userRouter from "./userRoute";
import jobsRouter from "./jobRoutes";

const router = Router();
const version = "v1";
const webRoute = "web";
export const prefix = `/${version}/${webRoute}`;

router.use(`${prefix}/role`, roleRouter);
router.use(`${prefix}/user`, userRouter);
router.use(`${prefix}/jobs`, jobsRouter);
export default router;
