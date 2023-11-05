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
import AppDrawer from "../Pages/AppDrawer";
import CreateTicketButton from "./CreateTicketButton";
import EditTicketButton from "./EditTicketButton";
import { UserIDContext, UserNameContext } from "../../utils/contextConfig";
import AxiosInstance from "../../utils/axiosInstance";
import { SuccessAlert } from "../effect_components/successAlert";
import { ErrorAlert } from "../effect_components/errorAlert";

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
    pendingUsers?: {
      id: number;
      user: number;
      securityAnswer: string;
      username: string;
      phoneNumber: string;
      score: number;
    }[];
    status: string;
    endorsedUserID: number;
    endorsedUsername: string;
  };
}

export default function Tickets({
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

  // State to hold the user
  const { contextID, setContextID } = useContext(UserIDContext);

  const [openErrorAlert, setErrorAlert] = React.useState(false);
  const [openSuccessAlert, setSuccessAlert] = React.useState(false);

  useEffect(() => {
    // Fetch items that belong to the user
    AxiosInstance.get("/reportInfos", {
      headers: {
        Authorization: "Token " + localStorage.getItem("authToken"),
      },
    }).then((response) => {
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
      pendingUsers: [
        {
          id: 0,
          user: 0,
          securityAnswer: "",
          username: "",
          phoneNumber: "",
          score: 0,
        },
      ],
      status: "",
      endorsedUserID: 0,
      endorsedUsername: "",
    },
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    onSearchQueryChange(query); // Update the common search query state
  };

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
              {reportDetail.status.status === "Claimed" ? (
                <Typography className="item-description">
                  Claimed by: {reportDetail.status.endorsedUsername}
                </Typography>
              ) : null}

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
    AxiosInstance.put("/closeTicket/" + statusID, null, {
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

  // Endorse the Found Tickets
  const [selectedPendingUserId, setSelectedPendingUserId] = useState<
    null | number
  >(null);

  const endorseTicket = (ticketID: any) => {
    if (selectedPendingUserId) {
      AxiosInstance.put("/endorseTicket/" + ticketID, {
        endorsedUserID: selectedPendingUserId,
      },{
        headers: {
          Authorization: "Token " + localStorage.getItem("authToken"),
        },
      }) .then((response) => {
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
      {openSuccessAlert ? <SuccessAlert /> : ""}
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
              >
                <CardMedia
                  component="div"
                  sx={{
                    pt: "80%",
                  }}
                  image={reportInfo.item.image}
                  onClick={(e) => handleOpen(e, reportInfo)}
                />
                {reportInfo.status.status === "Found" ||
                reportInfo.status.status === "Claimed" ? (
                  <Typography
                    className="item-status"
                    sx={{
                      backgroundColor: "#21222c",
                      color: "#6cf3c3 !important",
                    }}
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
                  reportInfo.status.status === "Unclaimed" ? (
                  <Typography
                    className="item-status"
                    sx={{
                      backgroundColor: "#2dd197",
                      color: "##21222c !important",
                    }}
                  >
                    {reportInfo.status.status}
                  </Typography>
                ) : null}
                <CardContent sx={{ flexGrow: 1, paddingBottom: "0" }}>
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
                <CardContent sx={{ flexGrow: 1, paddingTop: "0" }}>
                  {activeTab === 1 ? (
                    <Typography className="item-category">
                      Security Question: {reportInfo.securityQuestion}
                    </Typography>
                  ) : null}
                  {activeTab === 1 && reportInfo.status.status !== "Claimed" ? (
                    <TextField
                      className="pendingUser-dropdown"
                      select
                      label="Select Pending User"
                      value={
                        selectedPendingUserId === null
                          ? ""
                          : selectedPendingUserId
                      }
                      onChange={(e) => {
                        setSelectedPendingUserId(
                          e.target.value === "" ? null : Number(e.target.value)
                        );
                      }}
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      {reportInfo.status.pendingUsers &&
                        reportInfo.status.pendingUsers.map((user) => (
                          <MenuItem
                            key={user.id}
                            value={user.user}
                            className="pendingUser-item"
                          >
                            {user.username}, Reputation: {user.score}/5 <br />{" "}
                            +65{user.phoneNumber} <br /> Answer:{" "}
                            {user.securityAnswer}
                          </MenuItem>
                        ))}
                    </TextField>
                  ) : null}
                </CardContent>
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
