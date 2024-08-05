import express from "express";
import { ENV } from "../../config.mjs";
import { ListRepository } from "../../repository/ListRepository.mjs";

const router = express.Router();

router.get("/identifications", (req, res) => {
  try {
    const identifications = ListRepository.Identifications();
    res.send(identifications);
  } catch (error) {
    if (ENV === "development") console.error(error);
    res.status(500).send("Error getting users");
  }
});

export default router;
