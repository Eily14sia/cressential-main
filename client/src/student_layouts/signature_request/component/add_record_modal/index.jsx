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
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import MDTypography from '../../../../components/MDTypography';

import React, { useState, useEffect } from 'react';
import axios from 'axios';


function DialogBox({ open, onClose, handleSubmit, cartItems, totalAmount, selectedPurpose, purposeCollege,
  setIsSuccess, setIsError, setAlertMessage, handleCloseDialog, setActiveStep, setData, ctrl_number, setCtrlNumber}) {

  // Retrieve the user_id from localStorage
  const user_id = localStorage.getItem('user_id');
  const [user_data, setUserData] = useState([]);
  const [student_id, setStudentId] = useState(null); // Initialize student_id to null
  const jwtToken = localStorage.getItem('token');

  useEffect(() => {
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/student-management", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to authenticate token");
        }
        return res.json();
      })
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

  const [registrar_data, setRegistrarData] = useState([]);

  useEffect(() => {
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/registrar-management", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to authenticate token");
        }
        return res.json();
      })
      .then((data) => {
        setRegistrarData(data); 
      })
      .catch((err) => console.log(err));
  }, []);

  const CustomSmallCircleIcon  = () => (
    <svg width="8" height="8" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="3" fill="none" stroke="#1A73E8" strokeWidth="2" />
    </svg>
  );
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
          // borderRadius="md"
          // shadow="md"
          // color="light"
          // bgColor="grey-300"
        > 
        <MDBox
          display="flex" alignItems="center"     
        >
          <Icon fontSize="large" color="info">summarize</Icon>
          <MDBox display="flex" flexDirection="column"  px={2}>
          
            <MDTypography variant="caption">Total Amount</MDTypography>
            <MDTypography variant="h5">Php {totalAmount}.00</MDTypography>
          </MDBox>
        </MDBox>
        <MDBox
          display="flex" alignItems="center"  pt={4}
        >
          <CustomSmallCircleIcon />
          <MDTypography variant="h6" sx={{paddingLeft: "15px"}}>Requesting for the following document/s:</MDTypography>
        </MDBox>
          
          <MDBox ml={3}>
                      
                <MDTypography variant="body2" >
                  Signature Request
                </MDTypography>             
           
          
          </MDBox>
          
          <MDBox
          display="flex" alignItems="center"  pt={2}
          >
            <CustomSmallCircleIcon />
            <MDTypography variant="h6" sx={{paddingLeft: "15px"}}>Disclaimer:</MDTypography>
          </MDBox>
          <MDBox
            display="flex"  
          >
          <MDTypography variant="button" ml={3} mt={1}>
            Please note that the expected <b>record release time is typically 15 days</b>, but it may vary depending on various factors. <br/><br/>
            We only accept <b>cashless payments</b> through e-wallets like GCash and Maya, as well as online banking via Union Bank and BPI. <br/><br/>
            <b>Unpaid requests are valid for 3 days</b>. After this period, they will be automatically canceled if payment is not received. 
          </MDTypography> 
         
         </MDBox>
          
          {/* <MDTypography variant="body2" mt={2}> Total Amount: </MDTypography> 
          <MDTypography variant="body2" fontWeight="medium" > Php {totalAmount}</MDTypography>  */}
          
          
        </MDBox>
        {/* <MDBox mt={5} mb={2} px={1} textAlign="left" sx={{ lineHeight: '1' }} >
          <MDTypography variant="caption" color="error" > 
              <b>Note:</b> We only accept cashless payments through e-wallets like GCash and Paymaya, as well as online banking via Union Bank and BPI.
          </MDTypography> 
        </MDBox>
        */}
        
      </DialogContent>
      <MDBox
        component="hr"
        sx={{ opacity: 0.2 }}
      />
      <DialogActions>
        

          <MDButton
            color="info"            
            onClick={handleSubmit}
            >        
              <Icon>send</Icon> &nbsp; Confirm Request
          </MDButton>
        
      </DialogActions>
    </Dialog>
  );
}

export default DialogBox;
