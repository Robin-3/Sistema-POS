import express from "express";
import listRouter from "./db/list.mjs";
import usersRouter from "./db/users.mjs";

const router = express.Router();

router.use("/list", listRouter);
router.use("/users", usersRouter);

export default router;
