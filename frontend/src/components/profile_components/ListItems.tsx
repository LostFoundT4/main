import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from '@mui/icons-material/Home';
import AxiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export const mainListItems = (
    <React.Fragment>
        <ListItemButton href="/frontend/home">
            <ListItemIcon>
                <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton href="/frontend/my-listings">
            <ListItemIcon>
                <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="My Listings" />
        </ListItemButton>
    </React.Fragment>
);


const handleLogout = () => {
    localStorage.removeItem('authToken')
}


export const secondaryListItems = (
    <React.Fragment>
        {/* <ListSubheader component="div" inset>
      Others
    </ListSubheader> */}
        <ListItemButton href="/frontend/edit-profile">
            <ListItemIcon>
                <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Edit Profile" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout} href="/frontend/sign-in">
            <ListItemIcon>
                <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
        </ListItemButton>
    </React.Fragment>
);