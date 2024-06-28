import { app } from "./app.mjs";
import connectDB from "./config/db.mjs";
import dotenv from "dotenv";
import { createServer } from "http";
import setupWebSocket from "./socket.mjs";
dotenv.config();

const httpServer = createServer(app);
const io = setupWebSocket(httpServer);

let users = [];

const addUser = (userId, socketId,type) => {
  const userIndex = users.findIndex((user) => user.userId === userId);
  if (userIndex !== -1) {
    // Update the existing user's socket ID
    users[userIndex].socketId = socketId;
  } else {
    // Add the new user
    users.push({ userId, socketId, type });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

// Define a message object with a seen property
const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

io.on("connection", (socket) => {
  // when connect
  console.log(`A user is connected`,socket.id,users);

  // take userId and socketId from user
  socket.on("addUser", (userId,type) => {
    addUser(userId, socket.id, type);
    io.emit("getUsers", users);
  });



  socket.on('status-change', (data) => {
    io.emit('status-change', data);
  });
  // send and get message
  const messages = {}; // Object to track messages sent to each user


  socket.on("newConversation", ({ operatorId, conversationId, userId }) => {
    const operator = getUser(operatorId);
    console.log(operator,operatorId)
    if (operator) {
      io.to(operator.socketId).emit("notifyNewConversation", {
        conversationId,
        userId,
      });
    }
  });

  
  socket.on("endConversation", ({ operatorId, conversationId, userId }) => {
    const operator = getUser(operatorId);
 
    if (operator) {
      io.to(operator.socketId).emit("notifyEndConversation", {
        conversationId,
        userId,
      });
    }
  });
  
  socket.on("rejectConversation", ({ operatorId, conversationId, userId }) => {
    const operator = getUser(operatorId);
    console.log(operator,operatorId)
    if (operator) {
      io.to(operator.socketId).emit("notifyRejectConversation", {
     
        conversationId,
        userId,
      });
      
    }
  });

  socket.on("acceptConversation", ({ operatorId, conversationId }) => {
    console.log("bheja kya apne operator",operatorId)

    const operator = getUser(operatorId);
    if (operator) {
      console.log("bheja kya apne operator")
      io.to(operator.socketId).emit("notifyAcceptConversation", {
        conversationId
      });
    }
  });

  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const message = createMessage({ senderId, receiverId, text, images });

    const user = getUser(receiverId);

    // Store the messages in the `messages` object
    if (!messages[receiverId]) {
      messages[receiverId] = [message];
    } else {
      messages[receiverId].push(message);
    }

   

    // send the message to the receiver
    io.to(user?.socketId).emit("getMessage", message);
  });

  socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
    const user = getUser(senderId);

    // update the seen flag for the message
    if (messages[senderId]) {
      const message = messages[senderId].find(
        (message) =>
          message.receiverId === receiverId && message.id === messageId
      );
      if (message) {
        message.seen = true;

        // send a message seen event to the sender
        io.to(user?.socketId).emit("messageSeen", {
          senderId,
          receiverId,
          messageId,
        });
      }
    }
  });

  // update and get last message
  socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }) => {
    io.emit("getLastMessage", {
      lastMessage,
      lastMessagesId,
    });
  });

  // when disconnect
  socket.on("disconnect-user", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
  // when disconnect
  socket.on("disconnect", () => {
    console.log(`A user disconnected!`);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

httpServer.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is listening on http://localhost:${process.env.PORT}`);
});
