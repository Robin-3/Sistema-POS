import express from "express";
import listRouter from "./db/list.mjs";

const router = express.Router();

router.use("/list", listRouter);

export default router;
