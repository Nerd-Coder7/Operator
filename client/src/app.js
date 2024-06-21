import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import "simplebar-react/dist/simplebar.min.css";
import api from "./api";
import { loadUser, updateOnlineUsers } from "./redux/actions/user";
import { routes } from "./routes";
import NotificationModal from "./sections/chat/NotificationModal";
import { createTheme } from "./theme";
import { useSocket } from "./utils/SocketContext";
// import socketIO from "socket.io-client";

// const ENDPOINT = "http://localhost:4800";
// const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });
export const App = () => {
  const { user, users: onlineUsers } = useSelector((state) => state.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const socket = useSocket();
  const socketId = useSocket(); 
  const element = useRoutes(routes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = createTheme({
    colorPreset: "green",
    contrast: "high",
  });
const location = useLocation();




useEffect(()=>{
  const params = new URLSearchParams(location.search);
  const websiteParam = params.get('website');
 

if(websiteParam){
  sessionStorage.setItem("websiteID",websiteParam)
}
},[location?.search])

  useEffect(() => {
    if (user && socket && user.loggedIn === "Online") {
      console.log("New notification available");

      socket.on("notifyNewConversation", ({ conversationId, userId }) => {
        setMessage("You have a new conversation request from user");
        setConversationId(conversationId);
        setUserId(userId);
        setModalOpen(true);
        
      });

      socket.on("notifyEndConversation", ({ conversationId, userId }) => {
    
        setMessage("User has ended conversation");
      
        setConversationId(null);
        setUserId(userId);
        setModalOpen(true);
      });

      // Cleanup the event listener on component unmount
      return () => {
        socket.off("notifyNewConversation");
        socket.off("notifyEndConversation");
      };
    }
  }, [socket, user]);

  useEffect(() => {
    if (user && socket && user.loggedIn === "Online") {
      const userId = user._id;
      socket.emit("addUser", userId, user?.role);
      socket.on("getUsers", (data) => {
        dispatch(updateOnlineUsers(data));
      });

      // Cleanup on component unmount
      return () => {
        socket.off("getUsers");
      };
    }
  }, [user, socket, dispatch]);

  const handleClose = async() => {
    if (conversationId) {
      socketId.emit("acceptConversation", {
        operatorId:userId,
        conversationId,
      });
   await api.put("/user/update-user", {loggedIn:"Busy"});
   socket.emit('status-change', { userId: user._id, status: 'Busy' });
      navigate(`/chat?${conversationId}`);
    } else {
   await api.put("/user/update-user", {loggedIn:"Online"});
   socket.emit('status-change', { userId: user._id, status: 'Online' });
      navigate("/settings");
    }
    setModalOpen(false);
  };


  const handleReject= async ()=>{
    let userID = user?._id
    let operatorId=userId;
    socketId.emit("rejectConversation", {
      operatorId,
      conversationId,
      userId:userID,
    });
  setModalOpen(false);
  }
  // useEffect(() => {
  //   if (user) {
  //     const userId = user?._id;
  //     socketId.emit("addUser", userId);
  //     socketId.on("getUsers", (data) => {
  //       dispatch(updateOnlineUsers(data));
  //     });
  //   }
  // }, [user]);

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <GoogleTranslate/> */}
      <NotificationModal
        open={modalOpen}
        handleClose={handleClose}
        handleReject={handleReject}
        conversationId={conversationId}
        userId={userId}
        message={message}
        
      />
      {element}
    </ThemeProvider>
  );
};
