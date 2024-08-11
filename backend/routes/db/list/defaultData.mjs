import express from "express";
import { listRepository } from "../../../repository/listRepository.mjs";
import { ENV } from "../../../config.mjs";

const router = express.Router();

router.post("/", (req, res) => {
  try {
    listRepository.initializeDefaultData();
    res.send("OK");
  } catch (error) {
    if (ENV === "development") console.error(error);
    res.status(400).send("Failed to register");
  }
});

export default router;
