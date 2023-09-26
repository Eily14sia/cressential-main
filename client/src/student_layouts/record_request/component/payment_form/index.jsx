import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
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

// Material Dashboard 2 React example components
import DataTable from "../../../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";
import DocumentSelection from "../document_selection";
import DialogBox from '../add_record_modal';

import { useMaterialUIController } from "../../../../context";
import CustomInfoCard from '../../../../examples/Cards/InfoCards/CustomInfoCard';

import axios from 'axios';

const index = ( {totalAmount, cartItems}) => {

    const [controller] = useMaterialUIController();
   const [redirectUrl, setRedirectUrl] = useState('');
  // const [paymentResponse, setPaymentResponse] = useState(null);
    
    const [selectedOption, setSelectedOption] = useState('');
  
    const handleOptionClick = (option) => {
      setSelectedOption(option);
    };

    console.log(selectedOption);
    console.log(totalAmount);

    const handleProceedToPayment = async () => {
      try {
        // Send the selected payment method to the backend
        const response = await axios.post('http://localhost:8081/payments/paymongoMethod', {
          selectedOption,
        });
  
        // Handle the response from the backend if needed
        console.log('Response from the backend:', response.data);
  
        // Redirect the user to the payment method page
        window.location.href = response.data.redirectUrl;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const handleRedirect = () => {
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
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
                          />
                        </Grid>
                        <Grid item xs={12} md={6} xl={4}>
                          <CustomInfoCard
                            icon="paypal"
                            title="Maya"
                            name="paymaya"
                            handleOptionClick={handleOptionClick}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} xl={4}>
                          <CustomInfoCard
                            icon="paypal"
                            title="Online Bank"
                            name="dob"
                            handleOptionClick={handleOptionClick}
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
                     
                        {cartItems.map((item) => (
                          <>
                            <Grid item xs={9}>
                              <MDTypography variant="body2" color="text">
                                {item.type}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={3}>
                              <MDTypography variant="body2" fontWeight="bold"> 
                                {item.price+".00"}
                              </MDTypography>
                            </Grid>
                          </>
                        ))}
                      
                      <Grid item xs={9} mt={5}>
                        <MDTypography variant="body2" color="text" fontWeight="bold">
                          Total:
                        </MDTypography>
                      </Grid>
                      <Grid item xs={3} mt={5}>
                        <MDTypography variant="body2" fontWeight="bold">
                          {totalAmount}
                        </MDTypography>
                      </Grid>
                    
                    </Grid>
                  </MDBox>
              {/* END OF PURPOSE */}
              {redirectUrl && (
        <div>
          <h2>Redirecting...</h2>
          <button onClick={handleRedirect}>Click here to proceed with payment</button>
        </div>
      )}
              <Grid container spacing={2} px={3}>
                  <Grid item xs={7}></Grid>
                  <Grid item xs={5} sx={{marginTop:"20px", marginBottom:"20px"}} >
                      <MDButton onClick={handleProceedToPayment} variant="gradient" color="info" size="large" fullWidth >
                          <Icon>payment</Icon> &nbsp; Pay {totalAmount}
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