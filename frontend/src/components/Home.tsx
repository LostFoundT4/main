import * as React from "react";
import { useEffect, useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
    mainListItems,
    secondaryListItems,
} from "./profile_components/ListItems";
import Chart from "./profile_components/Chart";
import Deposits from "./profile_components/Deposits";
import Orders from "./profile_components/Orders";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../axios/axiosInstance";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface Item {
    itemID: number;
    itemName: string;
    category: string;
    ticketID: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function BasicTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="Lost Items" {...a11yProps(0)} />
                    <Tab label="Found Items" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Tickets ticketIDFilter={1} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Tickets ticketIDFilter={2} />
            </CustomTabPanel>
        </Box>
    );
}

function Tickets({ ticketIDFilter }: { ticketIDFilter: number }) {
    const [items, setItems] = useState<Item[]>([]); // Provide the type as Item[]

    useEffect(() => {
        AxiosInstance.get("/items")
            .then((response) => {
                // Filter items based on the provided ticketIDFilter
                const filteredItems = response.data.filter(
                    (item: Item) => item.ticketID === ticketIDFilter
                );
                setItems(filteredItems);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
            });
    }, [ticketIDFilter]); // Re-fetch data when ticketIDFilter changes

    return (
        <Grid container spacing={4}>
            {items.map((item) => (
                <Grid item key={item.itemID} xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <CardMedia
                            component="div"
                            sx={{
                                // 16:9
                                pt: "56.25%",
                            }}
                            image="https://source.unsplash.com/random?wallpapers"
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                            >
                                {item.itemName}
                            </Typography>
                            <Typography>{item.category}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" href="./view-item">
                                View
                            </Button>
                            {/* Todo: change href */}
                            <div style={{ marginLeft: "auto" }}>
                                <Button size="small" href="./edit-item">
                                    Edit
                                </Button>
                                {/* Todo: change href */}
                            </div>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

function Copyright(props: any) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            <Link color="inherit" href="./sign-in">
                Back to Login
            </Link>{" "}
        </Typography>
    );
}

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

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Home() {
    const [open, setOpen] = React.useState(true);
    const [value, setValue] = React.useState(0); // Initialize the selected tab index

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
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
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        ></Typography>

                        <TextField
                            fullWidth
                            id="filled-basic"
                            label="Search"
                            variant="filled"
                            InputProps={{
                                style: {
                                    backgroundColor: "rgba(255, 255, 255, 1.0)",
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        {mainListItems}
                        <Divider sx={{ my: 1 }} />
                        {secondaryListItems}
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: "100vh",
                        overflow: "auto",
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        flexGrow: 1, // Allow the paper to grow to fill available space
                                        overflow: "auto", // Add scrollbars when the content overflows
                                        position: "relative",
                                    }}
                                >
                                    <BasicTabs />
                                    <Button
                                        href="./add-new-item" // Todo: change href
                                        variant="contained"
                                        color="primary"
                                        style={{
                                            position: "absolute",
                                            top: "16px", // Adjust the top value as needed
                                            right: "16px", // Adjust the right value as needed
                                        }}
                                    >
                                        Add New Item
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
