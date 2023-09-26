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

import { useMaterialUIController } from "../../context";

function Record_request() {
  const [controller] = useMaterialUIController();
  const [totalAmount, setTotalAmount] = useState(0);

  // =========== For the MDAlert =================
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );

  useEffect(() => {
    fetch("http://localhost:8081/mysql/type-of-record")
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the fetched data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Request Form',
    'Payment',
    'Completed',
  ];

  const [cartItems, setCartItems] = useState([]);


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
                 setCartItems={setCartItems}/>
              ) : steps[activeStep] === 'Payment' ? (
                <PaymentForm totalAmount={totalAmount} cartItems={cartItems}/>
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
