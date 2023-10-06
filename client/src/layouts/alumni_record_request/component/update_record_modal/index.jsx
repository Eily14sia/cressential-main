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
                     , setIsSuccess, setIsError, setAlertMessage, handleCloseUpdateDialog}) {

                      
  // Function to handle update record form submission
  const handleUpdateSubmit = async (event, new_ctrl_number) => {
    event.preventDefault();
    // Create an updated record object to send to the server
    const updatedRecord = {
      date_releasing: date_releasing,
      processing_officer: processing_officer,
      request_status: request_status,      
    };
    try {
      const response = await fetch(`http://localhost:8081/mysql/update-record-request/${new_ctrl_number}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecord),
      });

      if (response.ok) {
        handleCloseUpdateDialog();
        setIsSuccess(true);
        setAlertMessage('Record updated successfully.');

        // Fetch updated data and update the state
        fetch("http://localhost:8081/mysql/payment-alumni-record-request")
          .then((res) => res.json())
          .then((data) => {
            setData(data); // Set the fetched data into the state
          })
          .catch((err) => console.log(err));
      } else {
        setAlertMessage('Failed to update record');
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    }
  };



  // Create a new Date object from the date string
  const parsedDate = new Date(date_releasing);

  // Extract date components (month, day, and year)
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const year = parsedDate.getFullYear();

  // Format the date to the desired format (MM/dd/yyyy)
  const new_date_releasing = `${year}-${month}-${day}`;

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
              value={new_date_releasing}
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
          onClick={(event) => handleUpdateSubmit(event, ctrl_number)}
        >
            Update Record
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogBox;
