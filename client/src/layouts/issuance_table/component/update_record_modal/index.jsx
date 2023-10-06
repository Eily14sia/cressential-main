import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Icon from "@mui/material/Icon";


// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import MDTypography from '../../../../components/MDTypography';
import MDAvatar from '../../../../components/MDAvatar';
import DocumentSelection from '../processing_officer';

import axios from 'axios';



function DialogBox({ open, onClose, recordType, recordIPFS, 
recordStatus, setRecordStatus, handleUpdateSubmit}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Record
        <IconButton
          sx={{
            position: 'absolute',
            right: '20px',
            top: '8px',
          }}
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <MDBox
        component="hr"
        sx={{ opacity: 0.2 }} // Adjust this value to control the opacity level
      />
      <DialogContent>
        <Grid container justifyContent="center" alignItems="center">
          
          <Grid item textAlign="center" xs={12} mb={2}>
            
            <Grid item  mt={3}>
              <MDBox height="100%" mt={0.5} lineHeight={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  {recordType}
                </MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular" >
                  {recordIPFS}
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
         
          <Grid item textAlign="left" xs={11} mb={1} >
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select style={{ height: "42px" }}
                value={recordStatus}
                onChange={(e) => setRecordStatus(e.target.value)}
              >
                <MenuItem value="Valid">Valid</MenuItem>
                <MenuItem value="Invalid">Invalid</MenuItem>
              </Select>
            </FormControl>
            
          </Grid>
          
        </Grid>
      </DialogContent>
      <MDBox
        component="hr"
        sx={{ opacity: 0.2 }}
      />
      <DialogActions>
        <MDButton onClick={onClose} color="secondary">
          Cancel
        </MDButton>
        <MDButton
          variant="contained"
          color="info"
          type="submit"
          onClick={handleUpdateSubmit} 
        >
            Update Record
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogBox;
