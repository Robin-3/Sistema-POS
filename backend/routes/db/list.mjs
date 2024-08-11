import express from "express";
import { ENV } from "../../config.mjs";
import { listRepository } from "../../repository/listRepository.mjs";
import identificationsRouter from "./list/identifications.mjs";
import defaultDataRouter from "./list/defaultData.mjs";

const router = express.Router();

router.delete("/", (req, res) => {
  try {
    listRepository.removeAll();
    res.send("OK");
  } catch (error) {
    if (ENV === "development") console.error(error);
    res.status(400).send("Failed to register");
  }
});

router.use("/identifications", identificationsRouter);
router.use("/default-data", defaultDataRouter);

export default router;
