import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
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
  email: "test.support@aron.com",
  name: "Test Jin",
  jobTitle: "Operator",
  // website:"A_Website",
  website: [],
  shortDiscription:"",
  submit: null,
};

const validationSchema = Yup.object({
  password: Yup.string().max(255).required("Password is required"),
  email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
  name: Yup.string().max(255).required("Name is required"),
  jobTitle: Yup.string().max(255).required("Job title is required"),
  website: Yup.array().min(1, "At least one website is required").required("Website is required"),
});



const Page = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const formik = useFormik({
    
    initialValues,
    validationSchema,

    onSubmit: async (values, helpers) => {
      console.log(values,"website----------")
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("shortDiscription", values.shortDiscription);
        values.website.forEach((item) => formData.append("website[]", item))
    //  formData.append("website", JSON.stringify(values.website));
  formData.append("role", values.jobTitle);
        formData.append("image", selectedImage);



        const response = await api.post("/user/register", formData,{
          headers:{
            "Content-Type":"multipart/form-data"
          }
        });
        if (response.status === 201) {
          helpers.setStatus({ success: true });

          helpers.setSubmitting(false);
          helpers.resetForm();
          alert('Operator created successfully')
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
        <title>Create Operator</title>
      </Helmet>
      <Box
        sx={{
          flexGrow: 1,
          py: 8,
          height: "100vh",
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Create Operator</Typography>
            </div>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Card sx={{ p: 3, width: "700px" }}>
                <Stack alignItems="center"
direction="row"
spacing={2}
sx={{ mb: 3 }}>
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
                      <Button color="primary"
size="small"
variant="outlined"
component="span">
                        Change
                      </Button>
                    </label>

                    <div>
                      <Typography color="text.secondary"
variant="caption">
                        Recommended dimensions: 200x200, maximum file size: 5MB
                      </Typography>
                    </div>
                  </div>
                </Stack>
                <form onSubmit={formik.handleSubmit}>
                  <Stack direction="row"
spacing={2}
sx={{ mb: 3 }}>
                    <div>
                      <Typography color="text.secondary"
variant="caption">
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
                        error={Boolean(formik.touched.jobTitle && formik.errors.jobTitle)}
                        fullWidth
                        helperText={formik.touched.jobTitle && formik.errors.jobTitle}
                        label="Job title"
                        name="jobTitle"
                        onBlur={formik.handleBlur}
                        disabled
                        onChange={formik.handleChange}
                        value={formik.values.jobTitle}
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
                         <TextField
                             multiline 
                        error={Boolean(formik.touched.password && formik.errors.password)}
                        fullWidth
                        helperText={formik.touched.password && formik.errors.password}
                        label="Short Discription"
                        name="shortDiscription"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.shortDiscription}
                      />
                       <FormControl
                              error={Boolean(formik.touched.website && formik.errors.website)}
                            >
                              <InputLabel>Website</InputLabel>
                              <Select
                                label="Website"
                                name="website"
                                value={formik.values.website}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                multiple
                              >
                                <MenuItem value="A_Website">A Website</MenuItem>
                                <MenuItem value="B_Website">B Website</MenuItem>
                                <MenuItem value="C_Website">C Website</MenuItem>
                              </Select>
                              {formik.touched.website && formik.errors.website && (
                                <FormHelperText>{formik.errors.website}</FormHelperText>
                              )}
                            </FormControl>

                    </Stack>
                    {formik.errors.submit && (
                      <FormHelperText error
sx={{ mt: 3 }}>
                        {formik.errors.submit}
                      </FormHelperText>
                    )}
                    <Box sx={{ mt: 3 }}>
                      <Button color="primary"
size="large"
type="submit"
variant="contained">
                        Add operator
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
