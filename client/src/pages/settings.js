import { Helmet } from "react-helmet-async";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  FormHelperText,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "src/api";
import { loadUser, updateOnlineUsers } from "src/redux/actions/user";
import { useSocket } from "src/utils/SocketContext";

const initialValuesTemplate = {
  password: "",
  email: "",
  name: "",
  role: "",
  status: "",
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
  name: Yup.string().max(255).required("Name is required"),
  role: Yup.string().max(255).required("Job title is required"),
  status: Yup.string().max(255).required("Status is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters"),
});

const Page = () => {
  const { user } = useSelector((state) => state.user);
  const [selectedImage, setSelectedImage] = useState(null);
  const [initialValues, setInitialValues] = useState(initialValuesTemplate);
  const dispatch = useDispatch();
  const socket = useSocket();

  useEffect(() => {
    if (user) {
      setInitialValues({
        password: "",
        email: user.email || "",
        name: user.name || "",
        role: user.role || "",
        status: user.loggedIn || "",
        submit: null,
      });
    }
  }, [user]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("password", values.password);
        formData.append("loggedIn", values.status);
        formData.append("image", selectedImage);

        selectedImage && formData.append("oldImage", user?.image);

        const response = await api.put("/user/update-user", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
          if (values.status !== "Online") {
            socket.disconnect();
            dispatch(updateOnlineUsers([]));
          } else {
            socket.connect();
          }
          helpers.setStatus({ success: true });
          dispatch(loadUser());
          helpers.setSubmitting(false);
          helpers.resetForm();
        } else {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: "Something went wrong!" });
          helpers.setSubmitting(false);
        }
      } catch (error) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: error?.response?.data?.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      setSelectedImage(image);
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Typography variant="h4">Settings</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Account</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3 }}>
                  {user ? (
                    <form onSubmit={formik.handleSubmit}>
                      <Stack spacing={3}>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          justifyContent={"space-between"}
                        >
                          <Box display={"flex"} alignItems={"center"} gap={"15px"}>
                            <Avatar
                              src={
                                selectedImage
                                  ? URL.createObjectURL(selectedImage)
                                  : `${process.env.REACT_APP_API_URI}/${user?.image}`
                              }
                              sx={{ height: 64, width: 64 }}
                            />
                            <div>
                              <input
                                accept="image/*"
                                style={{ display: "none" }}
                                id="raised-button-file"
                                type="file"
                                onChange={handleImageChange}
                              />
                              <label htmlFor="raised-button-file">
                                <Button
                                  color="primary"
                                  size="small"
                                  variant="outlined"
                                  component="span"
                                >
                                  Change
                                </Button>
                              </label>
                            </div>
                          </Box>
                          {user?.role === "operator" && (
                            <FormControl
                              error={Boolean(formik.touched.status && formik.errors.status)}
                            >
                              <InputLabel>Status</InputLabel>
                              <Select
                                label="Status"
                                name="status"
                                value={formik.values.status}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                              >
                                <MenuItem value="Online">Active</MenuItem>
                                <MenuItem value="Offline">Inactive</MenuItem>
                                <MenuItem value="Break">Break</MenuItem>
                                <MenuItem value="Busy">Busy</MenuItem>
                              </Select>
                              {formik.touched.status && formik.errors.status && (
                                <FormHelperText>{formik.errors.status}</FormHelperText>
                              )}
                            </FormControl>
                          )}
                        </Stack>
                        <TextField
                          error={Boolean(formik.touched.name && formik.errors.name)}
                          fullWidth
                          helperText={formik.touched.name && formik.errors.name}
                          label="Name"
                          name="name"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.name}
                        />
                        <TextField
                          error={Boolean(formik.touched.email && formik.errors.email)}
                          fullWidth
                          helperText={formik.touched.email && formik.errors.email}
                          label="Email address"
                          name="email"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="email"
                          disabled
                          value={formik.values.email}
                        />
                        <TextField
                          error={Boolean(formik.touched.role && formik.errors.role)}
                          fullWidth
                          helperText={formik.touched.role && formik.errors.role}
                          label="Role"
                          name="role"
                          disabled
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.role}
                        />
                        <TextField
                          error={Boolean(formik.touched.password && formik.errors.password)}
                          fullWidth
                          helperText={formik.touched.password && formik.errors.password}
                          label="Password"
                          name="password"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.password}
                        />
                        {formik.errors.submit && (
                          <FormHelperText error>{formik.errors.submit}</FormHelperText>
                        )}
                        <Button color="primary" size="large" type="submit" variant="outlined">
                          Save settings
                        </Button>
                      </Stack>
                    </form>
                  ) : (
                    <Typography variant="body1">Loading user data...</Typography>
                  )}
                </Card>
              </Grid>
              {user?.role === "user" && (
                <>
                  {" "}
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6">Wallet Details</Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                      {user ? (
                        <Stack spacing={3}>
                          <Typography variant="body1">
                            <strong>Balance:</strong> ${user?.userData?.wallet.toFixed(2) || 0}
                          </Typography>
                          {/* <Button
                            variant="outlined"
                            color="warning"
                            onClick={() => {
                              window.location.href = "/transaction-history";
                            }}
                          >
                            View Transaction History
                          </Button> */}
                        </Stack>
                      ) : (
                        <Typography variant="body1">Loading wallet details...</Typography>
                      )}
                    </Card>
                  </Grid>
                </>
              )}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
