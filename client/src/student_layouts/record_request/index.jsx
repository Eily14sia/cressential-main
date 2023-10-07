import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import { useLocation } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDInput from "../../components/MDInput";
import MDAlert from "../../components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";
import DocumentSelection from "./component/document_selection";
import DialogBox from './component/add_record_modal';
import RequestForm from './component/request_form';
import PaymentForm from './component/payment_form';
import axios from 'axios';

import { useMaterialUIController } from "../../context";

function Record_request() {

  const [cartItems, setCartItems] = useState([]);
  const [type_of_record, setTypeOfRecord] = useState([]);
  const [ctrl_number, setCtrlNumber] = useState('');

  useEffect(() => {
    fetch("http://localhost:8081/mysql/type-of-record")
      .then((res) => res.json())
      .then((type_of_record) => {
        setTypeOfRecord(type_of_record); // Set the fetched registrar_data into the state
      })
      .catch((err) => console.log(err));
  }, []);


  const [controller] = useMaterialUIController();
  const [totalAmount, setTotalAmount] = useState(0);

  const location = useLocation();

  const activeSteps = location.state?.activeStep || 0;
  const stateAmount= location.state?.total_amount;
  const stateRecordIDs = location.state?.recordIDs;
  const stateCtrlNumber = location.state?.ctrl_number;

  // Split the comma-separated IDs into an array
  const recordIDsArray = stateRecordIDs ? stateRecordIDs.split(',') : [];
  
  // Initialize an array to store the cart items
  const newCartItems = [];

  useEffect(() => {
    if (stateAmount) {
      setTotalAmount(stateAmount+".00");      
    }
  }, [stateAmount]); 

  useEffect(() => {
    if (stateCtrlNumber) {
      setCtrlNumber(stateCtrlNumber);   
      handlePaymentIntent(stateAmount);     
    }
  }, [stateCtrlNumber]);
  
  const handlePaymentIntent = async (total_amount) => {

    try {
      const tAmount = parseInt(total_amount, 10);
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
  }
  


  useEffect(() => {
  if (stateRecordIDs) {
    const newCartItems = recordIDsArray.map((id) => {
      const new_id = parseInt(id);
      const type = type_of_record.find((item) => item.id === new_id)?.type;
      const price = type_of_record.find((item) => item.id === new_id)?.price;

      // If type and price are found, create and return a new item
      if (type && price) {
        return {
          id: id,
          type: type,
          price: price,
        };
      }
      return null; // Return null for items that couldn't be found
    }).filter(Boolean); // Remove null values from the array

    setCartItems((prevCartItems) => [...prevCartItems, ...newCartItems]);
  }
}, [stateRecordIDs, type_of_record]);

  // =========== For the MDAlert =================
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );

  const [activeStep, setActiveStep] = useState(activeSteps ? activeSteps : 0);

  const steps = [
    'Request Form',
    'Payment',
    'Completed',
  ];




  return (
    <DashboardLayout>
      <DashboardNavbar />
        <MDBox pt={6} pb={3}>          
          <Grid container spacing={6}>
            <Grid item xs={12}>
              {isSuccess && (
                <MDAlert color="success" dismissible sx={{marginBottom: '50px'}} onClose={() => setIsSuccess(false)}>
                      {alertContent("success", alertMessage)}
                </MDAlert>
              )}
              {isError && (
                <MDAlert color="error" dismissible onClose={() => setIsError(false)}>
                  {alertContent("error", alertMessage)}
                </MDAlert>
              )}
              <Card>              
              <MDBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="success"
                mx={2}
                mt={-3}
                mb={1}
                textAlign="center"
              >
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </MDBox>

              {steps[activeStep] === 'Request Form' ? (
                 <RequestForm 
                 totalAmount={totalAmount} 
                 setTotalAmount={setTotalAmount} 
                 setActiveStep={setActiveStep}
                 cartItems={cartItems}
                 setCartItems={setCartItems}
                 ctrl_number={ctrl_number}
                 setCtrlNumber={setCtrlNumber}/>
              ) : steps[activeStep] === 'Payment' ? (
                <PaymentForm totalAmount={totalAmount} cartItems={cartItems} ctrl_number={ctrl_number}/>
              ) : null}
              
            
              
              </Card>
            </Grid>
            
          </Grid>
        </MDBox>
      <Footer />
  </DashboardLayout>
  );
}

export default Record_request;
