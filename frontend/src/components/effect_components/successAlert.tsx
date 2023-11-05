import { Alert, Snackbar } from "@mui/material";
import * as React from "react";

// Success Alert
export const SuccessAlert = () => {

    const [openSuccessAlert, setSuccessAlert] = React.useState(true);

    const handleCloseSuccessAlert = (
      event?: React.SyntheticEvent | Event,
      reason?: string
    ) => {
      if (reason === "clickaway") {
        return;
      }
      setSuccessAlert(false);
    };
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
          Operation done Successfully 
        </Alert>
      </Snackbar>
    );
};