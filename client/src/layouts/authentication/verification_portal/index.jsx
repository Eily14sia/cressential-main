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
import PDFViewer2 from '../../../layouts/render_pdf';
import { InputAdornment, IconButton, Icon } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import axios from 'axios';
import '@react-pdf-viewer/core/lib/styles/index.css';

// Authentication layout components
import CoverLayout from "../components/VerificationCoverLayout";

import LoadingModal from './components/loading_modal';
import GeneratePDF from './components/generate_pdf';

// Images
import bgImage from "../../../assets/images/university.jpg";
// Authentication pages components
import Footer from "../components/Footer";
import { isSchema } from "yup";
import FormHelperText from '@mui/material/FormHelperText';

function Verifier_portal() {

  // =========== For the MDAlert =================
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );

  const [file, setFile] = useState('');
  const [url, setUrl] = useState(null);
  const [hash, setHash] = useState('');
  const [transaction_hash, setTransactionHash] = useState('');
  const [bchain_multihash, setBchainMultihash] = useState('');
  const [password, setPassword] = useState('');
  const [student_name, setStudentName] = useState('');
  const [record_type, setRecordType] = useState('');
  const [rpr_id, setRprID] = useState('');
  const [verification_result, setVerificationResult] = useState('');
  const [generateReport, setGenerateReport] = useState(false);

  // State to track whether the loading dialog is open
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(false);

  const handleFileChange = async (e) => {
    e.target.files.length > 0 && setUrl(URL.createObjectURL(e.target.files[0]));

    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === 'application/pdf') {
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
      // File is not a PDF, display an error or handle it as needed
      setUrl(null);
      setFile(null);
      alert('Please select a PDF file');
    }

  };

  // retrieve for verification
  const sendTransactionHashToServer = async (txHash) => {

    // Reset the success and error states before making the API request
    setIsSuccess(false);
    setIsError(false);
    setIsLoading(false);
    setIsLoadingDialogOpen(false);

    // Create an updated record object to send to the server
    const verifyRecord = {
      transaction_hash: transaction_hash,
      password: password,
    };
  
    // Check if password is empty
    if (!transaction_hash) {
      setIsError(true);
      setAlertMessage('Transaction Number is required. Please enter the correct Transaction Number.');
      setIsLoadingDialogOpen(true);
      return;
    }

      // Check if password is empty
    if (!password) {
      setIsError(true);
      setAlertMessage('Password is required. Please enter the correct password.');
      setIsLoadingDialogOpen(true);
      return;
    }

    // Check if file is empty
    if (!file) {
      setIsError(true);
      setAlertMessage('File is required. Please upload an encrypted PDF.');
      setIsLoadingDialogOpen(true);
      return;
    }

    try {

      setIsLoadingDialogOpen(true);
      setIsLoading(true);
      const response = await fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/checkTxHash", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifyRecord),
      });
  
      // if the txHash is existing, retrieve the multihash from blockchain
      if (response.ok) {
        const getTransaction = await axios.post(
          `https://cressential-5435c63fb5d8.herokuapp.com/blockchain/getTransaction`,
          { txHash },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    
        if (getTransaction.data.success) {
          // Handle the response, e.g., display the transaction details
          console.log('Transaction Details:', getTransaction.data.transactionDetails);
          setBchainMultihash(getTransaction.data.multihash);
          console.log('Multihash', getTransaction.data.multihash);
          await handleSubmit(hash, getTransaction.data.multihash, verifyRecord)

        } else {
          // Handle the error, e.g., display an error message
          console.error('Error retrieving transaction details:', response.data.error);
        }
      } 

      // if transaction hash is not existing in the db 
      else {        
        setIsSuccess(false); // Reset both success and error states
        // setIsError(true);
        setAlertMessage('Transaction Number not found. Please ensure correct credentials are entered. ');        
        setVerificationResult(1);
      }

      // setUrl('');
      // setFile('');
      // setHash('');
      // setTransactionHash('');
      // setBchainMultihash('');
      // setPassword('');
      const fileInput = document.getElementById('fileUpload');
      if (fileInput) {
        fileInput.value = ''; // Reset the file input field
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error:', error.message);
    }
  };  

  const handleSubmit = async (uploaded_hash, bchain_multihash, verifyRecord) => {

    try {

      // if the txHash is existing verify the record
      const verify = await fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/verify", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifyRecord),
      });

      if (verify.ok) {
        const nodes = await verify.json();
        const record_status = nodes.record_status;
        const student_name = nodes.student_name;
        const record_type = nodes.record_type;
        const rpr_id = nodes.rpr_id;
        setStudentName(student_name);
        setRecordType(record_type);
        setRprID(rpr_id);
        // const is_expired = nodes.record_expiration;

        const currentDate = new Date();
        // Use map to iterate through the data array
        
        const date_issued = new Date(nodes.date_issued);    
        const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
        const date_difference = currentDate - date_issued;  

        console.log("uploaded hash", uploaded_hash);
        console.log("blockchain multihash", bchain_multihash);

        if(record_status === 'Valid'){
          // Check if the record is not more than a year from the date_issued, 
          if (!(date_difference >= oneYearInMilliseconds)) {

            // if valid & not expired & hashes match
            if (uploaded_hash === bchain_multihash){      
              // setIsSuccess(true);
              // setIsError(false); // Reset the error state
              setAlertMessage('Data is Authentic and Unaltered.');
              setVerificationResult(2);
            } 

            //Hash mismatch
            else { 
            // setIsSuccess(false);
            // setIsError(true); // Reset the error state
            setVerificationResult(3);
            setAlertMessage("Hash mismatch detected after successful verification. Possible data tampering.");
            }  
          } 

          // If Record is expired    
          else {  
            // setIsSuccess(false);
            // setIsError(true); // Reset the error state
            setVerificationResult(4);
            setAlertMessage("Verification unsuccessful. The validity of the record you are trying to verify has already expired.");                 
          }            
        } 

        // If Record Status is invalid
        else { 
          // setIsSuccess(false); // Reset the success state
          // setIsError(true);
          setVerificationResult(5);
          setAlertMessage("Verification unsuccessful. The record you are trying to verify is no longer valid.");        }
      }

      // if incorrect credentials are entered
      else {
        // setIsSuccess(false); // Reset both success and error states
        // setIsError(true);
        setVerificationResult(6);
        setAlertMessage('Incorrect Transaction number or Password. Please ensure correct credentials are entered. ');
      } 
    } catch (error) {
      // setIsSuccess(false); // Reset both success and error states
      // setIsError(true);
      setAlertMessage('Failed to verify record. Please input the correct information.');
      console.error('Error:', error);
    }
  };

  const CustomSmallCircleIcon  = () => (
    <svg width="8" height="8" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="3" fill="none" stroke="#1A73E8" strokeWidth="2" />
    </svg>
  );

  const handleCloseDialog = () => {
    setIsLoadingDialogOpen(false);
    setIsLoading(false);
    setAlertMessage('');
    setFile('');
    setHash('');
    setTransactionHash('');
    setUrl('');
    setPassword('');
    setGenerateReport(false);
    setVerificationResult('');
  };

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      width: '25%',
      height: 'auto',
      margin: '7px 15px 7px 2px',
    },
    placeholder: {
      color: '#495057',
    },
  };

  const [isTxNumberValid, setIsTxNumberValid] = useState(true);
  const [txNumberValidationMessage, setTxNumberValidationMessage] = useState('');

  const handleTxNumberChange = (newValue) => {
    const maxLength = 66; // Define a maximum allowed transaction number length
    const specialCharacterRegex = /^[a-zA-Z0-9]+$/; // Regex to allow only alphanumeric characters
  
    if (newValue.length > maxLength) {
      // If it exceeds the maximum length, mark it as invalid
      setIsTxNumberValid(false);
      setTxNumberValidationMessage('Transaction Number should not exceed 66 characters.');
    } else if (!specialCharacterRegex.test(newValue) && newValue.length > 1) {
      // If it contains special characters, mark it as invalid
      setIsTxNumberValid(false);
      setTxNumberValidationMessage('Transaction Number should only contain alphanumeric characters.');
    } else {
      // If it passes all validations, set the transaction number and mark it as valid
      setTransactionHash(newValue);
      setIsTxNumberValid(true);
      setTxNumberValidationMessage(''); // Clear validation message when valid
    }
  };
  

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <LoadingModal
          open={isLoadingDialogOpen}
          onDialogClose={handleCloseDialog}
          isSuccess={isSuccess}
          setIsSuccess={setIsSuccess}
          setIsError={setIsError}
          isError={isError}
          alertMessage={alertMessage}
          setAlertMessage={setAlertMessage}
          alertContent={alertContent}
          isLoading={isLoading}
          setIsLoadingDialogOpen={setIsLoadingDialogOpen}
          transaction_hash={transaction_hash}
          password={password}
          filename={file.name}
          studentName={student_name}
          recordType={record_type}
          verificationResult={verification_result}
          generateReport={generateReport}
          setGenerateReport={setGenerateReport}
          rpr_id={rpr_id}
        />
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
          <Grid container spacing={5} justifyContent="center">

            {/* left section */}
            <Grid item xs={12} lg={7} sx={{borderRadius: '5px'}}>
                {/* {pdfUrl && <PDFViewer2 />} */}
                <div className="mt4">
                  {url ? (
                      <div
                          style={{
                              border: '1px solid rgba(0, 0, 0, 0.3)',
                              height: '80vh',
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
                              height: '80vh',
                              justifyContent: 'center',
                              width: '100%',
                          }}
                      >
                          Preview area
                      </div>
                  )}
              </div>
            </Grid>

            {/* right section */}
            <Grid item xs={12} lg={5} px={2}>
              <form onSubmit={(e) => {sendTransactionHashToServer(transaction_hash); e.preventDefault();}}>
              <MDBox >
                <MDBox mb={2}>
                  <MDInput required type="text" label="Transaction Number" value={transaction_hash} variant="outlined" 
                  onChange={(e) => handleTxNumberChange(e.target.value)} fullWidth 
                  error={!isTxNumberValid}
                  />
                  <MDBox sx={{ textAlign: "left" }}>
                    {!isTxNumberValid && (
                    <FormHelperText error>
                      {txNumberValidationMessage}
                    </FormHelperText>
                    )}
                  </MDBox>
                </MDBox>
                <MDBox mb={2}>
                  {/* <MDInput type="password" value={password} label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)} fullWidth /> */}
                  <MDInput
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  required
                  value={password}
                    onChange={(e) => setPassword(e.target.value)}                  
                    fullWidth               
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handlePasswordVisibility}
                            edge="end"
                            aria-label="toggle password visibility"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                 
                </MDBox>
                <MDBox mb={2}>
                  {/* <MDInput fullWidth variant="outlined" 
                    type="file"
                    id="fileUpload"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />     */}
                  <label htmlFor="fileUpload" style={styles.label}>
                    <button
                      required
                      style={{ ...styles.button, display: 'none' }}
                      onClick={() => {
                        const fileInput = document.getElementById("fileUpload");
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                    />
                    <Icon color="secondary">upload_file</Icon> &nbsp;
                    <span style={{ ...styles.placeholder, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <MDTypography variant="button" title={file ? file.name : 'Select a PDF file'}>
                        {file ? file.name : 'Select a PDF file'}
                      </MDTypography>
                    </span>
                    <input
                      accept=".pdf"
                      id="fileUpload"
                      type="file"
                      style={styles.input}
                      onChange={handleFileChange}
                    />
                  </label>

                </MDBox>
                
                <MDBox mt={4} mb={1}>
                  
                  <Grid container spacing={2}>
                    
                    <Grid item xs={12} sm={6}>
                      <MDButton variant="gradient" color="light" size="large" fullWidth onClick={() => {
                        setPassword('');
                        setHash('');
                        setTransactionHash('');
                        setUrl('');
                        setFile('');
                        const fileInput = document.getElementById('fileUpload');
                        if (fileInput) {
                          fileInput.value = ''; // Reset the file input field
                        }
                      }}>
                        Reset Input
                      </MDButton>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDButton variant="gradient" color="info" size="large" fullWidth type="submit">
                        Verify Record
                      </MDButton>
                    </Grid>
                  </Grid>
                  <MDBox display="flex" alignItems="center" mt={7} pt={2}>
                    <CustomSmallCircleIcon />
                    <MDTypography variant="h6" sx={{paddingLeft: "15px"}}>Important:</MDTypography>
                  </MDBox>
                  <MDBox display="flex"   >
                    <MDTypography variant="caption" ml={3} mt={1}>
                      Please ensure that the correct file is uploaded. Preview the encrypted file using the React PDF Viewer before clicking the 'Verify Record' button.
                    </MDTypography>                  
                  </MDBox>
                  <MDBox display="flex" alignItems="center" mt={1} pt={2}>
                    <CustomSmallCircleIcon />
                    <MDTypography variant="h6" sx={{paddingLeft: "15px"}}>How this works:</MDTypography>
                  </MDBox>
                  <MDBox display="flex"   >
                    <MDTypography variant="caption" ml={3} my={1}>
                    Academic records are stored securely using IPFS (InterPlanetary File System), and their unique codes are stored on the blockchain. To verify the authenticity of a record, the system checks if the uploaded file's hash matches the original stored on the blockchain. If they don't match, it signals potential tampering with the data.
                    </MDTypography>                  
                  </MDBox>
                </MDBox>
              </MDBox>
              </form>
            </Grid>
          </Grid>
          
        </MDBox>
       
      </Card>
    </CoverLayout>
  );
}

export default Verifier_portal;
