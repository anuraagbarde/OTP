import {  Button, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

const PopBox = ({ msg, open  = false,setOpen }) => {
  const handleClose = () => setOpen(false)

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='xs'
    >
      <DialogTitle id='alert-dialog-title'>Error !!</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {msg}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default PopBox
