import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Container, TextField, Button, Box, Typography, CircularProgress, Paper } from "@mui/material";
import axios from "axios";
import api from "src/api";

const Page = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
const navigate = useNavigate()
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const { data } = await api.post("/user/change-password", { token, password });
      setMessage(data.message);
      navigate("/login")
    } catch (err) {
      setMessage(err.response.data.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          'url("https://images.unsplash.com/photo-1706273931417-8110e9fc33c9?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Change Password
          </Typography>
          {token ? (
            <Box sx={{ mt: 4 }}>
              <TextField
                label="New Password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              <TextField
                label="Confirm New Password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              {message && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {message}
                </Typography>
              )}
              <Box sx={{ mt: 4, position: "relative" }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleChangePassword}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Change Password"}
                </Button>
              </Box>
             <Link to={"/login"}><Typography mt={2} variant="body1" color="error" align="end">
              Go Back
            </Typography></Link> 
            </Box>
          ) : (
            <Typography variant="body1" color="error" align="center">
              Invalid or missing token.
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Page;
