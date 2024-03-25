import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";
import asyncHandler from "express-async-handler";
import notificationModel from "../models/notificationModel.js";

const createAppointment = asyncHandler(async (req, res) => {
  const { userID, doctorID, timing } = req.body;
  if (!userID || !doctorID || !timing)
    return res
      .status(400)
      .json({ message: "Provide complete data", success: false });
  const user = await userModel.findById(userID);
  if (!user)
    return res
      .status(400)
      .json({ message: "No such user found.", success: false });
  const doctor = await doctorModel.findById(doctorID);
  if (!doctor)
    return res
      .status(400)
      .json({ message: "No such doctor found.", success: false });

  const appointment = new appointmentModel({
    user: userID,
    doctor: doctorID,
    day: timing,
  });
  const result = await appointment.save();
  if (result)
    return res.status(200).json({
      message: "Appointment saved successfully",
      data: result,
      success: true,
    });
});

const getAppointmentDetails = asyncHandler(async (req, res) => {
  const { appointmentID } = req.body;
  if (!appointmentID)
    return res
      .status(400)
      .json({ message: "Provide complete data", success: false });
  const appointment = await appointmentModel.findById(appointmentID).populate([
    { path: "user", select: "name" },
    { path: "doctor", select: "name phone specialization fees" },
  ]);
  if (!appointment)
    return res
      .status(400)
      .json({ message: "No such appointment found", success: false });
  return res.status(200).json({
    message: "Appointment details sent successfully",
    data: appointment,
    success: true,
  });
});

const deleteAppointment = asyncHandler(async (req, res) => {
  const { appointmentID } = req.body;
  if (!appointmentID)
    return res
      .status(400)
      .json({ message: "Provide complete data", success: false });
  const appointment = await appointmentModel.findById(appointmentID);
  if (!appointment)
    return res
      .status(400)
      .json({ message: "No appointment found", success: false });
  const resp = await appointmentModel.findByIdAndDelete(appointmentID);
  if (resp)
    return res
      .status(200)
      .json({ message: "Appointment deleted successfully", success: true });
});

const updateAppointment = asyncHandler(async (req, res) => {
  const { appointmentID, timing } = req.body;
  if (!appointmentID || !timing)
    return res
      .status(400)
      .json({ message: "Provide complete data", success: false });
  const appointment = await appointmentModel.findById(appointmentID);
  if (!appointment)
    return res
      .status(400)
      .json({ message: "No appointment found", success: false });
  const result = await appointmentModel.findByIdAndUpdate(
    appointmentID,
    { day: timing, status: "Pending" },
    { new: true }
  );
  if (result) {
    const notification = new notificationModel({
      user: appointment.user,
      appointment: appointmentID,
      message: "Your one of the appointment is Updated.",
    });
    await notification.save();
    return res
      .status(200)
      .json({ message: "Appointment updated successfully", success: true });
  }
});

const getAppointmentByDoctor = asyncHandler(async (req, res) => {
  const doctorID = req.params.doctorID;
  if (!doctorID)
    return res
      .status(400)
      .json({ message: "Provide complete data", success: false });
  const appointments = await appointmentModel
    .find({ doctor: doctorID })
    .populate([{ path: "user", select: "name phone email" }]);
  if (appointments.length === 0)
    return res
      .status(400)
      .json({ message: "No appointment found", success: false });
  return res.status(200).json({
    message: "Appointments sent successfully",
    data: appointments,
    success: true,
  });
});

const getAppointmentByUser = asyncHandler(async (req, res) => {
  const userID = req.params.userID;
  if (!userID) {
    return res
      .status(400)
      .json({ message: "Provide complete data jjj", success: false });
  }
  const appointments = await appointmentModel.find({ user: userID }).populate([
    {
      path: "doctor",
      select:
        "name phone specialization experience fees availableTimings.day1 availableTimings.day2 availableTimings.time1 availableTimings.time2",
    },
  ]);
  console.log(appointments);
  if (appointments.length === 0)
    return res
      .status(200)
      .json({ message: "No appointment found", success: false });
  return res.status(200).json({
    message: "Appointments sent successfully",
    data: appointments,
    success: true,
  });
});

