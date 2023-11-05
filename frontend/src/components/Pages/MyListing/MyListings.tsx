import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  CssBaseline,
  Box,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  InputAdornment,
  TextField,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Modal,
  CardActions,
  Button,
  Snackbar,
  Alert,
  Select,
  MenuItem,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AppDrawer from "../AppDrawer";
import CreateTicketButton from "../../ticket_component/CreateTicketButton";
import Tickets from "../../ticket_component/Ticket";


// MyListings: Page where users can only see, add, edit, and delete their OWN items, not others

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
          activeTab={value}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Tickets
          ticketTypeFilter={"Found"}
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          activeTab={value}
        />
      </CustomTabPanel>
    </Box>
  );
}

const defaultTheme = createTheme();

export default function Home() {
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
                <Box style={{ fontSize: "36px", color: "white" }}>
                  My Listings
                </Box>
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
                    onChange={(e) => handleSearchQueryChange(e.target.value)}
                  />
                  <BasicTabs
                    searchQuery={searchQuery}
                    onSearchQueryChange={handleSearchQueryChange}
                  />
                  <CreateTicketButton />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
