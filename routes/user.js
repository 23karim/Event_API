import express from "express";
import { signup, signin } from "../controllers/user.js";
import upload from "../middlewares/multer-config.js"; 

const router = express.Router();
router.post("/signup", upload, signup);
router.post("/signin", signin);

export default router;