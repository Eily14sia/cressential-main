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



function DialogBox({ open, onClose, onSubmit, recordType, setRecordType, recordIPFS, setRecordIPFS, 
recordID, recordStatus, setRecordStatus, recordPassword, setRecordPassword, payment_status, ctrl_number,
setAlertMessage, setIsError, setIsSuccess, handleCloseUpdateDialog, data, setData}) {


// =========== For the datatable =================
const [selectedFile, setSelectedFile] = useState(null);
const [errorMessage, setErrorMessage] = useState('');
const [uploadedCID, setUploadedCID] = useState(null);
const [finalCID, setFinalCID] = useState('');
const [multihash, setMultihash] = useState(null); // Added state for multihash


const handleFileChange = (e) => {
  const file = e.target.files[0];
  setSelectedFile(file);
  setUploadedCID(null); // Clear the uploaded CID
  setErrorMessage('');
  setMultihash(null); // Clear the multihash
};

const handleFileUpload = async () => {
  if (selectedFile) {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8081/files/api/maindec', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.encrypted) {
        // File is encrypted, proceed with the upload
        setUploadedCID(response.data.cid);
        setMultihash(response.data.multihash); // Set the multihash
        setFinalCID(response.data.cid);
        console.log(response.data.cid);
        handleUpdateSubmit();
        // Reset the selectedFile state to clear the file input
        setSelectedFile(null);
        
      } else {
        // File is not encrypted, display an error message
        setErrorMessage('Only encrypted files are allowed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Error uploading file. Please try again.');
    }
  } else {
    // If no file is selected, display an error message
    setErrorMessage('Please choose an encrypted PDF file first.');
  }
};
  // // Callback function to update the total amount
  // const updateSelectedItemID = (newSelectedItemID) => {
  //   setSelectedItemID(newSelectedItemID);
  // };

  const dateIssued = new Date();

  const handleUpdateSubmit = async () => {
    // Create an updated record object to send to the server

    const updatedRecord = {
      recordPassword: recordPassword,
      uploadedCID: finalCID,
      recordStatus: recordStatus,
      dateIssued: dateIssued
    };

    try {
      const response = await fetch(`http://localhost:8081/mysql/update-record-per-request/${recordID}`, {
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
        fetch(`http://localhost:8081/mysql/record-per-request/${ctrl_number}`)
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
          <Grid item textAlign="center" xs={11} mt={3}>
            <MDInput
              label="Password"
              type="password"
              value={recordPassword || ''}
              onChange={(e) => setRecordPassword(e.target.value)}
              required
              sx={{ width: '100%' }}
              disabled={recordPassword != null || payment_status === "Unpaid" ? true : false}
            />
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
          <Grid item textAlign="center" xs={11} >
            <MDInput fullWidth
              type="file"
              id="fileUpload"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={(recordIPFS != null || payment_status === "Unpaid") ? true : false}
            />          
            
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
          onClick={handleFileUpload} 
        >
            Update Record
        </MDButton>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </DialogActions>
    </Dialog>
  );
}

export default DialogBox;
