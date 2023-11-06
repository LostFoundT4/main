import { Alert, Snackbar } from "@mui/material";
import * as React from "react";

// Error Alert
export const ErrorAlert = () => {

  const [openErrorAlert, setErrorAlert] = React.useState(true);

  const handleCloseErrorAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorAlert(false);
  };

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