import * as React from "react";
import { useState, useEffect } from "react";
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
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import '../css/index.css'

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUpSide() {
    const [email, setEmail] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Check if the email ends with "@smu.edu.sg"
        if (!email.endsWith(".smu.edu.sg")) {
            setEmailError(true);
            return; // Do not proceed with form submission
        }

        // If email is valid, proceed with form submission
        setEmailError(false);
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get("school-email"),
            password: data.get("password"),
        });
    };

    // Handle changes to the email input field
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        setEmailError(!newEmail.endsWith("@smu.edu.sg")); // Validate as the user types
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
                        bgcolor: "#E9E9E9",
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
                        Welcome!
                    </Typography>
                    <div className="sign-in-logo-container">
                    <img className="sign-in-logo" src="https://res.cloudinary.com/dcaux54kw/image/upload/v1694597637/logo.png"></img>
                        </div>
                        <Typography
                            className = "sign-in-h2"
                            variant="h5"
                            align="center"
                            color="text.primary"
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
                        <Avatar sx={{ m: 1, bgcolor: "#222" }}>
                            <PersonAddAltOutlinedIcon />
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
                                        onChange={handleEmailChange}
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
