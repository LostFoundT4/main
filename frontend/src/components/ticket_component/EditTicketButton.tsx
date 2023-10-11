import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AxiosInstance from "../../axios/axiosInstance";
import FormHelperText from "@mui/material/FormHelperText";

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

export default function EditTicketButton() {
  const [username, setUsername] = React.useState("");
  const [id, setID] = React.useState(0);

  const [open, setOpen] = React.useState(false);
  const [datetime, setDateTime] = React.useState<Dayjs | null>(dayjs());
  const [type, setType] = React.useState("");
  const [itemName, setItemName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [location, setLocation] = React.useState<Location[]>([]);
  const [description, SetDescription] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState("");
  const [file, SetFile] = React.useState<File>();

  const [checktype, setCheckType] = React.useState(false);
  const [checkitemName, setCheckItemName] = React.useState(false);
  const [checkcategory, setCheckCategory] = React.useState(false);
  const [checklocation, setCheckLocation] = React.useState(false);

  React.useEffect(() => {
    fetchLocation();
  }, []);

  React.useEffect(() => {
    setCheckItemName(false);
  }, [itemName]);

  React.useEffect(() => {
    setCheckCategory(false);
  }, [category]);

  React.useEffect(() => {
    setCheckType(false);
  }, [type]);

  React.useEffect(() => {
    setCheckLocation(false);
  }, [location]);

  React.useEffect(() => {
    AxiosInstance.get("/api/auth/get-user", {
      headers: {
        Authorization: "Token " + localStorage.getItem("authToken"),
      },
    }).then((response) => {
      setUsername(response.data.username);
      setID(response.data.id);
    });
  });

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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) {
      // User cancelled the delete operation
      return;
    }
    
    // Make an API request to delete the ticket using its ID
    // await AxiosInstance.delete(`/items/{ticketID}`, {
    //   headers: {
    //     Authorization: `Token ${localStorage.getItem('authToken')}`,
    //   },
    // }).then(async (response) => {
    //   console.log("Successfully deleted ticket");
    // }).catch((error) => {
    //   console.log("Failed to delete ticket");
    // });

  };
  const handleProcced = async () => {
    await AxiosInstance.post("/tickets/", {
        ticketType: type,
        user: id,
    })
        .then(async (response) => {
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

            await AxiosInstance.post("/items/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(async (response) => {
                    await AxiosInstance.post("/reportInfos/", {
                        ticket: response.data.ticketID,
                        item: response.data.itemID,
                        location: parseInt(selectedLocation),
                        description: description,
                    })
                        .then(async (response) => {
                            await AxiosInstance.post("/status/", {
                                user: id,
                                ticket: response.data.ticket,
                                type: "Pending",
                                endorsedUserID: null,
                            })
                                .then(async (response) => {
                                    console.log(
                                        "succuessfully edited ticket"
                                    );
                                    setOpen(false);
                                })
                                .catch((error) => {
                                    console.log("failed Status");
                                });
                        })
                        .catch((error) => {
                            console.log("failed Reportinfo");
                        });
                })
                .catch((error) => {
                    console.log("failed editing items");
                });
        })
        .catch((error) => {
            console.log("failed editing ticket");
            setCheckItemName(true);
            setCheckCategory(true);
            setCheckLocation(true);
            setCheckType(true);
        });
};

return (
    <div>
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
                        <InputLabel
                            id="TicketType"
                            required
                            error={checktype}
                        >
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
                            <FormHelperText error={checktype}>
                                Type Required
                            </FormHelperText>
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
                        helperText={
                            checkitemName ? "Item Name Required" : ""
                        }
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
                        helperText={
                            checkcategory ? "Category Required" : ""
                        }
                    />
                </Typography>
                <Typography gutterBottom>
                    <FormControl fullWidth>
                        <InputLabel
                            id="location"
                            required
                            error={checklocation}
                        >
                            Location
                        </InputLabel>
                        <Select
                            disabled={false}
                            value={selectedLocation}
                            onChange={(e) =>
                                setSelectedLocation(e.target.value)
                            }
                            error={checklocation}
                        >
                            {location.map((item, index) => (
                                <MenuItem
                                    key={index}
                                    value={item.locationID}
                                >
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
                        onChange={(e) => SetDescription(e.target.value)}
                    />
                </Typography>
                <Typography gutterBottom>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                            components={[
                                "DateTimePicker",
                                "DateTimePicker",
                            ]}
                        >
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
              <Button autoFocus onClick={handleDelete} className="delete-file-btn">
              Delete</Button>
                <Button
                    autoFocus
                    onClick={handleProcced}
                    className="upload-file-btn"
                >
                    Proceed
                </Button>
            </DialogActions>
        </BootstrapDialog>
    </div>
);
}
