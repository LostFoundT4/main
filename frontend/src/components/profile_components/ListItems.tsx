import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AxiosInstance from "../../axios/axiosInstance";
import { useNavigate } from "react-router-dom";

export const mainListItems = (
    <React.Fragment>
        <ListItemButton href="./dashboard">
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton href="./items">
            <ListItemIcon>
                <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Items" />
        </ListItemButton>
        <ListItemButton href="./profile">
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
        </ListItemButton>
    </React.Fragment>
);


const handleLogout = () => {
    // let navigate = useNavigate()
    
    // Retrieve authToken from local storage
    const authToken = localStorage.getItem("authToken");
    console.log("authToken:", authToken);

    const axios = require('axios')

    let reqInstance = axios.create({
        headers: {
            Authorization : `Token ${localStorage.getItem("authToken")}`
        }
    })

    reqInstance.post("/api/auth/logout");




export const secondaryListItems = (
    <React.Fragment>
        {/* <ListSubheader component="div" inset>
      Others
    </ListSubheader> */}
        <ListItemButton href="./settings">
            <ListItemIcon>
                <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
                <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
        </ListItemButton>
    </React.Fragment>
);