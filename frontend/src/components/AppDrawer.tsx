import React, { useState , useEffect} from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import {
  AppBarProps as MuiAppBarProps,
  Toolbar,
  List,
  Divider,
  IconButton,
  Typography,
  Link,
  ListItemIcon,
  CardMedia,
} from "@mui/material";
import {
  mainListItems,
  secondaryListItems,
} from "./profile_components/ListItems";
import { UserNameContext } from "../utils/contextConfig";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import AxiosInstance from "../utils/axiosInstance";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

export default function AppDrawer() {
  const [open, setOpen] = React.useState(true);
  const [value, setValue] = React.useState(0); // Initialize the selected tab index
  const { contextName, setContextName } = React.useContext(UserNameContext);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Retrieve profile image
  const [profilePicture, setProfilePicture] = useState(""); // You can use a URL or a file object
  const [userprofile, setUserProfile] = useState("");
  useEffect(() => {
    AxiosInstance.get("/api/auth/get-user", {
      headers: {
        Authorization: "Token " + localStorage.getItem("authToken"),
      },
    }).then((response) => {
      setUserProfile(response.data.profile[0]);
      AxiosInstance.get("/userProfiles/" + response.data.profile[0]).then(
        (response) => {
          setProfilePicture(response.data.userProfilePicture);
        }
      );
    });
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="absolute"
          open={open}
          style={{ background: "#21222c" }}
        >
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <img
              className="drawer-logo"
              src="https://res.cloudinary.com/dcaux54kw/image/upload/v1694597637/glogo.png"
            ></img>
            <Typography className="drawer-h1">
              Connect and Reunite: Share Your Findings with People.
            </Typography>
            <Link
              sx={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center", // Align items vertically
                textDecoration: "none",
                color: "white",
              }}
              href="/frontend/edit-profile"
            >
                <CardMedia
                  component="div"
                  sx={{ width: 40, height: 40, marginRight: "10px" }}
                  image={profilePicture}
                />
              {contextName}
            </Link>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              bgColor: "#21222c",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon className="side-nav-chevronlefticon" />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav" className="side-nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
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
        </Box>
      </Box>
    </ThemeProvider>
  );
}
