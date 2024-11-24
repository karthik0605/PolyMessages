import express from "express";
import {
  sendMessage,
  getMessages,
  updateMessage,
} from "../controllers/messageControllers.js";

const router = express.Router();

// curl -X POST http://localhost:5001/api/message/send -H "Content-Type: application/json"
// -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzMzOWNkYTFiMTNkNWYxMmNiNmM2NTQiLCJpYXQiOjE3MzE1MjYxMjMsImV4cCI6MTczMTUyOTcyM30.eNUo65jswR1XtAob80Zqwl-ai06GsktLDCearXUM32I"
// -d '{ "contents": "Hello Again World!", "channelId": "XXXXXXXXXXXXXX", "userId": "XXXXXXXXXXXXXX"}'
router.post("/send", sendMessage);

// curl -X POST http://localhost:5001/api/message/send
// -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzMzOWNkYTFiMTNkNWYxMmNiNmM2NTQiLCJpYXQiOjE3MzE1MjYxMjMsImV4cCI6MTczMTUyOTcyM30.eNUo65jswR1XtAob80Zqwl-ai06GsktLDCearXUM32I"
// -d '{ "contents": "Hello Again World!", "messageId": "XXXXXXXXXXXXXX"}'
router.put("/update", updateMessage);

//curl -X GET http://localhost:5001/api/message/XXXXXXXXXX
// -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzMzOWNkYTFiMTNkNWYxMmNiNmM2NTQiLCJpYXQiOjE3MzE1MjYxMjMsImV4cCI6MTczMTUyOTcyM30.eNUo65jswR1XtAob80Zqwl-ai06GsktLDCearXUM32I"
router.get("/:channelId", getMessages);

export default router;
