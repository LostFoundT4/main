import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function CreateTicketButton() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const [type, setType] = React.useState('');


  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event:any) => {
    setType(event.target.value);
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
        onClick={handleClickOpen}>
        <AddIcon />
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Creating New Ticket
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
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
              <InputLabel id="TicketType">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="TicketType"
                onChange={handleChange}
              >
                <MenuItem value={"Lost"}>Lost</MenuItem>
                <MenuItem value={"Found"}>Found</MenuItem>
              </Select>
            </FormControl>
          </Typography>
          <Typography gutterBottom>
            <TextField id="outlined-basic" label="ItemName" variant="outlined" />
          </Typography>
          <Typography gutterBottom>
            <TextField id="outlined-basic" label="Category" variant="outlined" />
          </Typography>
          <Typography gutterBottom>
            <TextField id="outlined-basic" label="Location" variant="outlined" />
          </Typography>
          <Typography gutterBottom>
            <TextField
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows={4}
          />
          </Typography>
          <Typography gutterBottom>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                  <DateTimePicker
                    label="Date"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                  />
                </DemoContainer>
              </LocalizationProvider>
          </Typography>
          <Typography gutterBottom>
          <Button
              variant="contained"
              component="label"
            >
            Upload File
            <input
              type="file"
              hidden
            />
          </Button>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}