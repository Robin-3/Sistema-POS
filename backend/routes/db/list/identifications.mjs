import express from "express";
import { ENV } from "../../../config.mjs";
import { listRepository } from "../../../repository/listRepository.mjs";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const identifications = listRepository.identifications();
    res.send(identifications);
  } catch (error) {
    if (ENV === "development") console.error(error);
    res.status(500).send("Error getting users");
  }
});

export default router;
