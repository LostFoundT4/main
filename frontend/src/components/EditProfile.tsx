import React, { useState , useEffect} from "react";
import AppDrawer from "./AppDrawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import AxiosInstance from "../utils/axiosInstance";
import {
  Typography,
  TextField,
  Button,
  Container,
  Box,
  Avatar,
  CardMedia,
} from "@mui/material";

function EditProfile() {
  // State variables to store user profile information
  const [id, setID] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(""); // You can use a URL or a file object
  const [userprofile, setUserProfile] = useState("")

  const[thisfile,setThisFile] = useState<File>();

  useEffect(()=>{
    AxiosInstance.get("/api/auth/get-user",{
      headers: {
        "Authorization": "Token " + localStorage.getItem("authToken")
      }
    }).then((response) => {
      setID(response.data.id)
      setUserProfile(response.data.profile[0])
      AxiosInstance.get("/userProfiles/"+ response.data.profile[0]).
      then((response)=>{
        setPhoneNumber(response.data.userPhoneNumber)
        setTelegramHandle(response.data.userTelegramID)
        setProfilePicture(response.data.userProfilePicture)
      })
      setUsername(response.data.username)
      setEmail(response.data.email)
    })

  },[])

  // Function to handle profile picture changes
  function handleProfilePictureChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newfile = e.target.files?.[0];

    if (newfile) {
      //Use FileReader to read the selected image and set it as the profile picture
      setThisFile(newfile)
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string | null;

        if (imageDataUrl) {
          setProfilePicture(imageDataUrl);
        }
      };
      reader.readAsDataURL(newfile);
    }
    
  }

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    AxiosInstance.put("/api/auth/updateProfile/"+id+"/",{ 
    "username":username,
    "email":email
    },{
    headers:{
      "Authorization": "Token " + localStorage.getItem("authToken")
    }
      }).then((response)=>{

        console.log(response)
        console.log(telegramHandle)
        const formData = new FormData();
        formData.append('userTelegramID', telegramHandle)
        formData.append('userPhoneNumber', phoneNumber)
        if(thisfile?.type !== undefined){
          formData.append('userProfilePicture', thisfile!)
        }

        console.log(formData)

        AxiosInstance.put("/userProfiles/"+userprofile,formData,{
          headers: {
            "Content-Type": "multipart/form-data",
          }}).then((response)=>{
            window.location.reload()
        })

      }).catch((error)=>{
        console.log("failed")
      })

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
                <CardMedia
                  component="div"
                  sx={{ width: 100, height: 100 }}
                  image={profilePicture}
                />
                  {/* <Avatar
                    sx={{ width: 100, height: 100 }}
                    ={profilePicture}
                    alt="Profile"
                  /> */}
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
