import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Avatar, Button, TextField, Grid, Paper, Stack } from "@mui/material";
import { Helmet } from "react-helmet-async";

const Page = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    image: "",
    wallet: {
      balance: 100,
    },
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  // Fetch user data from API (useEffect example)
  useEffect(() => {
    // Fetch user data from your API and set it to state
    // setUser(response.data);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Update user data with API call
    // axios.put('/api/user', formData).then(response => {
    //   setUser(response.data);
    //   setEditMode(false);
    // });
    setUser({ ...user, ...formData });
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
    });
    setEditMode(false);
  };

  return (
    <>
    <Helmet>
    <title>
      Orders 
    </title>
  </Helmet>
  <Box
    sx={{
      flexGrow: 1,
      py: 8
    }}
  >
    <Container maxWidth="xl">
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Typography variant="h4">
            Profile
          </Typography>
         
        </Stack>
    <Container component={Paper} sx={{ p: 3, mt: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar src={user.image} alt={user.name} sx={{ width: 56, height: 56, mr: 2 }} />
        <Typography variant="h5">Profile</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Wallet Balance"
            value={`${user.wallet.balance} minutes`}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          {editMode ? (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 1 }}>
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          ) : (
            <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          )}
        </Grid>
      </Grid>
    </Container>
    </Container>
    </Box></>
  );
};

export default Page;
