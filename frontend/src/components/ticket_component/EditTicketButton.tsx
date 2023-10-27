import * as React from "react";
import {
  Button,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import AxiosInstance from "../../utils/axiosInstance";
import { UserIDContext, UserNameContext } from "../../utils/contextConfig";
import { useContext, useEffect, useState } from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface Location {
  locationID: number;
  building: string;
  room: string;
}

interface ReportInfo {
  reportInfoID: number;
  description: string;
  securityQuestion: string;
  securityAnswer: string;
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
    ticket: {
      ticketID: number;
      ticketType: string;
      created_dateTime: string;
    };
    status: string;
    endorsedUserID: number;
    counter: number;
    previous_counter: number;
    timer: string;
  };
}

export default function EditTicketButton({
  myTicket,
  myItemID,
}: {
  myTicket: any;
  myItemID: any;
}) {
  // Context for user data
  const { contextID, setContextID } = useContext(UserIDContext);
  const { contextName, setContextName } = useContext(UserNameContext);

  // Define states for form fields
  const [open, setOpen] = useState(false);
  const [datetime, setDateTime] = useState<Dayjs | null>(dayjs());
  const [type, setType] = useState("");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState<Location[]>([]);
  const [description, setDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [file, SetFile] = useState<File>();

  const [filteredReport, setFilteredReport] = useState<ReportInfo>();

  // Define states for form field validations
  const [checktype, setCheckType] = useState(false);
  const [checkitemName, setCheckItemName] = useState(false);
  const [checkcategory, setCheckCategory] = useState(false);
  const [checklocation, setCheckLocation] = useState(false);
  const [checksecurityQuestion, setCheckSecurityQuestion] = useState(false);

  useEffect(() => {
    fetchLocation();
    AxiosInstance.get("/reportInfos/").then((response) => {
      const filtered = response.data.filter(
        (ReportInfo: ReportInfo) =>
          ReportInfo.item.itemID === myItemID &&
          ReportInfo.ticket.ticketID === myTicket.ticketID
      );
      setFilteredReport(filtered[0]);
      setType(filtered[0]!.ticket.ticketType);
      setItemName(filtered[0]!.item.itemName);
      setCategory(filtered[0]!.item.category);
      setDescription(filtered[0]!.description);
      setSelectedLocation(filtered[0]!.location.locationID);
      setDateTime(dayjs(filtered[0]!.item.found_dateTime));
      SetFile(filtered[0]!.item.image);
      setSecurityQuestion(filtered[0]!.securityQuestion);
    });
  }, []);

  useEffect(() => {
    setCheckItemName(false);
  }, [itemName]);

  useEffect(() => {
    setCheckCategory(false);
  }, [category]);

  useEffect(() => {
    setCheckType(false);
  }, [type]);

  useEffect(() => {
    setCheckLocation(false);
  }, [location]);

  useEffect(() => {
    setCheckSecurityQuestion(false);
    setErrorAlert(false);
  }, [securityQuestion]);

  function handleimage(e: any) {
    SetFile(e.target.files[0]);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: any) => {
    setType(event.target.value);
  };

  const fetchLocation = async () => {
    await AxiosInstance.get("/locations/").then((response) => {
      setLocation(response.data);
    });
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
            Ticket has been created!
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

  const handleDelete = async () => {
    // User cancelled the delete operation
    if (!window.confirm("Are you sure you want to delete this ticket?")) {
      return;
    }

    // Make an API request to delete the ticket using its ID
    await AxiosInstance.delete("/tickets/" + myTicket.ticketID, {
      headers: {
        Authorization: "Token " + localStorage.getItem("authToken"),
      },
    })
      .then(async (response) => {
        window.location.reload();
      })
      .catch((error) => {
        setErrorAlert(true);
      });
  };

  const handleEdit = async () => {
    //Need to edit bad request
    await AxiosInstance.put("/reportInfos/" + filteredReport!.reportInfoID, {
      description: description,
      location: filteredReport?.location.locationID,
      item: filteredReport?.item.itemID,
      ticket: filteredReport?.ticket.ticketID,
      status: filteredReport?.status.statusID,
      securityQuestion: securityQuestion,
    })
      .then(async (response) => {
        // Create and fill up formData
        const formData = new FormData();
        formData.append("itemName", itemName);
        formData.append("category", category);
        if (file?.type !== undefined) {
          formData.append("image", file!);
        }
        formData.append(
          "found_dateTime",
          datetime?.format("YYYY-MM-DDTHH:mm:ss[Z]")!
        );

        // Update the item in its /items ID using the filled formData
        await AxiosInstance.put("/items/" + myItemID, formData, {
          headers: {
            "Content-Type": "multipart/form-myTicket",
          },
        })
          .then(async (response) => {
            // Update the item in its /tickets ID using the filled formData
            await AxiosInstance.put("/tickets/" + myTicket.ticketID, {
              ticketType: type,
              user: contextID,
            });
          })
          .then(async (response) => {
            setOpen(false);
            window.location.reload();
          });
      })
      .catch((error) => {
        setErrorAlert(true);
      });
  };

  return (
    <div>
        <SuccessAlert/>
        <ErrorAlert/>
      <Button
        variant="contained"
        className="add-item-button"
        style={{
          position: "absolute",
          top: "16px", // Adjust the top value as needed
          right: "16px", // Adjust the right value as needed
        }}
        onClick={handleClickOpen}
      >
        EDIT
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className="add-item-container"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          EDIT TICKET
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            <FormControl fullWidth>
              <InputLabel id="TicketType" required error={checktype}>
                Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="TicketType"
                onChange={handleChange}
                error={checktype}
              >
                <MenuItem value={"Lost"}>Lost</MenuItem>
                <MenuItem value={"Found"}>Found</MenuItem>
              </Select>
              {checktype ? (
                <FormHelperText error={checktype}>Type Required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </Typography>
          <Typography gutterBottom>
            <TextField
              id="outlined-basic"
              label="ItemName"
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              error={checkitemName} // Set error prop based on validation
              helperText={checkitemName ? "Item Name Required" : ""}
            />
          </Typography>
          <Typography gutterBottom>
            <TextField
              id="outlined-basic"
              label="Category"
              variant="outlined"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              error={checkcategory} // Set error prop based on validation
              helperText={checkcategory ? "Category Required" : ""}
            />
          </Typography>
          <Typography gutterBottom>
            <FormControl fullWidth>
              <InputLabel id="location" required error={checklocation}>
                Location
              </InputLabel>
              <Select
                disabled={false}
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                error={checklocation}
              >
                {location.map((item, index) => (
                  <MenuItem key={index} value={item.locationID}>
                    {item.building} Room {item.room}
                  </MenuItem>
                ))}
              </Select>
              {checklocation ? (
                <FormHelperText error={checklocation}>
                  Location Required
                </FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </Typography>
          <Typography gutterBottom>
            <TextField
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Typography>
          <Typography gutterBottom>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
                <DateTimePicker
                  label="Date"
                  value={datetime}
                  onChange={(e) => setDateTime(e)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Typography>
          {type === "Found" && (
            <>
              <Typography gutterBottom>
                <TextField
                  id="security-question"
                  label="Security Question"
                  variant="outlined"
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  required
                  error={checksecurityQuestion} // Set error prop based on validation
                  helperText={checksecurityQuestion ? "Security Question Required" : ""}
                />
              </Typography>
            </>
          )}

          <Typography gutterBottom>
            <Button
              variant="contained"
              component="label"
              className="upload-file-btn"
            >
              Upload Image
              <input type="file" onChange={handleimage} hidden />
            </Button>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDelete} className="upload-file-btn">
            Delete
          </Button>
          <Button autoFocus onClick={handleEdit} className="upload-file-btn">
            Edit
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