const appointmentApproval = asyncHandler(async (req, res) => {
  const { doctorID, appointmentID } = req.body;
  if (!doctorID || !appointmentID)
    return res
      .status(400)
      .json({ message: "Provide complete data", success: false });
  const appointment = await appointmentModel.findById(appointmentID);
  console.log(appointment);
  if (appointment.doctor != doctorID)
    return res.status(400).json({ message: "Not allowed", success: false });
  const result = await appointmentModel.findByIdAndUpdate(
    appointmentID,
    {
      status: "Confirmed",
    },
    { new: true }
  );
  if (result) {
    const notification = new notificationModel({
      user: appointment.user,
      appointment: appointmentID,
      message: "Your one of the appointment is Confirmed.",
    });
    await notification.save();
    return res.status(200).json({
      message: "Appointment approved successfully",
      data: result,
      success: true,
    });
  }
});

const appointmentCancel = asyncHandler(async (req, res) => {
  const { doctorID, appointmentID } = req.body;
  if (!doctorID || !appointmentID)
    return res
      .status(400)
      .json({ message: "Provide complete data", success: false });
  const appointment = await appointmentModel.findById(appointmentID);
  console.log(appointment);
  if (appointment.doctor != doctorID)
    return res.status(400).json({ message: "Not allowed", success: false });
  const result = await appointmentModel.findByIdAndUpdate(
    appointmentID,
    {
      status: "Cancelled",
    },
    { new: true }
  );

  if (result) {
    const notification = new notificationModel({
      user: appointment.user,
      appointment: appointmentID,
      message: "Your one of the appointment is cancelled.",
    });
    await notification.save();
    return res.status(200).json({
      message: "Appointment cancelled successfully",
      data: result,
      success: true,
    });
  }
});

const appointmentComplete = asyncHandler(async (req, res) => {
  const { doctorID, appointmentID } = req.body;
  if (!doctorID || !appointmentID)
    return res
      .status(400)
      .json({ message: "Provide complete data", success: false });
  const appointment = await appointmentModel.findById(appointmentID);
  // console.log(appointment);
  if (appointment.doctor != doctorID)
    return res.status(400).json({ message: "Not allowed", success: false });
  const result = await appointmentModel.findByIdAndUpdate(
    appointmentID,
    {
      status: "Completed",
    },
    { new: true }
  );
  if (result) {
    const notification = new notificationModel({
      user: appointment.user,
      appointment: appointmentID,
      message: "Your one of the appointment is completed.",
    });
    await notification.save();
    return res.status(200).json({
      message: "Appointment cancelled successfully",
      data: result,
      success: true,
    });
  }
});

const getUniqueAppointmentByUser = asyncHandler(async (req, res) => {
  const userID = req.params.userID;
  if (!userID) {
    return res
      .status(400)
      .json({ message: "Provide complete data jjj", success: false });
  }

  const appointments = await appointmentModel.find({ user: userID }).populate([
    {
      path: "doctor",
      select:
        "name phone specialization experience fees availableTimings.day1 availableTimings.day2 availableTimings.time1 availableTimings.time2",
    },
  ]);

  const uniqueDoctorIDs = [
    ...new Set(appointments.map((appointment) => appointment.doctor._id)),
  ];
  const uniqueAppointments = appointments.filter((appointment) =>
    uniqueDoctorIDs.includes(appointment.doctor._id)
  );

  console.log(uniqueAppointments);

  if (uniqueAppointments.length === 0)
    return res
      .status(200)
      .json({ message: "No appointment found", success: false });
  return res.status(200).json({
    message: "Appointments sent successfully",
    data: uniqueAppointments,
    success: true,
  });
});

export {
  createAppointment,
  getAppointmentDetails,
  deleteAppointment,
  updateAppointment,
  getAppointmentByDoctor,
  appointmentApproval,
  appointmentCancel,
  appointmentComplete,
  getAppointmentByUser,
  getUniqueAppointmentByUser,
};
