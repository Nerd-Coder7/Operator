// routes/sessionRouter.js
import express from "express";
import ChatSession from "../models/chatSession.model.mjs";
import isAuthenticated, { isAdmin } from "../middlewares/auth.mjs";

export const sessionRouter = express.Router();

// POST API to create a conversation record
sessionRouter.post("/", async (req, res) => {
  try {
    const { sender, reciever, minutes } = req.body;
    const newConversation = new ChatSession({ sender, reciever, minutes });
    await newConversation.save();
    res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET API to get total minutes of a user by day, week, month, and total
sessionRouter.get("/:user",isAuthenticated,  async (req, res) => {
  const { user } = req.params;
  const currentDate = new Date();
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
  const startOfMonth = new Date(currentDate.setDate(1));
console.log(user,"USER")

const findTHat = await ChatSession.find({reciever:user});

  try {
    const totalMinutes = await ChatSession.aggregate([
      {
        $match: {
            reciever: user 
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$minutes" },
          day: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", startOfDay] },
                "$minutes",
                0,
              ],
            },
          },
          week: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", startOfWeek] },
                "$minutes",
                0,
              ],
            },
          },
          month: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", startOfMonth] },
                "$minutes",
                0,
              ],
            },
          },
        },
      },
    ]);
    console.log(totalMinutes)
    res.json(totalMinutes[0] || { total: 0, day: 0, week: 0, month: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

sessionRouter.get("/admin/get-all-chat-sessions", isAuthenticated, isAdmin, async (req, res) => {
    const currentDate = new Date();
    
    // Start of day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    // Start of week
    const startOfWeek = new Date();
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Start of month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
    try {
      const allMinutes = await ChatSession.aggregate([
        {
          $group: {
            _id: {
              receiver: "$reciever"
            },
            total: { $sum: "$minutes" },
            day: {
              $sum: {
                $cond: [
                  { $gte: ["$createdAt", startOfDay] },
                  "$minutes",
                  0,
                ],
              },
            },
            week: {
              $sum: {
                $cond: [
                  { $gte: ["$createdAt", startOfWeek] },
                  "$minutes",
                  0,
                ],
              },
            },
            month: {
              $sum: {
                $cond: [
                  { $gte: ["$createdAt", startOfMonth] },
                  "$minutes",
                  0,
                ],
              },
            },
          },
        }
      ]);
      
      res.json(allMinutes);
    } catch (error) {
      console.error(error, "ERROR");
      res.status(500).json({ error: error.message });
    }
  });
  
  
  
  



export default sessionRouter;
