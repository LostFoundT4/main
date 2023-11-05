import React, { useEffect, useState } from "react";
import {
  styled,
  createTheme,
  ThemeProvider,
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
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Modal,
  Alert,
  Snackbar,
  Rating,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AxiosInstance from "../utils/axiosInstance";
import AppDrawer from "./AppDrawer";
import { UserIDContext, UserNameContext } from "../utils/contextConfig";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { WindowSharp } from "@mui/icons-material";
import { ErrorAlert } from "./effect_components/errorAlert";
import { SuccessAlert } from "./effect_components/successAlert";

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
  securityQuestion: string;
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
    pendingUsers: {
      id: number;
      user: number;
      username: string;
    };
    status: string;
    endorsedUserID: number;
    endorsedUsername: string;
  };
}

interface UserProfileInfo {
  userProfileNumber: number;
  userTelegramID: string;
  userProfilePicture: string;
  userPhoneNumber: string;
  user: number;
  username: string;
}

// Component for tab panel
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

// Helper function to create accessibility props for tabs
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// Tabs "Lost Items" and "Found Items"
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

  // Get the current user's ID
  const { contextID, setContextID } = React.useContext(UserIDContext);

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
          currentUser={contextID}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Tickets
          ticketTypeFilter={"Found"}
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          activeTab={value}
          currentUser={contextID}
        />
      </CustomTabPanel>
    </Box>
  );
}

