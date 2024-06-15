import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { routes } from "./routes";
import { createTheme } from "./theme";
import "simplebar-react/dist/simplebar.min.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadOperators } from "./redux/actions/admin";
import { loadUser, updateOnlineUsers } from "./redux/actions/user";
import { SocketProvider, useSocket } from "./utils/SocketContext";
import NotificationModal from "./sections/chat/NotificationModal";
import api from "./api";
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
   await api.put("/user/update-user", {loggedIn:"Busy"});
   socket.emit('status-change', { userId: user._id, status: 'Busy' });
      navigate(`/chat?${conversationId}`);
    } else {
   await api.put("/user/update-user", {loggedIn:"Online"});
   socket.emit('status-change', { userId: user._id, status: 'Online' });
      window.location.replace("/chat");
    }
    setModalOpen(false);
  };

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
      <NotificationModal
        open={modalOpen}
        handleClose={handleClose}
        conversationId={conversationId}
        userId={userId}
        message={message}
      />
      {element}
    </ThemeProvider>
  );
};
