import {useState , useContext , useEffect} from "react";
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
import PasswordIcon from '@mui/icons-material/Password';
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../utils/axiosInstance";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function ForgotPassword() {
    let navigate = useNavigate()

    const [usr,setUsr] = useState("")
    const [email, setEmail] = useState("");

    const [emailError, setEmailError] = useState(false);

    const emailRegex = /^[A-Za-z0-9._%+-]+@[^@]*smu\.edu\.sg$/;
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Check if the email ends with "@smu.edu.sg"
        if (!emailRegex.test(email)) {
            setEmailError(true);
            return; // Do not proceed with form submission
        }

        // If email is valid, proceed with form submission
        setUsr("");
        setEmail("");
        setEmailError(false);
        !window.confirm("Please check your email for the password reset link!")
        
    }

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
                            component="h4"
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
                            <PasswordIcon sx={{color: '#ffffff'}}/>
                        </Avatar>
                        <Typography className="sign-in-h3" component="h1" variant="h5">
                            Reset your Password
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
                                onChange={(e) => setUsr(e.target.value)}
                                value={usr}
                            />
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
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                className="sign-in-button"
                            >
                                Request Password Reset
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="sign-in" variant="body2" className="sign-in-link">
                                        Return to sign in
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="sign-up" variant="body2" className="sign-in-link">
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
