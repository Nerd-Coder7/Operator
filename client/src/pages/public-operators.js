import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadOperators } from "src/redux/actions/admin";
import OperatorModal from "src/sections/operators/operator-modal";
import { useSocket } from "src/utils/SocketContext";

const Page = () => {
  const websiteID = sessionStorage.getItem("websiteID");
  const state = useSelector((state) => state.admin);
  const [operators, setOperators] = useState(state.operators);
  const { user, users: onlineUsers } = useSelector((state) => state.user);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const socketId = useSocket();
  const [status, setStatus] = useState({});
  const [prevOnlineUsers, setPrevOnlineUsers] = useState([]);
const navigate=useNavigate()
  useEffect(() => {
    const handleStatusChange = ({ userId, status }) => {
      setStatus({ userId, status });
    };

    if (socketId) {
      socketId.on("status-change", handleStatusChange);

      return () => {
        socketId.off("status-change", handleStatusChange);
      };
    }
  }, [socketId]);

  useEffect(() => {
    const hasNewOperator = (newUsers, prevUsers) => {
      const newOperators = newUsers.filter((user) => user.type === "operator");
      const prevOperators = prevUsers.filter((user) => user.type === "operator");

      if (newOperators.length > prevOperators.length) {
        return true;
      }

      return newOperators.some((newOp) =>
        !prevOperators.some((prevOp) => prevOp.id === newOp.id)
      );
    };

    if (hasNewOperator(onlineUsers, prevOnlineUsers) || status) {
      dispatch(loadOperators());
    }

    setPrevOnlineUsers(onlineUsers);
  }, [onlineUsers, dispatch, status]);

  const onlineCheck = (chat) => {
    const online = onlineUsers.find((user) => user.userId === chat._id);
    return online ? true : false;
  };

  useEffect(() => {
    setOperators(state.operators);
  }, [state.operators]);

  const handleCardClick = (operator) => {
    if(!user?._id){
     alert("Please login first")
     navigate("/login")
        return
    }
    if(operator.loggedIn==="Busy") return alert("Operator is having chat right now")
    setSelectedOperator(operator);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOperator(null);
  };

  const renderOperators = () => {
    const onlineOperators = operators.filter(
      (operator) =>
        onlineCheck(operator) &&
        operator.loggedIn === "Online" ||  operator.loggedIn === "Busy" &&
        operator?.operatorData?.website?.some((el) => el === websiteID)
    );
    const toShowOpertors = user?._id ? onlineOperators : operators;
console.log(toShowOpertors)
    // const onlineBusyOperators = operators.filter(
    //   (operator) => onlineCheck(operator) && operator.loggedIn === "Busy"
    // );

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      );
    }

    if (toShowOpertors.length === 0 ) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <Typography variant="h6" color="error">
            Nessun operatore online per ora.
          </Typography>
        </Box>
      );
    }
    return (
      <Grid container spacing={3} sx={{ padding: 3 }}>
        {toShowOpertors.map((operator) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={operator._id}>
            <Card
              onClick={() => handleCardClick(operator)}
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
                borderRadius: 2,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar
                      src={`${process.env.REACT_APP_API_URI}/${operator.image}`}
                      alt={operator.name}
                      sx={{ width: 56, height: 56 }}
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
                    { operator.loggedIn === "Online" ? (
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
                    
                    ) : operator.loggedIn === "Busy" ? (
                      <div
                        style={{
                          width: "13px",
                          height: "13px",
                          borderRadius: "50%",
                          background: "orange",
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
                  {operator?.operatorData?.pricingPerMinute || 0}€/min
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" variant="contained">
                  Crea Chat
                </Button>
              </CardActions>
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
          <Typography variant="h4">OPERATORI</Typography>
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
