import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AxiosInstance from "../axios/axiosInstance";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUpSide() {

    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [pwd,setPwd] = useState("");
    const [usr,setUsr] = useState("");
    const [phoneNo,setPhoneNo] = useState("");
    const [tele,setTele] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    const emailRegex = /^[A-Za-z0-9._%+-]+@[^@]*smu\.edu\.sg$/;

    useEffect(()=>{
        setEmailError(false)
    },[email])

    useEffect(()=>{
        setPasswordError(false)
    },[pwd])

    useEffect(()=>{
        setPhoneError(false)
    },[phoneError])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Check if the email ends with "@smu.edu.sg"
        if (!emailRegex.test(email)) {
            setEmailError(true);
            return; // Do not proceed with form submission
        }
        if (pwd.length < 8) {
            setPasswordError(true);
            return; // Do not proceed with form submission
        }
        if (phoneNo.length > 8) {
            setPasswordError(true);
            return; // Do not proceed with form submission
        }
        // If email is valid, proceed with form submission
        setEmailError(false);
        setPasswordError(false);
        await AxiosInstance.post('/api/auth/register',{
            "username": usr,
            "password": pwd,
            "email":email
            },
            ).then(async(response)=> {
                
                await AxiosInstance.get("/api/auth/get-user",{
                    headers: {
                      "Authorization": "Token " + response.data.token
                    }
                }).then(async(response)=>{
                    await AxiosInstance.post('/userProfiles/',{
                        "user": response.data.id,
                        "userTelegramID": tele,
                        "userPhoneNumber": phoneNo
                    }).then((response)=>{
                        navigate("/frontend/sign-in")
                    })
                })
            }
            ).catch((error) => {
                console.log("Account cannot be created");
            })
        // console.log(usr + pwd + email + phoneNo + tele);
    }
    
    
    // Handle changes to the email input field
    // const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const newEmail = event.target.value;
    //     setEmail(newEmail);
    //     setEmailError(!emailRegex.test(email)); // Validate as the user types
    // };

    // const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const newPassword = event.target.value;
    //     setPwd(newPassword);
    //     setPasswordError(pwd.length < 8); // Validate for 8 character length password
    // };



    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: "100vh" }}>
                <CssBaseline />
                <Grid
                    className="sign-in-container"
                    item
                    xs={12}
                    sm={8}
                    md={7} // Increase the md value to allocate more space
                    sx={{
                        bgcolor: "#21222c",
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            className = "sign-in-h1"
                            component="h1"
                            variant="h3"
                            align="left"
                            color="text.primary"
                            gutterBottom
                        >
                        WELCOME !
                    </Typography>
                    <div className="sign-in-logo-container">
                    <img className="sign-in-logo" src="https://res.cloudinary.com/dcaux54kw/image/upload/v1694597637/glogo.png"></img>
                        </div>
                        <Typography
                            className = "sign-in-h2"
                            variant="h5"
                            align="center"
                            color="#fff"
                            paragraph
                        >
                            Lost something? Found something?<br/>Let us know and we'll look around.
                        </Typography>
                        <Stack
                            sx={{ pt: 1 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        ></Stack>
                    </Container>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                    className="sign-in-container2"
                >
                    <Box
                        sx={{
                            my: 2,
                            mx: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: "#21222c" }}>
                            <PersonAddAltOutlinedIcon sx={{color: '#ffffff'}}/>
                        </Avatar>
                        <Typography className="sign-in-h3" component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit}
                            sx={{ mt: 3 }}
                            className="sign-in-box"
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="school-email"
                                        label="School Email"
                                        type="email" // Use "email" type for email input
                                        id="school-email"
                                        autoComplete="school-email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        error={emailError} // Set error prop based on validation
                                        helperText={
                                            emailError
                                                ? 'Does not end with "@smu.edu.sg"'
                                                : ""
                                        }
                                        
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        autoComplete="new-password"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={
                                                            handleTogglePasswordVisibility
                                                        }
                                                        edge="end"
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        onChange={(e) => setPwd(e.target.value)}
                                        value={pwd}
                                        error={passwordError} // Set error prop based on validation
                                        helperText={
                                            passwordError
                                                ? 'Your password must contain at least 8 characters.'
                                                : ""
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="username"
                                        label="Username"
                                        type="username"
                                        id="username"
                                        autoComplete="username"
                                        onChange={(e) => setUsr(e.target.value)}
                                        value={usr}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="phone-number"
                                        label="Phone Number (Optional)"
                                        type="phone-number"
                                        id="phone-number"
                                        autoComplete="phone-number"
                                        onChange={(e) => setPhoneNo(e.target.value)}
                                        value={phoneNo}
                                        error={phoneError} // Set error prop based on validation
                                        helperText={
                                            phoneError
                                                ? 'Your password must contain less than 8 digit.'
                                                : ""
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="telegram-handle"
                                        label="Telegram Handle (Optional)"
                                        type="telegram-handle"
                                        id="telegram-handle"
                                        autoComplete="telegram-handle"
                                        onChange={(e) => setTele(e.target.value)}
                                        value={tele}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                className="sign-in-button"
                            >
                                Sign Up Now
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="sign-in" variant="body2" className="sign-in-link">
                                        Already have an account? Log in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

