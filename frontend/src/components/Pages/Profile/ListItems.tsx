import { Fragment } from "react";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ShoppingCart, Settings, Logout, Home } from "@mui/icons-material";

const handleLogout = () => {
    localStorage.removeItem('authToken')
}

export const mainListItems = (
    <Fragment>
        <ListItemButton href="/home">
            <ListItemIcon>
                <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton href="/my-listings">
            <ListItemIcon>
                <ShoppingCart />
            </ListItemIcon>
            <ListItemText primary="My Listings" />
        </ListItemButton>
    </Fragment>
);

export const secondaryListItems = (
    <Fragment>
        <ListItemButton href="/edit-profile">
            <ListItemIcon>
                <Settings />
            </ListItemIcon>
            <ListItemText primary="My Profile" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout} href="/sign-in">
            <ListItemIcon>
                <Logout />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
        </ListItemButton>
    </Fragment>
);