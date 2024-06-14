import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { loadUser } from "src/redux/actions/user";
import api from "src/api";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

const Page = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // useEffect(() => {
  //   if (user.role === "admin") {
  //     navigate("/");
  //   } else if (user.role === "operator") {
  //     navigate("/chat");
  //   } else {
  //     navigate("/public-operators");
  //   }
  // }, []);

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    setLoading(true);

    try {
      const { data } = await api.post(`/user/login`, {
        email: values.email,
        password: values.password,
      });

      sessionStorage.setItem("authToken", true);
      navigate(data.redirect);
      dispatch(loadUser());
    } catch (err) {
      setErrors({ submit: "Login failed. Please check your credentials and try again." });
    } finally {
      setLoading(false);
      setSubmitting(false);
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
            Welcome back!
          </Typography>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Field
                    as={TextField}
                    label="Email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                  <Field
                    as={TextField}
                    label="Password"
                    name="password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                  {errors.submit && (
                    <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                      {errors.submit}
                    </Typography>
                  )}
                  <Box sx={{ mt: 4, position: "relative" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={isSubmitting || loading}
                      sx={{
                        py: 1.5,
                        fontSize: "1rem",
                        transition: "background-color 0.3s ease",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                    >
                      {loading ? <CircularProgress size={24} /> : "Login"}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Page;
