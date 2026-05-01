import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bilibiliRouter from "./bilibili";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/bilibili", bilibiliRouter);

export default router;
