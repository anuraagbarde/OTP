import { Button, DialogContentText } from "@mui/material";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

const DialogBox = ({ message, open, setOpen }) => {
  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          style={{ color: "rgba(255,0,0,0.7)" , marginTop: '3%', }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          style={{
            backgroundColor: "black",
            color: "white",
            borderRadius: 50,
            marginRight: '3%',
            marginBottom: '3%',
            padding: "5px 15px",
          }}
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