// Component for displaying the tickets
function Tickets({
  ticketTypeFilter,
  searchQuery,
  onSearchQueryChange,
  activeTab,
  currentUser,
}: {
  ticketTypeFilter: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  activeTab: number;
  currentUser: string | null;
}) {
  const [reportInfos, setItems] = useState<ReportInfo[]>([]);
  const [openErrorAlert, setErrorAlert] = React.useState(false);
  const [openSuccessAlert, setSuccessAlert] = React.useState(false);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    onSearchQueryChange(query); // Update the common search query state
  };

  useEffect(() => {
    AxiosInstance.get("/reportInfos/", {
      headers: {
        Authorization: "Token " + localStorage.getItem("authToken"),
      },
    }).then((response) => {
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

  // Filter items based on the search query
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
    securityQuestion: "",
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
      pendingUsers: {
        id: 0,
        user: 0,
        username: "",
      },
      status: "",
      endorsedUserID: 0,
      endorsedUsername: "",
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
    const [reputation, setReputation] = useState("");

    if (reportDetail.ticket.user !== 0){
      AxiosInstance.get("/reputationwithUserID/" + reportDetail.ticket.user, {
        headers: {
          Authorization: "Token " + localStorage.getItem("authToken"),
        },
      }).then(
        (response) => {
          setReputation(response.data.score);
        }
      );
    }

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
              <Typography className="item-description">
                Reported by: {reportDetail.ticket.username}
              </Typography>
              <Typography
                className="item-rating"
                sx={{ display: "inline-flex" }}
              >
                User's Reputation:
                <Rating
                  name="half-rating-read"
                  value={parseFloat(reputation)}
                  precision={0.5}
                  readOnly
                  emptyIcon={
                    <StarBorderIcon
                    sx={{
                      color: "#2dd197",
                      display: "inline-flex",
                      alignSelf: "center",
                    }}
                    />
                  }
                  sx={{ marginRight: "10px", color: "#21222c", fontSize:"16px"}}
                />
              </Typography>
              {reportDetail.status.status === "Claimed" ? (
                <Typography className="item-description">
                  Claimed by: {reportDetail.status.endorsedUsername}
                </Typography>
              ) : null}
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

  // Helper function to check if the item belongs to the current user
  function isItemBelongsToCurrentUser(
    reportInfo: ReportInfo,
    currentUser: string | null
  ) {
    if (currentUser !== null)
      return reportInfo.ticket.user === parseInt(currentUser);
  }

  // Modal for User Information
  const [userProfileInfo, setProfileInfo] = useState<UserProfileInfo>({
    userProfileNumber: 0,
    userTelegramID: "",
    userProfilePicture: "",
    userPhoneNumber: "",
    user: 0,
    username: "",
  });
  const [reputation, setReputation] = useState("");
  const handleOpenContactInfo = (
    e: React.MouseEvent<Element, MouseEvent>,
    index: any
  ) => {
    e.persist();

    AxiosInstance.get("/userProfileswithUserID/" + index, {
      headers: {
        Authorization: "Token " + localStorage.getItem("authToken"),
      },
    })
      .then((response) => {
        setProfileInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });

    AxiosInstance.get("/reputationwithUserID/" + index, {
      headers: {
        Authorization: "Token " + localStorage.getItem("authToken"),
      },
    }).then((response) => {
      setReputation(response.data.score);
    });
    setOpenUserInfo(true);
  };
  const [openUserInfo, setOpenUserInfo] = React.useState(false);
  const handleCloseUserInfo = () => setOpenUserInfo(false);
  const UserInfoModal = () => {
    return (
      <div>
        <Modal
          open={openUserInfo}
          onClose={handleCloseUserInfo}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          key={userProfileInfo.user}
          keepMounted
        >
          <Box sx={style} className="popup-modal">
            <CardMedia
              component="div"
              sx={{
                pt: "80%",
                margin: "20px",
              }}
              image={userProfileInfo.userProfilePicture}
            />
            <div className="popup-content-container">
              <Typography
                gutterBottom
                variant="h5"
                component="h3"
                className="item-name"
              >
                {userProfileInfo.username}
              </Typography>
              <Typography className="item-description">
                Phone number: +65
                {userProfileInfo.userPhoneNumber}
              </Typography>
              <Typography className="item-category">
                Telegram handle: @{userProfileInfo.userTelegramID}
              </Typography>
              <Typography
                className="item-description"
                sx={{ display: "inline-flex",
                alignItems: "center", }}
              >
                Reputation:
                <Rating
                  name="half-rating-read"
                  value={parseFloat(reputation)}
                  precision={0.5}
                  readOnly
                  emptyIcon={
                    <StarBorderIcon
                      fontSize="inherit"
                      sx={{
                        color: "#2dd197",
                        display: "inline-flex"
                      }}
                    />
                  }
                  sx={{ marginRight: "10px", color: "#2dd197", fontSize:"16px" }}
                />
              </Typography>
            </div>
          </Box>
        </Modal>
      </div>
    );
  };

  // Handle claim item
  const handleClaim = (reportInfo: any, userID: any) => {
    // Prompt for security answer
    let securityAnswer = window.prompt(reportInfo.securityQuestion)
    if (securityAnswer === null || securityAnswer === ""){
      return;
    }

    AxiosInstance.put("/claimTicket/" + reportInfo.ticket.ticketID, {
      userID: userID,
      securityAnswer: securityAnswer,
    }, {
      headers: {
        Authorization: "Token " + localStorage.getItem("authToken"),
      },
    }).then((response) => {
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
      <UserInfoModal />
      {openSuccessAlert ? <SuccessAlert/> : ""}
      {openErrorAlert ? <ErrorAlert /> : ""}
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
                onClick={(e) => handleOpen(e, reportInfo)}
              >
                <CardMedia
                  component="div"
                  sx={{
                    pt: "80%",
                  }}
                  image={reportInfo.item.image}
                />
                {reportInfo.status.status === "Found" ||
                reportInfo.status.status === "Claimed" ? (
                  <Typography
                    className="item-status"
                    sx={{ backgroundColor: "#21222c", color:"#6cf3c3 !important" }}
                  >
                    {reportInfo.status.status}
                  </Typography>
                ) : reportInfo.status.status === "Pending" ? (
                  <Typography
                    className="item-status"
                    sx={{ backgroundColor: "#f9f97d" }}
                  >
                    {reportInfo.status.status}
                  </Typography>
                ) : reportInfo.status.status === "Lost" ||
                reportInfo.status.status === "Unclaimed"? (
                  <Typography
                    className="item-status"
                    sx={{ backgroundColor: "#2dd197", color:"##21222c !important" }}
                  >
                    {reportInfo.status.status}
                  </Typography>
                ) : null}
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
                <CardActions>
                  <div style={{ margin: "auto" }}>
                    {activeTab === 1 // Check if it's the 'Found Items' tab
                      ? !isItemBelongsToCurrentUser(
                          reportInfo,
                          currentUser
                        )&& 
                          !(
                            reportInfo.status.status === "Claimed"
                          ) && (
                          <Button
                            size="small"
                            href=""
                            className="claim-button"
                            onClick={(e) => {
                              e.stopPropagation(); // Stop event propagation
                              handleClaim(
                                reportInfo,
                                currentUser
                              );
                              setOpen(false); // Close the modal
                            }}
                          >
                            CLAIM
                          </Button>
                        )
                      : !isItemBelongsToCurrentUser(
                          reportInfo,
                          currentUser
                        ) && 
                        !(
                          reportInfo.status.status === "Found"
                        ) && (
                          <Button
                            size="small"
                            href=""
                            className="claim-button"
                            onClick={(e) => {
                              e.stopPropagation(); // Stop event propagation
                              setOpen(false); // Close the modal
                              handleOpenContactInfo(e, reportInfo.ticket.user);
                            }}
                          >
                            CONTACT THE OWNER
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
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query

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
                <Box style={{ fontSize: "36px", color: "white" }}>Home</Box>
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
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
