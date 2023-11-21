import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate} from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import MDAlert from "../../../../components/MDAlert";

import { useMaterialUIController } from "../../../../context";
import CustomInfoCard from '../../../../examples/Cards/InfoCards/CustomInfoCard';

import axios from 'axios';

const index = ( {totalAmount, cartItems, ctrl_number, setActiveStep, setAlertMessage, setIsError}) => {
  const jwtToken = localStorage.getItem('token');
   const [controller] = useMaterialUIController();
   const [redirectUrl, setRedirectUrl] = useState('');
  // const [paymentResponse, setPaymentResponse] = useState(null);
    
    const [selectedOption, setSelectedOption] = useState('');
  
    const handleOptionClick = (option) => {
      setSelectedOption(option);
    };

    const handleProceedToPayment = async () => {
      setAlertMessage('');
      setIsError(false);
      if (selectedOption) {
        try {
          // Send the selected payment method to the backend
          const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/payments/signature/paymongoMethod', {
            selectedOption,
            totalAmount,
            ctrl_number,
            jwtToken
          });
      
          // Handle the response from the backend if needed
          console.log('Response from the backend:', response.data);
      
          // Open the payment method page in a new tab
          window.open(response.data.redirectUrl, '_blank');
          setActiveStep(2);
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        // Handle the case when there's no selected payment option (e.g., display an error message).
        console.error('No payment option selected.');
        // Display an error message using MDAlert
        setAlertMessage('Please select a payment option.'); // Set your error message
        setIsError(true);
      }      
    };

    const handleRedirect = () => {
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    };

   const navigate = useNavigate();
    const goBack = () => {    
      navigate(-1);
    };

  return (
    <>
        <MDBox pt={2} pb={3} px={5}>
            <Grid container spacing={4} justifyContent="center">

              {/* LEFT COLUMN */}                  
              <Grid item lg={7} textsm={12}>     

                  {/* Payment Method */}
                  <MDBox   
                  p={3}
                  mb={1}
                  >
                  <Grid container spacing={2}>                    
                      <Grid item xs={12} sx={{marginBottom:"10px"}}>
                        <MDTypography fontWeight={"bold"}>Payment Method</MDTypography>                
                      </Grid>  

                      <Grid container spacing={2} margin={"auto"}>
                        <Grid item xs={12} md={6} xl={4}> 
                          <CustomInfoCard
                            icon="account_balance"
                            title="GCash"
                            name="gcash"
                            handleOptionClick={handleOptionClick}    
                            selectedOption={selectedOption}                                                  
                          />
                        </Grid>
                        <Grid item xs={12} md={6} xl={4}>
                          <CustomInfoCard
                            icon="paypal"
                            title="Maya"
                            name="paymaya"
                            handleOptionClick={handleOptionClick}
                            selectedOption={selectedOption} 
                          />
                        </Grid>
                        <Grid item xs={12} md={6} xl={4}>
                          <CustomInfoCard
                            icon="payments"
                            title="Online Bank"
                            name="dob"
                            handleOptionClick={handleOptionClick}
                            selectedOption={selectedOption} 
                          />
                        </Grid>
                        
                      </Grid>

                  </Grid>
                  </MDBox>
              
                
              
                  {/* PURPOSE */}
                  <MDBox                        
                  sx={{ border: '1px solid #f0f2f5' }}
                  borderRadius="lg"
                  px={3}
                  paddingBottom={2}
                  mx={3}
                  mt={2}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} mt={2}>
                        <MDTypography variant="h6" fontWeight="bold">
                          Request Summary
                        </MDTypography>
                      </Grid>
                     
                        
                            <Grid item xs={9}>
                              <MDTypography variant="body2" color="text">
                                Signature Request
                              </MDTypography>
                            </Grid>
                            <Grid item xs={3}>
                              <MDTypography variant="body2" fontWeight="bold"> 
                                {totalAmount}.00
                              </MDTypography>
                            </Grid>
                          
                      
                      <Grid item xs={9} mt={5}>
                        <MDTypography variant="body2" color="text" fontWeight="bold">
                          Total:
                        </MDTypography>
                      </Grid>
                      <Grid item xs={3} mt={5}>
                        <MDTypography variant="body2" fontWeight="bold">
                          {totalAmount}.00
                        </MDTypography>
                      </Grid>
                    
                    </Grid>
                    
                  </MDBox>
                  <MDBox
                    display="flex"  
                    mx={3}
                  >
                  <MDTypography variant="caption" ml={1} mt={3}>
                    You will be redirected externally to your selected payment option. Please click <b>Pay button</b> to continue, otherwise click <b>Hold Payment button</b> to pay it at a later time within 3 days. <br/><br/>
                    
                  </MDTypography> 
         
         </MDBox>
              {/* END OF PURPOSE */}
              {redirectUrl && (
        <div>
          <h2>Redirecting...</h2>
          <button onClick={handleRedirect}>Click here to proceed with payment</button>
        </div>
      )}
              <Grid container spacing={5} my={2} px={3} justifyContent="center">
                  
                  <Grid item md={6} sm={12}>                      
                    <MDButton onClick={goBack} variant="gradient" color="secondary" size="large" fullWidth >
                        <Icon>arrow_back</Icon> &nbsp; Hold Payment
                    </MDButton>                      
                  </Grid>
                  
                  <Grid item md={6} sm={12}>
                      <MDButton onClick={handleProceedToPayment} variant="gradient" color="info" size="large" fullWidth >
                          <Icon>payment</Icon> &nbsp; Pay {totalAmount}.00
                      </MDButton>

                  </Grid>
              </Grid>            
              </Grid>
            </Grid>
        </MDBox>
    </>
  )
}

export default index