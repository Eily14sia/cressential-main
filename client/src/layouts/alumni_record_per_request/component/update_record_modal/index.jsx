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



function DialogBox({ open, onClose, onSubmit, recordType, setRecordType, recordIPFS, setRecordIPFS, recordId, recordStatus, setRecordStatus, recordPassword, setRecordPassword}) {


// =========== For the datatable =================
const [data, setData] = useState([]);

useEffect(() => {
  fetch("http://localhost:8081/mysql/registrar-management")
    .then((res) => res.json())
    .then((data) => {
      setData(data); // Set the fetched data into the state
    })
    .catch((err) => console.log(err));
}, []);  

  // // Callback function to update the total amount
  // const updateSelectedItemID = (newSelectedItemID) => {
  //   setSelectedItemID(newSelectedItemID);
  // };
  
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
                  {recordType}
                </MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  {recordIPFS}
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
          <Grid item textAlign="center" xs={11} >
            <MDInput
              label="Password"
              type="text"
              value={recordPassword || ''}
              onChange={(e) => setRecordPassword(e.target.value)}
              required
              sx={{ width: '100%' }}
              disabled={recordPassword != null ? true : false}
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
              accept=".jpg, .png, .jpeg"
              // Add more props as needed
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
          onClick={onSubmit} 
        >
            Update Record
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogBox;
