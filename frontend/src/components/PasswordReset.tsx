import { useState } from "react";
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
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PasswordIcon from "@mui/icons-material/Password";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function PasswordReset() {
    let navigate = useNavigate();

    const [pwdNew, setPwdNew] = useState("");
    const [pwdConfirm, setPwdConfirm] = useState("");
    const [showPasswordNew, setShowPasswordNew] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [pwdNewError, setPwdNewError] = useState("");
    const [pwdConfirmError, setPwdConfirmError] = useState("");

    const handleTogglePasswordVisibilityNew = () => {
        setShowPasswordNew((prevShowPassword) => !prevShowPassword);
    };

    const handleTogglePasswordVisibilityConfirm = () => {
        setShowPasswordConfirm((prevShowPassword) => !prevShowPassword);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Check if passwords are equal and minimally 8 characters long
        if (pwdNew === pwdConfirm && pwdNew.length >= 8) {
            // Passwords match and meet the criteria

            // AxiosInstance needed here

            
            setPwdNew("");
            setPwdConfirm("");
            setPwdNewError("");
            setPwdConfirmError("");

            !window.confirm("Password Successfully Reset! You can sign in.");

            navigate("/frontend/sign-in");
        } else {
            // Passwords do not meet the criteria
            if (pwdNew.length < 8) {
                setPwdNewError("Password must be at least 8 characters long");
            } else {
                setPwdNewError("");
            }
            if (pwdNew !== pwdConfirm) {
                setPwdConfirmError("Passwords do not match");
            } else {
                setPwdConfirmError("");
            }
        }
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
                    md={7}
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
                            WELCOME!
                        </Typography>
                        <div className="sign-in-logo-container">
                            <img
                                className="sign-in-logo"
                                src="https://res.cloudinary.com/dcaux54kw/image/upload/v1694597637/glogo.png"
                                alt="Logo"
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
                            Let us know, and we'll look around.
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
                            <PasswordIcon sx={{ color: "#ffffff" }} />
                        </Avatar>
                        <Typography
                            className="sign-in-h3"
                            component="h1"
                            variant="h5"
                        >
                            Key in your New Password
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
                                name="passwordNew"
                                label="New Password"
                                type={showPasswordNew ? "text" : "password"}
                                autoComplete="current-password"
                                onChange={(e) => setPwdNew(e.target.value)}
                                value={pwdNew}
                                error={pwdNewError !== ""}
                                helperText={pwdNewError}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                    handleTogglePasswordVisibilityNew
                                                }
                                                edge="end"
                                            >
                                                {showPasswordNew ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="passwordConfirm"
                                label="Confirm Password"
                                type={showPasswordConfirm ? "text" : "password"}
                                autoComplete="current-password"
                                onChange={(e) => setPwdConfirm(e.target.value)}
                                value={pwdConfirm}
                                error={pwdConfirmError !== ""}
                                helperText={pwdConfirmError}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                    handleTogglePasswordVisibilityConfirm
                                                }
                                                edge="end"
                                            >
                                                {showPasswordConfirm ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                className="sign-in-button"
                            >
                                Reset Password
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link
                                        href="sign-in"
                                        variant="body2"
                                        className="sign-in-link"
                                    >
                                        Return to sign-in
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
