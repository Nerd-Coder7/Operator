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
  } from "@mui/material";
  import { useFormik } from "formik";
  import { useState } from "react";
  import { Helmet } from "react-helmet-async";
  import api from "src/api";
  import * as Yup from "yup";
  
  const initialValues = {
    password: "",
    email: "test@gmail.com",
    name: "Test",
    submit: null,
  };
  
  const validationSchema = Yup.object({
    password: Yup.string().max(255).required("Password is required"),
    email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
    name: Yup.string().max(255).required("Name is required"),
  });
  
  const Page = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
  
    const formik = useFormik({
      initialValues,
      validationSchema,
      onSubmit: async (values, helpers) => {
        try {
          const formData = new FormData();
          formData.append("name", values.name);
          formData.append("email", values.email);
          formData.append("password", values.password);
          formData.append("role", "user");
          formData.append("image", selectedImage);
  
          const response = await api.post("/user/register", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log(response);
          if (response.status === 201) {
            helpers.setStatus({ success: true });
  
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
        setPreviewImage(URL.createObjectURL(image));
      }
    };
    return (
      <>
        <Helmet>
          <title>Register Account</title>
        </Helmet>
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
          <Container maxWidth="xl">
            <Stack spacing={3}>
         
  
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card sx={{ p: 3, width: "700px" }}>
                <div>
                <Typography mb={3} variant="h4">Register your Account</Typography>
              </div>
                  <Stack alignItems="center" direction="row" spacing={2} sx={{ mb: 3 }}>
                    <Avatar
                      src={previewImage || "/assets/avatars/avatar-chen-simmons.jpg"}
                      sx={{
                        height: 64,
                        width: 64,
                      }}
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
                        <Button color="primary" size="small" variant="outlined" component="span">
                          Change
                        </Button>
                      </label>
  
                      <div>
                        <Typography color="text.secondary" variant="caption">
                          Recommended dimensions: 200x200, maximum file size: 5MB
                        </Typography>
                      </div>
                    </div>
                  </Stack>
                  <form onSubmit={formik.handleSubmit}>
                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                      <div>
                        <Typography color="text.secondary" variant="caption">
                          Add the account name and password to create the operator
                        </Typography>
                      </div>
                    </Stack>
                    <Box>
                      <Stack spacing={3}>
                        <TextField
                          error={Boolean(formik.touched.name && formik.errors.name)}
                          fullWidth
                          helperText={formik.touched.name && formik.errors.name}
                          label="Full Name"
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
                          value={formik.values.email}
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
                      </Stack>
                      {formik.errors.submit && (
                        <FormHelperText error sx={{ mt: 3 }}>
                          {formik.errors.submit}
                        </FormHelperText>
                      )}
                      <Box sx={{ mt: 3 }}>
                        <Button color="primary" size="large" type="submit" variant="contained">
                          Register
                        </Button>
                      </Box>
                    </Box>
                  </form>
                </Card>
              </Box>
            </Stack>
          </Container>
        </Box>
      </>
    );
  };
  
  export default Page;
  