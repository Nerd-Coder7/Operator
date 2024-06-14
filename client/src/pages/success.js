import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Box, Typography, Button, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import api from "src/api";
import { loadUser } from "src/redux/actions/user";
import { useDispatch } from "react-redux";

const Page = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [url, setUrl] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get("/payment/success" + location.search);
        if (res.data.success) {
          setSuccess(true);
          setUrl(res.data.url);
        }
      } catch (error) {
        console.error("Error fetching payment success data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [location.search]);

  const handleOk = () => {
    dispatch(loadUser());
    sessionStorage.setItem('timeStart',Date.now())
    navigate(url);
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        textAlign="center"
      >
        {success ? (
          <>
            <CheckCircleOutlineIcon color="success" style={{ fontSize: 80 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Your payment has been processed successfully.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOk}>
              OK
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Payment Failed
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Unfortunately, your payment could not be processed. Please try again.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOk}>
              Go Home
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Page;
