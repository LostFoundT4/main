import { Fragment } from "react";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ShoppingCart, Settings, Logout, Home } from "@mui/icons-material";

const handleLogout = () => {
    localStorage.removeItem('authToken')
}

// Top half icons of sidebar
export const mainListItems = (
    <Fragment>
        <ListItemButton href="/frontend/home">
            <ListItemIcon>
                <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton href="/frontend/my-listings">
            <ListItemIcon>
                <ShoppingCart />
            </ListItemIcon>
            <ListItemText primary="My Listings" />
        </ListItemButton>
    </Fragment>
);

// Bottom half icons of sidebar
export const secondaryListItems = (
    <Fragment>
        <ListItemButton href="/frontend/edit-profile">
            <ListItemIcon>
                <Settings />
            </ListItemIcon>
            <ListItemText primary="Edit Profile" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout} href="/frontend/sign-in">
            <ListItemIcon>
                <Logout />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
        </ListItemButton>
    </Fragment>
);