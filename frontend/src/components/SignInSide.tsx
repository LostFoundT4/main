import React, { useState, useEffect } from "react";
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Paper,
    Box,
    Grid,
    Typography,
    IconButton,
    InputAdornment,
    Container,
} from "@mui/material";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../utils/axiosInstance";

const defaultTheme = createTheme();

export default function SignInSide() {
    // Define states for variables
    const [usr, setUsr] = useState("");
    const [pwd, setPwd] = useState("");
    const [isCorrectCred, setisCorrectCred] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // Reset isCorrectCred when username or password changes
    useEffect(() => {
        setisCorrectCred(true);
    }, [usr, pwd]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        await AxiosInstance.post("/api/auth/login", {
            username: data.get("username"),
            password: data.get("password"),
        })
            .then(async (response) => {
                const token = response.data.token;
                await AxiosInstance.get(`/verifyStatus/${token}`)
                    .then(response => {
                    // Handle response here
                        if (response.data.email_verified ==true){
                            localStorage.clear();
                            localStorage.setItem("authToken", response.data.token);
                            navigate("/home");
                        }else{
                            console.log("User not verified");
                            setisCorrectCred(false);
                        }
                })
                    .catch(error => {
                        // Handle error here
                        console.error(error);
                    });

            })
            .catch((error) => {
                setisCorrectCred(false);
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
                            component="h4"
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
                            <LoginOutlinedIcon sx={{ color: "#ffffff" }} />
                        </Avatar>
                        <Typography
                            className="sign-in-h3"
                            component="h1"
                            variant="h5"
                        >
                            Log In
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit}
                            sx={{ mt: 1 }}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                error={isCorrectCred ? false : true}
                                onChange={(e) => setUsr(e.target.value)}
                                value={usr}
                                helperText={
                                    isCorrectCred
                                        ? ""
                                        : "Incorrect Username/Password"
                                }
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                autoComplete="current-password"
                                error={isCorrectCred ? false : true}
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                helperText={
                                    isCorrectCred
                                        ? ""
                                        : "Incorrect Username/Password"
                                }
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
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="remember"
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                className="sign-in-button"
                            >
                                Log In Now
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="forgot-password" variant="body2" className="sign-in-link">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link
                                        href="sign-up"
                                        variant="body2"
                                        className="sign-in-link"
                                    >
                                        {"Don't have an account? Sign up"}
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
