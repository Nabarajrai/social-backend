import express from "express";
import {
  getRelationships,
  addRelationships,
  deleteRelationships,
} from "../controller/relationships.js";

const router = express.Router();

router.get("/relationships", getRelationships);
router.post("/addRelationship", addRelationships);
router.delete("/deleteRelationship", deleteRelationships);

export default router;
