import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadOperators } from "src/redux/actions/admin";
// import socketIO from "socket.io-client";
import OperatorModal from "src/sections/operators/operator-modal";
import { useSocket } from "src/utils/SocketContext";

// const ENDPOINT = "http://localhost:4800";
// const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const Page = () => {
  const state = useSelector((state) => state.admin);
  const [operators, setOperators] = useState(state.operators);
  const { user, users: onlineUsers } = useSelector((state) => state.user);
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  console.log(operators, "dsfdsf", onlineUsers);
  const [prevOnlineUsers, setPrevOnlineUsers] = useState([]);
  // useEffect(() => {
  //   if (user) {
  //     const userId = user?._id;
  //     socketId.emit("addUser", userId);
  //     socketId.on("getUsers", (data) => {
  //       setOnlineUsers(data);
  //       setLoading(false);
  //     });
  //   } else {
  //     setLoading(false);
  //   }
  // }, [user]);
  useEffect(()=>{
    const hasNewOperator = (newUsers, prevUsers) => {
      const newOperators = newUsers.filter(user => user.type === 'operator');
      const prevOperators = prevUsers.filter(user => user.type === 'operator');
      
      if (newOperators.length > prevOperators.length) {
        return true;
      }

      // Optionally, you can do a more sophisticated comparison here
      // e.g., checking if there are any new operator IDs in newUsers
      
      return newOperators.some(newOp => 
        !prevOperators.some(prevOp => prevOp.id === newOp.id)
      );
    };

    if (hasNewOperator(onlineUsers, prevOnlineUsers)) {
      dispatch(loadOperators());
    }

    // Update the previous online users state
    setPrevOnlineUsers(onlineUsers);
  }, [onlineUsers, dispatch]);

  const onlineCheck = (chat) => {
    const online = onlineUsers.find((user) => user.userId === chat._id);
    return online ? true : false;
  };

  useEffect(() => {
    setOperators(state.operators);
  }, [state.operators]);

  const handleCardClick = (operator) => {
    setSelectedOperator(operator);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOperator(null);
  };

  const renderOperators = () => {
    const onlineOperators = operators.filter(
      (operator) => onlineCheck(operator) && operator.loggedIn === "Online"
    );

    const onlineBusyOperators = operators.filter(
      (operator) => onlineCheck(operator) && operator.loggedIn === "Busy"
    );

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      );
    }

    if (onlineOperators.length === 0 && onlineBusyOperators.length === 0) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <Typography variant="h6" color="error">
            No operators online for now.
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={2} sx={{ padding: 2 }}>
        {onlineOperators.map((operator) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={operator._id}>
            <Card onClick={() => handleCardClick(operator)}>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar
                      src={`${process.env.REACT_APP_API_URI}/${operator.image}`}
                      alt={operator.name}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6">{operator.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {operator.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {operator.role}
                    </Typography>
                  </Grid>
                  <Grid item>
                    {onlineCheck(operator) && operator.loggedIn === "Online" ? (
                      <div
                        style={{
                          width: "13px",
                          height: "13px",
                          borderRadius: "50%",
                          background: "green",
                        }}
                      ></div>
                    ) : operator.loggedIn === "Break" ? (
                      <div
                        style={{
                          width: "13px",
                          height: "13px",
                          borderRadius: "50%",
                          background: "purple",
                        }}
                      ></div>
                    ) : (
                      <div
                        style={{
                          width: "13px",
                          height: "13px",
                          borderRadius: "50%",
                          background: "red",
                        }}
                      ></div>
                    )}
                  </Grid>
                </Grid>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  {operator?.operatorData?.pricingPerMinute || 0}$/min
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="xl">
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Typography variant="h4">Operators</Typography>
        </Stack>
        {renderOperators()}
      </Container>
      {selectedOperator && (
        <OperatorModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          operator={selectedOperator}
          user={user}
        />
      )}
    </Box>
  );
};

export default Page;
