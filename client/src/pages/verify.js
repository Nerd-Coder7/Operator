import { Box, Typography, CircularProgress, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "src/api";

const Page = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (token) {
      const activationEmail = async () => {
        try {
          await api.get(`/user/activate?token=${token}`);
          navigate("/login");
        } catch (err) {
          setError(true);
        }
      };
      activationEmail();
    }
  }, [navigate, token]);
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        {error ? (
          <Typography variant="h6" color="error">
            Your token is expired
          </Typography>
        ) : (
          <Typography variant="h6">Loading...</Typography>
        )}
        {error && <CircularProgress />}
      </Box>
    </Container>
  );
};

export default Page;
