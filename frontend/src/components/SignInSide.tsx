import {useState , useRef , useEffect} from "react";
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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import '../css/index.css'
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../axios/axiosInstance";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignInSide() {
    let navigate = useNavigate()

    const [usr,setUsr] = useState("")
    const [pwd,setPwd] = useState("")
    const[isCorrectCred,setisCorrectCred] = useState(true)
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() =>{
        setisCorrectCred(true)
    },[usr,pwd])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        AxiosInstance.post('/api/auth/login',{
            "username":data.get("username"),
            "password":data.get("password")},
            ).then((response)=> {navigate("/frontend/home")}
            ).catch((error) => {
                setisCorrectCred(false)
            })
    }

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
                            component="h4"
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
                            <LoginOutlinedIcon />
                        </Avatar>
                        <Typography className="sign-in-h3" component="h1" variant="h5">
                            Log in
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
                                error = {isCorrectCred ? false : true }
                                onChange={(e) => setUsr(e.target.value)}
                                value={usr}
                                helperText= {isCorrectCred ? "" : "Incorrect Username/Password"}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={
                                    showPassword ? "text" : "password"
                                    }
                                id="password"
                                autoComplete="current-password"
                                error = {isCorrectCred ? false : true }
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                helperText= {isCorrectCred ? "" : "Incorrect Username/Password"}
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
                                    <Link href="#" variant="body2" className="sign-in-link">
                                        Forgot password?
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
