import express from "express";
import testRouter from "./users/test.mjs";

const router = express.Router();

router.use("/test", testRouter);

export default router;
