import express from "express";
import {
  createAppointment,
  getAppointmentDetails,
  deleteAppointment,
  updateAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAppointmentDetails);
router.delete("/", deleteAppointment);
router.put("/", updateAppointment);

export default router;
