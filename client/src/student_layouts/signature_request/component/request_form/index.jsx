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

import PDFViewer2 from '../../../../layouts/render_pdf';

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

import axios from 'axios';

import { useMaterialUIController } from "../../../../context";

const index = ( {setIsError, setAlertMessage, totalAmount, setTotalAmount, setActiveStep, cartItems, setCartItems, ctrl_number, setCtrlNumber}) => {

    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [data, setData] = useState([]);   
    const [selectedItemID, setSelectedItemID] = useState("");
    const [selectedPurpose, setSelectedPurpose] = useState('');
    const [purposeCollege, setPurposeCollege] = useState('');
    const [isAuthorize, setIsAuthorize] = useState(false);
  
      
    const [selectedFile, setSelectedFile] = useState('');
    const [url, setUrl] = useState(null);
  
    const alertContent = (name) => (
      <MDTypography variant="body2" color="white">
        {alertMessage}
      </MDTypography>
    );
  
    // State to track whether the dialog is open
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const jwtToken = localStorage.getItem('token');  

  const handleFileChange = async (e) => {
    // Set the URL of the file before it is selected
    e.target.files.length > 0 && setUrl(URL.createObjectURL(e.target.files[0]));

    const file = e.target.files[0];
    setSelectedFile(file);
    if (file && file.type === 'application/pdf') {
      // File is a PDF, you can proceed
      setSelectedFile(file);
    } else {
      // File is not a PDF, display an error or handle it as needed
      alert('Please select a PDF file');
    }

    setIsError(false);
    setAlertMessage('');
  };

  const CustomSmallCircleIcon  = () => (
    <svg width="8" height="8" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="3" fill="none" stroke="#1A73E8" strokeWidth="2" />
    </svg>
  );

  // Function to initiate the OAuth flow by redirecting the user to Adobe Sign's authorization endpoint
  const initiateOAuthFlow = async () => {

    // Construct the URL for authorization endpoint with necessary parameters
    const authorizationEndpoint = 'https://secure.sg1.adobesign.com/public/oauth/v2?redirect_uri=https://cressential-5435c63fb5d8.herokuapp.com/signature-request&response_type=code&client_id=CBJCHBCAABAARe7cQZ-s5GKs3x1hejZiDftJTu7qZjxm&scope=user_read:account+user_write:account+user_login:account+agreement_read:account+agreement_write:account+agreement_send:account+widget_read:account+widget_write:account+library_read:account+library_write:account+workflow_read:account+workflow_write:account';
  
    // Redirect the user to Adobe Sign's authorization endpoint
    window.location.href = authorizationEndpoint;
  }
  
  // Retrieve the code parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const authorizationCode = urlParams.get('code');
  const formData = new FormData();

  const handleSubmit = async () => {

    try {
      const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/adobeSign/getAccessToken', {
        access_code: authorizationCode
      }, {
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (response.status >= 200 && response.status < 300) {
        const data = response.data; // Assuming the response contains JSON data
        const access_token = data.accessToken;
        formData.append('access_token', access_token);
        console.log('access_token', access_token);
        console.log('response ok');
        setIsAuthorize(true);
    } else {
        console.log('response not ok');
    }

    } catch (error) {
        console.error('Error:', error);
    }
};


  async function addAgreement() {
    formData.append('File', selectedFile);

    if (selectedFile === '') {
      setIsError(true);
      setAlertMessage( "File is required. Please upload a PDF File.");
      return;
    }

    if (!isAuthorize) {
      setIsError(true);
      setAlertMessage( "You haven't authorize the API. Please go back to Step 1.");
      return;
    }


    try {
      const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/adobeSign/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status >= 200 && response.status < 300) {
        console.log('Upload success');
      } else {
        console.error('Upload failed');
        // Handle other status codes (e.g., error responses)
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle network errors or exceptions
    }

    setIsAuthorize(false);
  }


  useEffect(() => {
    // Use the retrieved authorization code as needed
    if (authorizationCode) {
        console.log('Received authorization code:', authorizationCode);
        // Perform actions with the authorization code
        handleSubmit(); // Call your function to handle the code
    } 
}, []); 

  const styles = {
    label: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #ced4da',
      borderRadius: '5px',
      padding: '6px 12px',
      cursor: 'pointer',
    },
    input: {
      display: 'none', // Make the input hidden
    },
    button: {
      width: '35%',
      height: 'auto',
      margin: '7px 15px 7px 2px',      
    },
    placeholder: {
      color: '#495057',
    },
  };
  
  return (
    <>
        <MDBox pt={2} py={5} px={3}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item textAlign="center" xs={12} lg={8} sx={{borderRadius: '5px'}}>             
                
                  {/* {pdfUrl && <PDFViewer2 />} */}
                  
                  {url ? (
                      <div
                          style={{
                              border: '1px solid rgba(0, 0, 0, 0.3)',
                          }}
                      >
                          {/* <Viewer fileUrl={url} /> */}
                          <PDFViewer2 fileUrl={url}/>
                      </div>
                  ) : (
                      <div
                          style={{
                              alignItems: 'center',
                              border: '2px dashed rgba(0, 0, 0, .3)',
                              display: 'flex',
                              fontSize: '2rem',
                              height: '100%',
                              justifyContent: 'center',
                              width: '100%',
                          }}
                      >
                          Preview area
                      </div>
                  )}       
              
            </Grid>
            <Grid item xs={12} lg={4} sx={{borderRadius: '5px'}}>         

               
              {/* <MDInput fullWidth variant="outlined" 
                type="file"
                id="fileUpload"
                accept=".pdf"
                mx={2}
                onChange={handleFileChange}
              />    */}
              <MDBox display="flex" alignItems="center" >
                <CustomSmallCircleIcon />
                <MDTypography variant="h6" sx={{paddingLeft: "15px"}}>Step 1:</MDTypography>
              </MDBox>
              <MDBox display="flex" mb={1} >
                <MDTypography variant="caption" ml={3} my={1}>
                  In order to use the Adobe API, you need to authorize it first by clicking the 'Authorize the API' Button.
                </MDTypography>                  
              </MDBox>
              <MDBox px={3} >
                <MDButton sx={{marginBottom: "20px"}} variant="gradient" color="dark" onClick={initiateOAuthFlow} fullWidth>Authorize the API</MDButton>   
              </MDBox>

            <MDBox display="flex" alignItems="center" >
              <CustomSmallCircleIcon />
              <MDTypography variant="h6" sx={{paddingLeft: "15px"}}>Step 2:</MDTypography>
            </MDBox>
            <MDBox display="flex"  mb={1} >
              <MDTypography variant="caption" ml={3} my={1}>
                Please ensure that the correct PDF file is uploaded using the PDF Viewer. This only accepts PDF File Format. 
              </MDTypography>                  
            </MDBox>
            <MDBox px={3} >
              <label htmlFor="file-upload" style={styles.label}>
                <button
                  style={styles.button}
                  onClick={() => {
                    const fileInput = document.getElementById("file-upload");
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                >
                  Choose File
                </button>
                <span style={selectedFile ? {} : styles.placeholder}>
                  <MDTypography variant="button">
                  {selectedFile ? selectedFile.name : 'Select a PDF file'}
                  </MDTypography>
                </span>
                <input
                  accept=".pdf"
                  id="file-upload"
                  type="file"
                  style={styles.input}
                  onChange={handleFileChange}
                />
                
              </label>
            </MDBox>

            <MDBox display="flex" alignItems="center" mt={2}>
              <CustomSmallCircleIcon />
              <MDTypography variant="h6" sx={{paddingLeft: "15px"}}>Step 3:</MDTypography>
            </MDBox>
            <MDBox display="flex"   >
              <MDTypography variant="caption" ml={3} my={1}>
                After attaching the PDF file, click the 'Submit for signing' Button to send the PDF file to Adobe Sign for signing.
              </MDTypography>                  
            </MDBox>

            <MDBox px={3} >
              <MDButton sx={{marginTop: "20px"}} variant="gradient" color="dark" onClick={addAgreement} fullWidth>Submit for signing</MDButton>   
            </MDBox>
              
            </Grid>
          </Grid>
        </MDBox>
    </>
  )
}

export default index