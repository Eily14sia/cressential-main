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
import ProcessingOfficer from '../processing_officer';



function DialogBox({ data, setData, open, onClose, processing_officer, setProcessingOfficer, request_status, setRequest_status, ctrl_number, date_releasing, setdate_releasing
                     , setIsSuccess, setIsError, setAlertMessage, handleCloseUpdateDialog, handleUpdateSubmit}) {

  // Create a new Date object from the date string
  const parsedDate = new Date(date_releasing);

  // Extract date components (month, day, and year)
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const year = parsedDate.getFullYear();

  // Format the date to the desired format (MM/dd/yyyy)
  const new_date_releasing = `${year}-${month}-${day}`;
  const today = new Date(); // Get the current date

 
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
            
            <Grid item>
              <MDBox height="100%" mt={0.5} lineHeight={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  CTRL-{ctrl_number}
                </MDTypography>
                
              </MDBox>
            </Grid>
          </Grid>
          <Grid item textAlign="center" xs={11} mb={1}>            
            <ProcessingOfficer 
              data={data} 
              processing_officer={processing_officer} 
              setProcessingOfficer={setProcessingOfficer}
            />
          </Grid>
          <Grid item textAlign="center" xs={11} >
            <MDInput
              label="Date Releasing"
              type="date"
              value={date_releasing ? new_date_releasing : today}
              onChange={(e) => setdate_releasing(e.target.value)}
              required
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item textAlign="left" xs={11} mb={1} >
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel>Request Status</InputLabel>
            <Select
              style={{ height: "42px" }}
              value={request_status}
              onChange={(e) => setRequest_status(e.target.value)}
              label="Select an option"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Received">Received</MenuItem>
              <MenuItem value="Declined">Declined</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
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
          onClick={handleUpdateSubmit}
        >
            Update Record
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogBox;
