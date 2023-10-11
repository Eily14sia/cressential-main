import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import MDTypography from '../../../../components/MDTypography';

import React, { useState, useEffect } from 'react';
import axios from 'axios';


function DialogBox({ open, onClose, cartItems, totalAmount, selectedPurpose, purposeCollege,
  setIsSuccess, setIsError, setAlertMessage, handleCloseDialog, setActiveStep, setData, ctrl_number, setCtrlNumber}) {

  // Extract the IDs and join them with commas
  const record_id = cartItems.map(item => item.id).join(',');

  // Retrieve the user_id from localStorage
  const user_id = localStorage.getItem('user_id');
  const [user_data, setUserData] = useState([]);
  const [student_id, setStudentId] = useState(null); // Initialize student_id to null

  useEffect(() => {
    fetch("http://localhost:8081/mysql/student-management")
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Add a conditional check for user_data before finding student_id
  useEffect(() => {
    if (user_data.length > 0) {
      const foundStudent = user_data.find((item) => item.user_id == user_id);
      if (foundStudent) {
        setStudentId(foundStudent.id);
      }
    }
  }, [user_data, user_id]);

  // Function to handle add record form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Create a new record object to send to the server
    const newRecord = {
      record_id: record_id,
      student_id: student_id,
      purpose: selectedPurpose,   
      total_amount: totalAmount
    };
    
    try {
      const response = await fetch('http://localhost:8081/mysql/record-request/add-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecord),
      });

      if (response.ok) {
        handleCloseDialog();
        setIsSuccess(true);
        setAlertMessage('Record added successfully.');

        const data_ctrl_number = await response.json();
        const ctrl_num = data_ctrl_number.ctrl_number; // Retrieve the ctrl_number from the response
        setCtrlNumber(ctrl_num);

        // Fetch updated data and update the state
        fetch("http://localhost:8081/mysql/record-request")
        .then((res) => res.json())
        .then((data) => {
          setData(data); // Set the fetched data into the state
        })
        .catch((err) => console.log(err));

        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      } else {
        setAlertMessage('Failed to update record');
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    }

    try {
      const tAmount = parseInt(totalAmount, 10);
      const response = await axios.post('http://localhost:8081/payments/paymongoIntent', {
        amount: tAmount * 100,
      });

      if (response.data && response.data.redirectUrl) {
        setRedirectUrl(response.data.redirectUrl);
        setPaymentResponse(response.data.paymentResponse);
      } else {
        console.error('Invalid response from the server');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirmation
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
      <MDBox
          p={3}
          justifyContent="center"
          alignItems="center"
          borderRadius="md"
          shadow="md"
          color="light"
          bgColor="grey-300"
        >
          <MDTypography variant="body2" >You are requesting for the following document/s:</MDTypography>           
          
          <MDBox ml={5}>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} >
                <MDTypography variant="body2" fontWeight="medium" >
                  {item.type}
                </MDTypography>
              </li>
            ))}
          </ul>
          </MDBox>
          <MDTypography variant="body2" mt={2} > Purpose: 
          <MDTypography variant="body2" fontWeight="medium" > {selectedPurpose + " " + purposeCollege} </MDTypography> 
          </MDTypography> 
          
          <MDTypography variant="body2" mt={2}> Total Amount: </MDTypography> 
          <MDTypography variant="body2" fontWeight="medium" > Php {totalAmount}</MDTypography> 
          
          
        </MDBox>
        <MDBox mt={5} mb={2} px={1} textAlign="left" sx={{ lineHeight: '1' }} >
          <MDTypography variant="caption" color="error" > 
              <b>Note:</b> We only accept cashless payments through e-wallets like GCash and Paymaya, as well as online banking via Union Bank and BPI.
          </MDTypography> 
        </MDBox>
       
        
      </DialogContent>
      <MDBox
        component="hr"
        sx={{ opacity: 0.2 }}
      />
      <DialogActions>
        <MDButton variant="text" onClick={onClose} color="secondary">
          Cancel
        </MDButton>
        <MDButton
          variant="contained"
          color="info"
          onClick={handleSubmit}>        
            <Icon>send</Icon> &nbsp; Submit
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogBox;
