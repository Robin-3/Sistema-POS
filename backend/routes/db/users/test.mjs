import express from "express";
import { testRepository } from "../../../repository/testRepository.mjs";
import { ENV } from "../../../config.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { count } = req.body;
  try {
    const data = await testRepository.users({ count });
    res.send(data);
  } catch (error) {
    if (ENV === "development") console.error(error);
    res.status(400).send("Failed to register");
  }
});

export default router;
