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
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
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
  room: number;
}

export default function CreateTicketButton() {
  // Context for user data
  const { contextID, setContextID } = useContext(UserIDContext);

  // Define states for form fields
  const [open, setOpen] = useState(false);
  const [datetime, setDateTime] = useState<Dayjs | null>(dayjs());
  const [type, setType] = useState("");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState<Location[]>([]);
  const [description, setDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [file, setFile] = useState<File>();

  // Define states for form field validations
  const [checktype, setCheckType] = useState(false);
  const [checkitemName, setCheckItemName] = useState(false);
  const [checkcategory, setCheckCategory] = useState(false);
  const [checklocation, setCheckLocation] = useState(false);

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    setCheckItemName(false);
    setErrorAlert(false);
  }, [itemName]);

  useEffect(() => {
    setCheckCategory(false);
    setErrorAlert(false);
  }, [category]);

  useEffect(() => {
    setCheckType(false);
    setErrorAlert(false);
  }, [type]);

  useEffect(() => {
    setCheckLocation(false);
    setErrorAlert(false);
  }, [location]);

  function handleimage(e: any) {
    setFile(e.target.files[0]);
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

  const handleProceed = async () => {
    // Create a ticket
    await AxiosInstance.post("/tickets/", {
      ticketType: type,
      user: contextID,
    })
      .then(async (response) => {
        // Create and fill up formData
        const formData = new FormData();
        formData.append("ticketID", response.data.ticketID);
        formData.append("itemName", itemName);
        formData.append("category", category);
        if (file?.type !== undefined) {
          formData.append("image", file!);
        }
        formData.append(
          "found_dateTime",
          datetime?.format("YYYY-MM-DDTHH:mm:ss[Z]")!
        );

        // Create an item associated with the ticket
        await AxiosInstance.post("/items/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then(async (response) => {
            const itemID = response.data.itemID;
            let ticketType = "Unclaimed"
            if (type === "Lost"){
              ticketType = "Lost"
            }
            // Step 7: Create a status entry for the item
            await AxiosInstance.post("/status/", {
              user: contextID,
              ticket: response.data.ticketID,
              status: ticketType,
              endorsedUserID: null,
              counter: 0,
              previous_counter: 0,
            })
              .then(async (response) => {
                // Create a report info associated with the item
                console.log(description)
                const statusID = response.data.statusID;
                await AxiosInstance.post("/reportInfos/", {
                  ticket: response.data.ticket,
                  item: parseInt(itemID),
                  location: parseInt(selectedLocation),
                  description: description,
                  status: statusID,
                })
                  .then(async (response) => {
                    // Log success and close the form
                    if (response.data === 404) {
                      console.log("Failed to create a report info");
                      setErrorAlert(true);
                    }
                    else {
                      setSuccessAlert(true);
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    }
                  })
              })  
          })
      })
      .catch((error) => {
        // Log failure and set flags for validation checks
        console.log("Failed to create a ticket");
        setErrorAlert(true);
        setCheckItemName(true);
        setCheckCategory(true);
        setCheckLocation(true);
        setCheckType(true);
      });
  };

  return (
    <div>
      <SuccessAlert />
      <ErrorAlert />
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
        <AddIcon />
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className="add-item-container"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          CREATE NEW TICKET
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
          <Button autoFocus onClick={handleProceed} className="upload-file-btn">
            Proceed
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
