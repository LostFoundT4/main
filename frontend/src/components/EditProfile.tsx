import React, { useState } from "react";
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

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Avatar
          sx={{ width: 100, height: 100 }}
          src={profilePicture}
          alt="Profile"
        />
        <Typography variant="h5" mt={2}>
          Edit Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
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
            fullWidth
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default EditProfile;