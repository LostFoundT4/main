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
import AddIcon from "@mui/icons-material/Add";
import AppDrawer from "./AppDrawer";

import { useLocation } from 'react-router-dom';
import axios from "axios/index";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface Item {
    itemID: number;
    itemName: string;
    category: string;
    image: string;
    ticketID: number;
}

interface ReportInfo {
    reportInfoID: number;
    description: string;
    ticket: {
        ticketID: number;
        ticketType: string;
        created_dateTime: string;
    };
    location: {
        locationID: number;
        building: string;
        room: string;
    };
    item: {
        itemID: number;
        itemName: string;
        category: string;
        image: string;
        ticketID: number;
    };
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

document.addEventListener("DOMContentLoaded", function(){
    console.log("Hello");
});

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function BasicTabs({
    searchQuery,
    onSearchQueryChange,
}: {
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
}) {
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
                <Tickets
                    ticketTypeFilter={"Lost"}
                    searchQuery={searchQuery}
                    onSearchQueryChange={onSearchQueryChange}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Tickets
                    ticketTypeFilter={"Found"}
                    searchQuery={searchQuery}
                    onSearchQueryChange={onSearchQueryChange}
                />
            </CustomTabPanel>
        </Box>
    );
}

function Tickets({
    ticketTypeFilter,
    searchQuery,
    onSearchQueryChange,
}: {
    ticketTypeFilter: string;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
}) {
    const [reportInfos, setItems] = useState<ReportInfo[]>([]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        onSearchQueryChange(query); // Update the common search query state
    };

    useEffect(() => {
        AxiosInstance.get("/reportInfos")
            .then((response) => {
                // Filter items based on the provided ticketTypeFilter
                const filteredItems = response.data.filter(
                    (reportInfo: ReportInfo) =>
                        reportInfo.ticket.ticketType === ticketTypeFilter
                );
                setItems(filteredItems);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
            });
    }, [ticketTypeFilter]); // Re-fetch data when ticketTypeFilter changes

    const filteredReportInfos = reportInfos.filter((reportInfo) => {
        const { description, item } = reportInfo;
        const { itemName, category } = item;
        const searchWords = searchQuery.toLowerCase().split(" ");

        // Check if any of the search words match the description, itemName, or category
        return searchWords.some((searchWord) => {
            return (
                description.toLowerCase().includes(searchWord) ||
                itemName.toLowerCase().includes(searchWord) ||
                category.toLowerCase().includes(searchWord)
            );
        });
    });

    return (
        <div>
            <TextField
                id="filled-basic"
                // label="Search"
                variant="filled"
                className="search-bar"
                InputProps={{
                    style: {
                        backgroundColor: "#fff",
                        display: "none", // Add this line to hide the search bar
                    },
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon className="search-icon" />
                        </InputAdornment>
                    ),
                }}
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <Grid container spacing={4}>
                {filteredReportInfos.length > 0 ? (
                    filteredReportInfos.map((reportInfo) => (
                        <Grid
                            item
                            key={reportInfo.reportInfoID}
                            xs={12}
                            sm={6}
                            md={4}
                        >
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
                                        pt: "80%",
                                    }}
                                    image={reportInfo.item.image}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h3"
                                        className="item-name"
                                    >
                                        {reportInfo.item.itemName}
                                    </Typography>
                                    <Typography className="item-category">
                                        {reportInfo.item.category}
                                    </Typography>
                                    <Typography className="item-description">
                                        {reportInfo.description}
                                    </Typography>
                                </CardContent>
                                {/* <CardActions>
                                    <Button size="small" href="./view-item">
                                        View
                                    </Button>
                                    <div style={{ marginLeft: "auto" }}>
                                        <Button size="small" href="./edit-item">
                                            Edit
                                        </Button>
                                    </div>
                                </CardActions> */}
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography
                            variant="body1"
                            color="textSecondary"
                            style={{ color: "white" }}
                        >
                            No matching items found.
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </div>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Home() {
    console.log(localStorage.getItem('authToken'))
    const [open, setOpen] = React.useState(true);
    const [value, setValue] = React.useState(0);
    const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleSearchQueryChange = (query: string) => {
        setSearchQuery(query); // Update the search query in the Home component
    };

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
                                    <TextField
                                        id="filled-basic"
                                        label="Search"
                                        variant="filled"
                                        className="search-bar"
                                        InputProps={{
                                            style: {
                                                backgroundColor: "#fff",
                                                marginBottom: "16px", // Add margin to move it below the search bar
                                            },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <SearchIcon className="search-icon" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        value={searchQuery} // Pass the searchQuery state
                                        onChange={(e) =>
                                            handleSearchQueryChange(
                                                e.target.value
                                            )
                                        }
                                    />
                                    <BasicTabs
                                        searchQuery={searchQuery}
                                        onSearchQueryChange={
                                            handleSearchQueryChange
                                        }
                                    />
                                    <Button
                                        href="./add-new-item" // Todo: change href
                                        variant="contained"
                                        className="add-item-button"
                                        style={{
                                            position: "absolute",
                                            top: "16px", // Adjust the top value as needed
                                            right: "16px", // Adjust the right value as needed
                                        }}
                                    >
                                        <AddIcon />
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
