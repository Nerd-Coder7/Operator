import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import api from "src/api";
import { loadUser } from "src/redux/actions/user";
import { MessageList } from "src/sections/chat/MessageList";
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
  const { user, users: onlineUsers } = useSelector((state) => state.user);
  const [active, setActive] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();
  const [selectedImages, setSelectedImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const scrollRef = useRef(null);
  const location = useLocation();
  const conversationId = location.search.split("?")[1];
  const [elapsedTime, setElapsedTime] = useState("");
  const [previousMinute, setPreviousMinute] = useState(1);
console.log(user,"User")
  const handleEndChat = () => {
    dispatch(loadUser());
    sessionStorage.removeItem("timeStart")
    let operatorId = userData._id
    let userId = user?._id
    socketId.emit("endConversation", {
      operatorId,
      conversationId: conversationId,
      userId,
    });
    navigate("/all-operators");
    
  };

  useEffect(() => {
    const updateElapsedTime = async () => {
      const storedTimeStart = sessionStorage.getItem("timeStart");

      if (storedTimeStart && userData?._id && user?.role === "user") {
        const currentTime = Date.now();
        const timeStart = parseInt(storedTimeStart, 10);
        const timeDifference = currentTime - timeStart;

        const seconds = Math.floor((timeDifference / 1000) % 60);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);

        setElapsedTime(`${hours}h ${minutes}m ${seconds}s`);

        // Check if the minute has changed
        if (minutes !== previousMinute) {
          setPreviousMinute(minutes);

          // Call the API to update the data
          try {
            await api.put("/user/update-wallet", { operatorID: userData?._id });
            console.log("API updated successfully.");
          } catch (error) {
            console.error("Error updating API:", error);
          }
        }
      } else {
        if (user?.role.toLowerCase() === "user" && userData?._id) {
          navigate("/all-operators");
        }
      }
    };

    updateElapsedTime(); // Initial call to set the initial state

    let intervalId;
    if (userData?._id) intervalId = setInterval(updateElapsedTime, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [previousMinute, userData?._id]);

  useEffect(() => {
    if (socketId) {
      socketId.on("getMessage", (data) => {
        if (data.images) {
          const images = data.images.map((imageBuffer) => arrayBufferToBlobUrl(imageBuffer));
          setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            images: images,
            createdAt: Date.now(),
          });
        } else {
          setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          });
        }
      });
    }
  }, [socketId]);

  const handleMessageKey = (event) => {
    if (event.key === "Backspace" && newMessage === "") {
      setSelectedImages((prevImages) => prevImages.slice(0, -1));
    } else if (event.key === "Enter") {
      const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
      const phonePattern = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d\s.-]{7,13}/;

      // Check if the text field value contains an email or phone number
      if (emailPattern.test(newMessage) || phonePattern.test(newMessage)) {
        alert("Please do not share private contact information.");
        return;
      }
      sendMessage();
    } else {
      return;
    }
  };
  const arrayBufferToBlobUrl = (arrayBuffer, type = "image/jpeg") => {
    const blob = new Blob([arrayBuffer], { type });
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        let response = await api.get(`/chat/get-all-conversation/${user?._id}`, {
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
            const userResponse = await api.get(`/user/getuser/${userId}`);
            setUserData(userResponse.data.user);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [user,conversationId]);

  //  useEffect(() => {
  //   if (user) {
  //     const userId = user?._id;
  //     socketId.emit("addUser", userId);
  //     socketId.on("getUsers", (data) => {
  //       dispatch(updateOnlineUsers(data));
  //     });
  //   }
  // }, [user]);

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

  // const handleMessagekey = async (e) => {
  //   if (e.key !== "Enter") return;
  //   const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  //   const phonePattern = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d\s.-]{7,13}/;

  //   // Check if the text field value contains an email or phone number
  //   if (emailPattern.test(newMessage) || phonePattern.test(newMessage)) {
  //     alert("Please do not share private contact information.");
  //     return;
  //   }
  //   sendMessage();
  // };

  const handleMessage = async () => {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phonePattern = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d\s.-]{7,13}/;

    // Check if the text field value contains an email or phone number
    if (emailPattern.test(newMessage) || phonePattern.test(newMessage)) {
      alert("Please do not share private contact information.");
      return;
    }
    sendMessage();
  };

  const sendMessage = async () => {
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find((member) => member !== user?._id);

    socketId.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      images: selectedImages.length > 0 ? selectedImages : [],
      text: newMessage || "",
    });

    try {
      const formData = new FormData();
      formData.append("sender", user._id);
      formData.append("text", newMessage);
      formData.append("conversationId", currentChat._id);

      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      if (newMessage !== "" || selectedImages.length > 0) {
        await api
          .post(`/chat/create-new-message`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setMessages([...messages, res.data.message]);
            setNewMessage("");
            setSelectedImages([]);
            updateLastMessage(newMessage || "Photo");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async (lastMessage) => {
    socketId.emit("updateLastMessage", {
      lastMessage: lastMessage,
      lastMessageId: user._id,
    });
    await api
      .put(`/chat/update-last-message/${currentChat._id}`, {
        lastMessage: lastMessage,
        lastMessageId: user._id,
      })
      .then(() => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleImageRemove = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  const handleImageClick = (imageUrl) => {
    setZoomImage(imageUrl);
  };

  const handleCloseZoom = () => {
    setZoomImage(null);
  };

  const handleDownload = async (url) => {
    console.log("Downloading...");
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `aron-${url.split("/")[3]}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <div>
      <Helmet>
        <title>Chat Box</title>
      </Helmet>
      <Grid container component={Paper} style={chatSectionStyle}>
        {user?.role !== "user" && (
          <Grid item xs={3} style={borderRight500Style}>
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
          {user?.role === "admin" &&  <Grid item xs={12} style={{ padding: "10px" }}>
              <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
            </Grid>}
            <Divider />
            <List>
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
          <Grid item xs={user.role === "user" ? 12 : 9}>
            <List style={messageAreaStyle}>
              {messages &&
                messages.map((item, index) => (
                  <Grid
                    p={4}
                    justifyContent={item.sender === user?._id ? "flex-end" : "flex-start"}
                    container
                    key={index}
                    ref={scrollRef}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: item.sender === user?._id ? "flex-end" : "flex-start",
                      }}
                    >
                      {item.images &&
                        item.images.map((img, index) => (
                          <div key={index} style={{ position: "relative" }}>
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
                              onClick={() =>
                                handleImageClick(
                                  img.split(":")[0] === "blob"
                                    ? img
                                    : `${process.env.REACT_APP_API_URI}/${img}`
                                )
                              }
                            />
                            <DownloadIcon
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                cursor: "pointer",
                                color: "grey",
                              }}
                              onClick={() =>
                                handleDownload(
                                  img.split(":")[0] === "blob"
                                    ? img
                                    : `${process.env.REACT_APP_API_URI}/${img}`
                                )
                              }
                            />
                          </div>
                        ))}

                      {item.text !== "" && item.text && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexDirection: item.sender === user?._id ? "row-reverse" : "row",
                          }}
                        >
                          <Avatar
                            src={
                              item.sender === user?._id
                                ? `${process.env.REACT_APP_API_URI}/${user?.image}`
                                : `${process.env.REACT_APP_API_URI}/${userData?.image}`
                            }
                          />
                          <div
                            style={{
                              background:
                                item.sender === user?._id
                                  ? "rgb(18 183 106)"
                                  : "hsl(240deg 7% 62% / 30%)",
                              borderRadius:
                                item.sender === user?._id ? "1rem 1rem 0" : "1rem 1rem 1rem 0",
                              padding: "10px 20px",
                              width: item?.text?.length > 70 ? "300px" : "auto",
                            }}
                          >
                            <Grid
                              item
                              xs={12}
                              color={item.sender === user?._id ? "white" : "black"}
                              fontWeight={"bold"}
                            >
                              <ListItemText sx={{ fontSize: "100px" }} primary={item.text} />
                            </Grid>
                          </div>
                        </div>
                      )}
                    </div>
                  </Grid>
                ))}
            </List>
            <Divider />
            <Grid container style={{ padding: "20px", alignItems: "center" }}>
              <Grid item xs={11}>
                {/* <input
                  type="file"
                  accept=".jpeg,.png,.jpg,.webp"
                  onChange={handleImageSelect}
                  multiple
                  style={{ display: "none" }}
                  id="image-upload"
                /> */}
                {/* <label htmlFor="image-upload">
                  <Fab component="span" color="secondary">
                    <DownloadIcon />
                  </Fab>
                </label> */}
                {/* {selectedImages.length > 0 && (
                  <Grid
                    container
                    spacing={2}
                    style={{ padding: "20px", display: "flex", flexWrap: "wrap" }}
                  >
                    {selectedImages.map((image, index) => (
                      <Grid item key={index} style={{ position: "relative" }}>
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Selected ${index}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "10px",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          size="small"
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            backgroundColor: "white",
                            borderRadius: "50%",
                          }}
                          onClick={() => handleImageRemove(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    ))}
                  </Grid>
                )} */}
                <TextField
                  id="outlined-basic-email"
                  label="Type Something"
                  value={newMessage}
                  onKeyDown={handleMessageKey}
                  onChange={(e) => setNewMessage(e.target.value)}
                  fullWidth
                  style={{ marginTop: "10px", marginLeft: "10px" }}
                />
              </Grid>
              <Grid item xs={1} align="right">
                <Fab onClick={handleMessage} color="primary" aria-label="send">
                  <SendIcon />
                </Fab>
              </Grid>
            </Grid>
            <div>
              {elapsedTime && user?.role==="user" && (
                <div style={floatingTimerStyle}>
                  <p>Time since chat started: {elapsedTime}</p>
                  <Button onClick={handleEndChat} color="secondary">
                    End chat
                  </Button>
                </div>
              )}
            </div>
          </Grid>
        ) : (
          <Grid item xs={9} justifyContent={"center"}>
            <div>Select an Inbox</div>
          </Grid>
        )}
      </Grid>
      <Modal
        open={!!zoomImage}
        onClose={handleCloseZoom}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", background: "grey" }}>
          <img
            src={zoomImage}
            alt="Zoom"
            style={{ width: "600px", height: "600px", objectFit: "contain", margin: "auto" }}
          />
          <CloseIcon
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              cursor: "pointer",
              color: "white",
            }}
            onClick={handleCloseZoom}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Page;
