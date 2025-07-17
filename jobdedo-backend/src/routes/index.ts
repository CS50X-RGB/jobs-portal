import { Router } from 'express';
import roleRouter from "./roleRoute"
import userRouter from "./userRoute"

const router = Router();
const version = "v1";
const webRoute = "web";
export const prefix = `/${version}/${webRoute}`;

router.use(`${prefix}/role`, roleRouter);
router.use(`${prefix}/user`, userRouter);

export default router;
