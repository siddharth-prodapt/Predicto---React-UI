import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface AlertModalProps {
  open: boolean;
  message: string;
  handleClose: () => void;
  handleYes: () => void;
  handleNo: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ open, message, handleClose, handleYes, handleNo }) => {
  return (
    <Dialog open={open} onClose={handleClose}
      onKeyUp={(e) => {
        const ENTER = 13;
        console.log(e.keyCode)
        if (e.keyCode === ENTER) {
          handleYes()
          // handleYes
        }
      }}
    >
      <DialogTitle>Alert</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleYes} color="primary">
          Yes
        </Button>
        <Button onClick={handleNo} color="primary">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertModal;