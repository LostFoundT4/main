import React, { useState , useEffect} from "react";
import AppDrawer from "./AppDrawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import AxiosInstance from "../axios/axiosInstance";
import {
  Typography,
  TextField,
  Button,
  Container,
  Box,
  Avatar,
} from "@mui/material";

function EditProfile() {
  // State variables to store user profile information
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(""); // You can use a URL or a file object

  useEffect(() => {
    AxiosInstance.get("/api/auth/get-user",{
      headers: {
        "Authorization": "Token " + localStorage.getItem("authToken")
      }
    }).then((response) => {
      setUsername(response.data.username)
      setEmail(response.data.email)
    })
  })

  // Function to handle profile picture changes
  function handleProfilePictureChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      // Use FileReader to read the selected image and set it as the profile picture
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string | null;

        if (imageDataUrl) {
          setProfilePicture(imageDataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Send the updated profile information to the server or update states.
    // Right now it's just logging the values to the console.
    console.log("Updated Profile Information:");
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Telegram Handle:", telegramHandle);
    console.log("Phone Number:", phoneNumber);
    console.log("Profile Picture:", profilePicture);
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppDrawer />
        <Box
          component="main"
          sx={{
            bgColor: "#28b280",
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 4,
                  }}
                  className="edit-profile-container"
                >
                  <Avatar
                    sx={{ width: 100, height: 100 }}
                    src={profilePicture}
                    alt="Profile"
                  />
                  <Typography variant="h5" mt={2}>
                    EDIT PROFILE
                  </Typography>
                  <form onSubmit={handleSubmit} className="edit-profile-form">
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      className="edit-profile-button"
                      sx={{ mt: 2 }}
                      onClick={() => {
                        const profilePictureInput = document.getElementById(
                          "profilePictureInput"
                        );
                        if (profilePictureInput) {
                          profilePictureInput.click();
                        }
                      }}
                    >
                      Choose Profile Picture
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      id="profilePictureInput"
                      style={{ display: "none" }}
                      onChange={(e) => handleProfilePictureChange(e)}
                    />
                    <TextField
                      label="Username"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      label="Telegram Handle"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={telegramHandle}
                      onChange={(e) => setTelegramHandle(e.target.value)}
                    />
                    <TextField
                      label="Phone Number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="edit-profile-button"
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Save Changes
                    </Button>
                  </form>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default EditProfile;
