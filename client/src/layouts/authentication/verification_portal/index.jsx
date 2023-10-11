// react-router-dom components
import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
import MDAlert from "../../../components/MDAlert";

// Authentication layout components
import CoverLayout from "../components/CoverLayout";

// Images
import bgImage from "../../../assets/images/university.jpg";
// Authentication pages components
import Footer from "../components/Footer";

function Verifier_portal() {

  const [password, setPassword] = useState('');

  // =========== For the MDAlert =================
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );

  const [file, setFile] = useState('');
  const [hash, setHash] = useState('');
  const [transaction_hash, setTransactionHash] = useState('');
  
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      try {
        // Read the contents of the selected file
        const fileBuffer = await selectedFile.arrayBuffer();

        // Calculate the hash (multihash) of the file using SHA-256
        const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);

        // Convert the hash buffer to a hexadecimal string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

        // Set the calculated hash in state
        setHash("0x1220" + hashHex);
      } catch (error) {
        console.error("Error calculating hash:", error);
        setHash(null);
      }
    } else {
      setFile(null);
      setHash(null);
    }
  };



  const handleSubmit = async (password, hash) => {

    // Reset the success and error states before making the API request
    setIsSuccess(false);
    setIsError(false);

    // Create an updated record object to send to the server
    const verifyRecord = {
      transaction_hash: transaction_hash,
      password: password,
      hash: hash,
    };
  
    // Check if password is empty
    if (!transaction_hash) {
      setIsError(true);
      setAlertMessage('Password is required.');
      return;
    }

      // Check if password is empty
    if (!password) {
      setIsError(true);
      setAlertMessage('Password is required.');
      return;
    }

    // Check if file is empty
    if (!file) {
      setIsError(true);
      setAlertMessage('File is required.');
      return;
    }


    try {
      const response = await fetch("http://localhost:8081/mysql/verify", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifyRecord),
      });
  
      if (response.ok) {
        const nodes = await response.json();
        const record_status = nodes.record_status;
        const date_issued = new Date(nodes.date_issued);
  
        const date_today = new Date();
        const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000; // One year in milliseconds
  
        /* Will compare the date_issued and date_today and get its difference to show
         if the record is still valid for one year */
        const date_difference = date_today - date_issued;
  
        if (record_status === 'Valid') {
          if (date_difference < oneYearInMilliseconds) {
            setIsSuccess(true);
            setIsError(false); // Reset the error state
            setAlertMessage('The Record is Valid.');
          } else {
            setIsSuccess(false); // Reset the success state
            setIsError(true);
            setAlertMessage("The Record's validity has expired.");
          }
        } else {
          setIsSuccess(false); // Reset the success state
          setIsError(true);
          setAlertMessage('The Record is Invalid');
        }
      } else if (response.status === 404) {
        // Handle the case when transaction_hash is not found (HTTP 404)
        setIsSuccess(false); // Reset both success and error states
        setIsError(true);
        setAlertMessage('Transaction hash not found.');
      } else {
        // Handle other HTTP error status codes (e.g., 401)
        setIsSuccess(false); // Reset both success and error states
        setIsError(true);
        setAlertMessage('The Record is Invalid.');
      }
    } catch (error) {
      setIsSuccess(false); // Reset both success and error states
      setIsError(true);
      setAlertMessage('Failed to verify record. Please input the correct information.');
      console.error('Error:', error);
    }
  };
  
  


  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Verify Academic Record
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
           Enter the required information and upload the PDF File
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox >
            <MDBox mb={2}>
              <MDInput type="text" label="Transaction Number" value={transaction_hash} variant="standard" onChange={(e) => setTransactionHash(e.target.value)} fullWidth />
            </MDBox>
            <MDBox mb={4}>
              <MDInput type="password" value={password} label="Password" variant="standard" onChange={(e) => setPassword(e.target.value)} fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput fullWidth variant="standard" 
                type="file"
                id="fileUpload"
                accept=".pdf"
                onChange={handleFileChange}
              />           
            </MDBox>
            <MDBox mt={4} mb={1}>
              
            <Grid container spacing={2}>
              
              <Grid item xs={12} sm={6}>
                <MDButton variant="gradient" color="light" size="large" fullWidth onClick={() => {
                  setPassword('');
                  setHash('');
                  setTransactionHash('');
                  const fileInput = document.getElementById('fileUpload');
                  if (fileInput) {
                    fileInput.value = ''; // Reset the file input field
                  }
                }}>
                  Reset Input
                </MDButton>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDButton variant="gradient" color="info" size="large" fullWidth type="submit" onClick={() => handleSubmit(password, hash)}>
                  Verify Record
                </MDButton>
              </Grid>
            </Grid>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              
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
            </MDBox>
          </MDBox>
        </MDBox>
       
      </Card>
    </CoverLayout>
  );
}

export default Verifier_portal;
