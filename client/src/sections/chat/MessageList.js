import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "src/api";
export const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  active,
  setActive,
}) => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/chat?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    const userId = data.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await api.get(`/user/getuser/${userId}`);

        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  return (
    <div style={{ background: active === index ? "rgb(123 209 158 / 44%)" : "" }}>
      <ListItem
        button
        key={index}
        onClick={(e) =>
          setActive(index) || handleClick(data._id) || setCurrentChat(data) || setUserData(user)
        }
      >
        <ListItemIcon>
          <Avatar
            alt={user?.name}
            src={`${process.env.REACT_APP_API_URI}/${user?.image}` || "https://mui.com/static/images/avatar/1.jpg"}
          />
        </ListItemIcon>
        <ListItemText primary={user?.name} />

        {online ? (
          <div
            style={{ width: "13px", height: "13px", borderRadius: "50%", background: "green" }}
          ></div>
        ) : (
          <div
            style={{ width: "13px", height: "13px", borderRadius: "50%", background: "red" }}
          ></div>
        )}
      </ListItem>
      {/* <div style={{textAlign:"",marginRight:"10px"}}>
      {data?.lastMessageId !== user?._id
            ? "You:"
            : user?.name.split(" ")[0] + ": "}{" "}
          {data?.lastMessage}
        </div> */}
    </div>
  );
};
