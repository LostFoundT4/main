import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Link,
    Paper,
    Box,
    Grid,
    Typography,
    Container,
    IconButton,
    InputAdornment,
    Stack,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AxiosInstance from "../utils/axiosInstance";

const defaultTheme = createTheme();

export default function SignUpSide() {
    // Define states for variables and error flags
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [usr, setUsr] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [tele, setTele] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    const emailRegex = /^[A-Za-z0-9._%+-]+@[^@]*smu\.edu\.sg$/;

    const navigate = useNavigate();

    useEffect(() => {
        setEmailError(false);
    }, [email]);

    useEffect(() => {
        setPasswordError(false);
    }, [pwd]);

    useEffect(() => {
        setPhoneError(false);
    }, [phoneNo]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Check if the email ends with "@smu.edu.sg"
        if (!emailRegex.test(email)) {
            setEmailError(true);
            return;
        }
        if (pwd.length < 8) {
            setPasswordError(true);
            return;
        }
        if (phoneNo.length > 8) {
            setPhoneError(true);
            return;
        }

        // If email is valid, proceed with form submission
        setEmailError(false);
        setPasswordError(false);
        setPhoneError(false);

        // register with sign-up details
        await AxiosInstance.post("/api/auth/register", {
            username: usr,
            password: pwd,
            email: email,
        })
            .then(async (response) => {
                await AxiosInstance.get("/api/auth/get-user", {
                    headers: {
                        Authorization: "Token " + response.data.token,
                    },
                }).then(async (response) => {
                    // Initialise the reputation of the user with clean flagged status, and score of 5
                    await AxiosInstance.post("/reputation/", {
                        user: response.data.id,
                        flagged: 0,
                        score: 5,
                    });
                    // Update the additional infomation of the user
                    await AxiosInstance.post("/userProfiles/", {
                        user: response.data.id,
                        userTelegramID: tele,
                        userPhoneNumber: phoneNo,
                    }).then((response) => {
                        navigate("/sign-in");
                    });
                });
            })
            .catch((error) => {
                console.log("Account cannot be created");
            });
    };

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
                            className="sign-in-h1"
                            component="h1"
                            variant="h3"
                            align="left"
                            color="text.primary"
                            gutterBottom
                        >
                            WELCOME !
                        </Typography>
                        <div className="sign-in-logo-container">
                            <img
                                className="sign-in-logo"
                                src="https://res.cloudinary.com/dcaux54kw/image/upload/v1694597637/glogo.png"
                            ></img>
                        </div>
                        <Typography
                            className="sign-in-h2"
                            variant="h5"
                            align="center"
                            color="#fff"
                            paragraph
                        >
                            Lost something? Found something?
                            <br />
                            Let us know and we'll look around.
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
                            <PersonAddAltOutlinedIcon
                                sx={{ color: "#ffffff" }}
                            />
                        </Avatar>
                        <Typography
                            className="sign-in-h3"
                            component="h1"
                            variant="h5"
                        >
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
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
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
                                                ? "Your password must contain at least 8 characters."
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
                                        onChange={(e) =>
                                            setPhoneNo(e.target.value)
                                        }
                                        value={phoneNo}
                                        error={phoneError} // Set error prop based on validation
                                        helperText={
                                            phoneError
                                                ? "Your Phone Number must contain less than 8 digit."
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
                                        onChange={(e) =>
                                            setTele(e.target.value)
                                        }
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
                                    <Link
                                        href="sign-in"
                                        variant="body2"
                                        className="sign-in-link"
                                    >
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
