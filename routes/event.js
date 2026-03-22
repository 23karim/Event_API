import express from "express";
import { addEvent, deleteAllEvents, deleteEvent, getAllEvents, getEventById } from "../controllers/event.js";
import { auth, isAdmin, isClient } from "../middlewares/auth.js"; 
import upload from "../middlewares/multer-config.js"; 

const router = express.Router();

router.post("/add", auth, isAdmin, upload, addEvent);
router.delete("/delete/:id", auth, isAdmin, deleteEvent);
router.delete("/delete-all", auth, isAdmin, deleteAllEvents);
router.get("/all", getAllEvents);
router.get("/:id", getEventById);

export default router;