import DownloadIcon from "@mui/icons-material/Download";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import api from "src/api";
import "./chat.css"
import { loadUser } from "src/redux/actions/user";
import { MessageList } from "src/sections/admin/MessageLists";
import { useSocket } from "src/utils/SocketContext";
// import socketIO from "socket.io-client";

// const ENDPOINT = "http://localhost:4800";
// const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const Page = () => {
  const chatSectionStyle = {
    width: "100%",
    height: "93vh",
  };
  const floatingTimerStyle = {
    position: "fixed",
    top: "120px",
    right: "20px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    padding: "10px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "5px",
    zIndex: 1000, // Ensures it stays above other elements
  };
  const borderRight500Style = {
    borderRight: "1px solid #e0e0e0",
  };

  const messageAreaStyle = {
    height: "80vh",
    overflowY: "auto",
  };

  const navigate = useNavigate();
  const socketId = useSocket(); 
  const [firstUser,setFirstUser]=useState({});
  const [secondUser,setSecondUser]=useState({});
  const { user, users: onlineUsers } = useSelector((state) => state.user);
  const [active, setActive] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);
  const location = useLocation();
  const conversationId = location.search.split("?")[1];



  useEffect(() => {
    const getConversation = async () => {
      try {
        let response = await api.get(`/user/get-all-admin-conversation/${user?._id}`, {
          withCredentials: true,
        });
        setConversations(response.data.conversations);
        if (conversationId) {
          const selectedConversation = response.data.conversations.find(
            (conv) => conv._id === conversationId
          );
          if (selectedConversation) {
            setCurrentChat(selectedConversation);
            setOpen(true);
            setActive(response.data.conversations.indexOf(selectedConversation));
            // Fetch user data for the selected conversation
            const userId = selectedConversation.members.find((member) => member !== user?._id);
            const userResponse = await api.get(`/user/getuser/${selectedConversation.members[0]}`);
            const user2Response = await api.get(`/user/getuser/${selectedConversation.members[1]}`);
            setUserData(userResponse.data.user);
            setSecondUser(user2Response.data.user)
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [user,conversationId]);



  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await api.get(`chat/get-all-messages/${currentChat?._id}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);





 
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <div>
      <Helmet>
        <title>Chat Box</title>
      </Helmet>
      <Grid container
component={Paper}
style={chatSectionStyle}>
        {user?.role !== "user" && (
          <Grid item
xs={3}
style={borderRight500Style}>
            <List>
              <ListItem button
key="RemySharp">
                <ListItemIcon>
                  <Avatar alt={user?.name}
src={`${process.env.REACT_APP_API_URI}/${user?.image}`} />
                </ListItemIcon>
                <ListItemText primary={user?.name} />
              </ListItem>
            </List>
            <Divider />
      
            <List style={{height:"82vh",overflowY:"auto"}}>
              {conversations &&
                socketId &&
                conversations.map((item, index) => (
                  <MessageList
                    data={item}
                    key={index}
                    index={index}
                    active={active}
                    setActive={setActive}
                    setOpen={setOpen}
                    setCurrentChat={setCurrentChat}
                    me={user?._id}
                    setUserData={setUserData}
                    userData={userData}
                    online={onlineCheck(item)}
                  />
                ))}
            </List>
          </Grid>
        )}
        {open ? (
          <Grid item
xs={user.role === "user" ? 12 : 9}>
            <List style={messageAreaStyle}>
              {messages &&
                messages.map((item, index) => (
                  <Grid
                    p={4}
                    justifyContent={item.sender === secondUser?._id ? "flex-end" : "flex-start"}
                    container
                    key={index}
                    ref={scrollRef}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: item.sender === secondUser?._id ? "flex-end" : "flex-start",
                      }}
                    >
                      {item.images &&
                        item.images.map((img, index) => (
                          <div key={index}
style={{ position: "relative" }}>
                            <img
                              src={
                                img.split(":")[0] === "blob"
                                  ? img
                                  : `${process.env.REACT_APP_API_URI}/${img}`
                              }
                              alt="Sent"
                              style={{
                                width: "300px",
                                height: "300px",
                                                objectFit: "cover",
                                borderRadius: "10px",
                                cursor: "pointer",
                                marginTop: "10px",
                                border: "1px solid grey",
                              }}
                              
                            />
                            <DownloadIcon
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                cursor: "pointer",
                                color: "grey",
                              }}
                            
                            />
                          </div>
                        ))}

                      {item.text !== "" && item.text && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexDirection: item.sender === secondUser?._id ? "row-reverse" : "row",
                          }}
                        >
                          <Avatar
                            src={
                              item.sender === secondUser?._id
                                ? `${process.env.REACT_APP_API_URI}/${secondUser?.image}`
                                : `${process.env.REACT_APP_API_URI}/${userData?.image}`
                            }
                          />
                          <div
                            style={{
                              background:
                                item.sender === secondUser?._id
                                  ? "rgb(18 183 106)"
                                  : "hsl(240deg 7% 62% / 30%)",
                              borderRadius:
                                item.sender === secondUser?._id ? "1rem 1rem 0" : "1rem 1rem 1rem 0",
                              padding: "10px 20px",
                              width: item?.text?.length > 70 ? "300px" : "auto",
                            }}
                          >
                            <Grid
                              item
                              xs={12}
                              color={item.sender === secondUser?._id ? "white" : "black"}
                              fontWeight={"bold"}
                            >
                              <ListItemText sx={{ fontSize: "100px" }}
primary={item.text} />
                            </Grid>
                          </div>
                        </div>
                      )}
                    </div>
                  </Grid>
                ))}
            </List>
            <Divider />
          </Grid>
        ) : (
          <Grid item
xs={9}
justifyContent={"center"}>
            <div>Select an Inbox</div>
          </Grid>
        )}
      </Grid>
    
    </div>
  );
};

export default Page;
