import conversationModel from "../models/conversationModel.js";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import asyncHandler from "express-async-handler";

const userSendMessage = asyncHandler(async (req, res) => {
  const { userID, doctorID, message } = req.body;
  if (!userID || !doctorID || !message)
    return res
      .status(400)
      .json({ message: "Provide compltete data", success: false });
  const user = await userModel.findById(userID);
  if (!user)
    return res.status(400).json({ message: "No user found", success: false });
  const doctor = await doctorModel.findById(doctorID);
  if (!doctor)
    return res.status(400).json({ message: "No doctor found", success: false });

  const newMessage = new conversationModel({
    user: userID,
    doctor: doctorID,
    messages: {
      sender: "user",
      message: message,
    },
  });
  const result = await newMessage.save();
  if (result)
    return res.status(200).json({
      message: "Message sent successfully",
      data: result,
      success: true,
    });
});

const doctorSendMessage = asyncHandler(async (req, res) => {
  const { userID, doctorID, message } = req.body;
  if (!userID || !doctorID || !message)
    return res
      .status(400)
      .json({ message: "Provide compltete data", success: false });
  const user = await userModel.findById(userID);
  if (!user)
    return res.status(400).json({ message: "No user found", success: false });
  const doctor = await doctorModel.findById(doctorID);
  if (!doctor)
    return res.status(400).json({ message: "No doctor found", success: false });

  const newMessage = new conversationModel({
    user: userID,
    doctor: doctorID,
    messages: {
      sender: "doctor",
      message: message,
    },
  });
  const result = await newMessage.save();
  if (result)
    return res.status(200).json({
      message: "Message sent successfully",
      data: result,
      success: true,
    });
});

const getMessages = asyncHandler(async (req, res) => {
  const { userID, doctorID } = req.query;
  if (!userID || !doctorID)
    return res
      .status(400)
      .json({ message: "Provide compltete data", success: false });
  const user = await userModel.findById(userID);
  if (!user)
    return res.status(400).json({ message: "No user found", success: false });
  const doctor = await doctorModel.findById(doctorID);
  if (!doctor)
    return res.status(400).json({ message: "No doctor found", success: false });

  const messages = await conversationModel
    .find({
      user: userID,
      doctor: doctorID,
    })
    .sort({ timestamp: 1 });
  if (messages.length === 0)
    return res
      .status(200)
      .json({ message: "No messages found", success: true });
  return res.status(200).json({
    message: "Message sent successfully",
    data: messages,
    success: true,
  });
});

export { userSendMessage, doctorSendMessage, getMessages };
