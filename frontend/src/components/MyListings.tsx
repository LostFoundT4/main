import * as React from "react";
import { useEffect, useState } from "react";
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
import AppDrawer from "./AppDrawer";
import CreateTicketButton from "./ticket_component/CreateTicketButton";
import EditTicketButton from "./ticket_component/EditTicketButton";
import { UserIDContext, UserNameContext } from "../utils/contextConfig";
import AxiosInstance from "../utils/axiosInstance";

// MyListings: Page where users can only see, add, edit, and delete their OWN items, not others

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ReportInfo {
  reportInfoID: number;
  description: string;
  ticket: {
    ticketID: number;
    ticketType: string;
    created_dateTime: string;
    user: number;
    username: string;
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
    found_dateTime: string;
  };
  status: {
    statusID: number;
    pendingUsers?: {
        id: number;
        user: number;
        username: string;
      }[];
    status: string;
    endorsedUserID: number;
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

function Tickets({
  ticketTypeFilter,
  searchQuery,
  onSearchQueryChange,
  activeTab,
}: {
  ticketTypeFilter: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  activeTab: number;
}) {
  const [reportInfos, setItems] = useState<ReportInfo[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    onSearchQueryChange(query); // Update the common search query state
  };

  // State to hold the user
  const { contextID, setContextID } = React.useContext(UserIDContext);

  useEffect(() => {
    // Fetch items that belong to the user
    AxiosInstance.get("/reportInfos").then((response) => {
      // Filter items based on the provided ticketTypeFilter and user ID
      const filteredItems = response.data.filter(
        (reportInfo: ReportInfo) =>
          reportInfo.ticket.ticketType === ticketTypeFilter &&
          reportInfo.ticket.user === Number(contextID)
      );
      // Set the filtered items in state
      setItems(filteredItems);
    });
  }, [ticketTypeFilter, contextID]);

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

  // Pop Up Modal for Item details
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [reportDetail, setreportDetail] = useState<ReportInfo>({
    reportInfoID: 0,
    description: "",
    ticket: {
      ticketID: 0,
      ticketType: "",
      created_dateTime: "",
      user: 0,
      username: "",
    },
    location: {
      locationID: 0,
      building: "",
      room: "",
    },
    item: {
      itemID: 0,
      itemName: "",
      category: "",
      image: "",
      ticketID: 0,
      found_dateTime: "",
    },
    status: {
      statusID: 0,
      pendingUsers: [{
        id: 0,
        user: 0,
        username: "",
      }],
      status: "",
      endorsedUserID: 0,
    },
  });

  const handleOpen = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: any
  ) => {
    e.persist();
    setreportDetail(index);
    setOpen(true);
  };

  const CustomModal = () => {
    const date = reportDetail.item.found_dateTime.substring(0, 10);
    const time = reportDetail.item.found_dateTime.substring(11, 16);
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          key={reportDetail.reportInfoID}
          keepMounted
        >
          <Box sx={style} className="popup-modal">
            <CardMedia
              component="div"
              sx={{
                pt: "80%",
              }}
              image={reportDetail.item.image}
            />
            <div className="popup-content-container">
              <Typography
                gutterBottom
                variant="h5"
                component="h3"
                className="item-name"
              >
                {reportDetail.item.itemName}
              </Typography>
              <Typography className="item-category">
                {reportDetail.item.category}
              </Typography>
              <Typography className="item-description">
                {reportDetail.description}
              </Typography>
              <Typography className="item-category">
                Last seen/found at: {reportDetail.location.building}{" "}
                {reportDetail.location.room} on {date} {time} hrs
              </Typography>
              <EditTicketButton
                myTicket={reportDetail.ticket}
                myItemID={reportDetail.item.itemID}
              />
            </div>
          </Box>
        </Modal>
      </div>
    );
  };
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    overflow: "scroll",
    border: "1px solid #21222c",
    boxShadow: 24,
    p: 4,
  };

  // Close the Lost Tickets
  const closeLostTicket = (statusID: any) => {
    AxiosInstance.put("/closeTicket/" + statusID).then((response) => {
      if (response.data === 404) {
        setErrorAlert(true);
      } else {
        setSuccessAlert(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  };

  // Endorse the Found Tickets
  const [selectedPendingUserId, setSelectedPendingUserId] = useState<
    null | number
  >(null);
  
  const endorseTicket = (ticketID: any) => {
    if (selectedPendingUserId) {
      AxiosInstance.put("/endorseTicket/" +  ticketID, {
        endorsedUserID: selectedPendingUserId,
      }).then((response) => {
          if (response.data === 404) {
            setErrorAlert(true);
          } else {
            setSuccessAlert(true);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        })
        .catch((error) => {
          setErrorAlert(true);
        });
    }
  };

  // Success Alert
  const [openSuccessAlert, setSuccessAlert] = React.useState(false);
  const handleCloseSuccessAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessAlert(false);
  };
  const SuccessAlert = () => {
    return (
      <Snackbar
        open={openSuccessAlert}
        autoHideDuration={5000}
        onClose={handleCloseSuccessAlert}
      >
        <Alert
          onClose={handleCloseSuccessAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          Ticket closed successfully!
        </Alert>
      </Snackbar>
    );
  };

  // Error Alert
  const [openErrorAlert, setErrorAlert] = React.useState(false);
  const handleCloseErrorAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorAlert(false);
  };
  const ErrorAlert = () => {
    return (
      <Snackbar
        open={openErrorAlert}
        autoHideDuration={5000}
        onClose={handleCloseErrorAlert}
      >
        <Alert
          onClose={handleCloseErrorAlert}
          severity="error"
          sx={{ width: "100%" }}
        >
          An unexpected error has occurred!
        </Alert>
      </Snackbar>
    );
  };

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
      <CustomModal />
      <SuccessAlert />
      <ErrorAlert />
      <Grid container spacing={4}>
        {filteredReportInfos.length > 0 ? (
          filteredReportInfos.map((reportInfo) => (
            <Grid item key={reportInfo.reportInfoID} xs={12} sm={6} md={4}>
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
                onClick={(e) => handleOpen(e, reportInfo)}
                />
                <Typography className="item-status">
                  {reportInfo.status.status}
                </Typography>
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
                  <Typography align="center" className="item-Status">
                    {}
                  </Typography>
                </CardContent>
                {activeTab === 1 ? ( 
                <TextField
                  className="pendingUser-dropdown"
                  select
                  label="Select Pending User"
                  value={
                    selectedPendingUserId === null ? "" : selectedPendingUserId
                  }
                  onChange={(e) => {
                    setSelectedPendingUserId(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {reportInfo.status.pendingUsers &&
                    reportInfo.status.pendingUsers.map((user) => (
                      <MenuItem key={user.id} value={user.user}>
                        {user.username}
                      </MenuItem>
                    ))}
                </TextField>) : null}
                <CardActions>
                  <div style={{ margin: "auto" }}>
                    {activeTab === 1 ? ( // Check if it's the 'Found Items' tab
                      <Button
                        size="small"
                        href=""
                        className="claim-button"
                        onClick={(e) => {
                          e.stopPropagation(); // Stop event propagation
                          setOpen(false); // Close the modal
                          endorseTicket(reportInfo.ticket.ticketID);
                        }}
                      >
                        ENDORSED
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        href=""
                        className="claim-button"
                        onClick={(e) => {
                          e.stopPropagation(); // Stop event propagation
                          setOpen(false); // Close the modal
                          closeLostTicket(reportInfo.status.statusID);
                        }}
                      >
                        CLOSE TICKET
                      </Button>
                    )}
                  </div>
                </CardActions>
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
