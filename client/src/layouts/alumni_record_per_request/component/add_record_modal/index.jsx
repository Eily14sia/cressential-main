import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem, 
  InputAdornment, 
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import PDFViewer2 from '../../../render_pdf';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import MDTypography from '../../../../components/MDTypography';
import DocumentSelection from "../document_selection";
import pdfjsLib from 'pdfjs-dist';

import LoadingModal from '../loading_modal';

import axios from 'axios';

import { Viewer } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';

import useEth from "../../../../contexts/EthContext/useEth";

function DialogBox({ open, onClose, recordType, setRecordType, student_email, student_id,
recordID, recordPassword, setRecordPassword, ctrl_number,
setAlertMessage, setIsError, setIsSuccess, handleCloseAddDialog, setData}) {


// =========== For the datatable =================
const [selectedFile, setSelectedFile] = useState(null);
const [url, setUrl] = useState(null);
const [errorMessage, setErrorMessage] = useState('');
const [initialPassword, setInitialPassword] = useState('');
const [isPasswordMatch, setIsPasswordMatch] = useState('');

// State to track whether the loading dialog is open
const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(false);

//--BLOCKCHAIN
const { state: { contract, accounts } } = useEth();

const jwtToken = localStorage.getItem('token');

const handleFileChange = (e) => {
  // Set the URL of the file before it is selected
  e.target.files.length > 0 && setUrl(URL.createObjectURL(e.target.files[0]));

  const file = e.target.files[0];
  setSelectedFile(file);
  setErrorMessage('');
  if (file && file.type === 'application/pdf') {
    // File is a PDF, you can proceed
    setSelectedFile(file);
  } else {
    // File is not a PDF, display an error or handle it as needed
    alert('Please select a PDF file');
    setSelectedFile(null);
    setUrl(null);
  }
  
};

async function validatePasswordFromPDF(formData) {
  try {
    const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/files/api/validatePasswordForPDF', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log('isPasswordValid:', response.data.isPasswordValid);
      // setIsPasswordMatch(response.data.isPasswordValid)
      return (response.data.isPasswordValid)
    } else {
      console.error('Request failed with status:', response.status);
      // Handle other status codes (e.g., error responses)
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    // Handle network errors or exceptions
  }
}

const handleFileUpload = async () => {
  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('password', recordPassword);

  if (selectedFile) {
      try {
        const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/files/api/maindec', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (recordPassword === '') {
          handleCloseAddDialog();
          setIsError(true);
          setAlertMessage("Password is required.");
          setSelectedFile(null);
          setInitialPassword('');
          setUrl('');
        } else {

          if (response.status === 200) {
            // File is encrypted, proceed with the upload
            setIsLoadingDialogOpen(true);
            const responseData = response.data;
            handleUpdateSubmit(responseData.ipfsCID, responseData.multihash);
            // Reset the selectedFile state to clear the file input
            setSelectedFile(null);
          } 
        }

      } catch (error) {
        console.error('Error uploading file:', error);
        handleCloseAddDialog();
        setIsError(true);
        setAlertMessage('Error uploading file. Encrypted PDF is not allowed.');
        setRecordType('');
        setInitialPassword('');
        setSelectedFile(null);
        setUrl('');
      }
  } else {
    // If no file is selected, display an error message
    handleCloseAddDialog();
    setIsError(true);
    setAlertMessage('Please choose an encrypted PDF file first.');
    setRecordType('');
    setSelectedFile(null);
    setInitialPassword('');
    setUrl('');
  }
};

// =========== For Record Type =================
const [record_data, setRecordData] = useState([]);

useEffect(() => {
  fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/type-of-record", {
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
    .then((type_of_record) => {
      setRecordData(type_of_record); 
    })
    .catch((err) => console.log(err));
}, []);

function getRecordName(record_type_id) {
  const type = record_data.find((item) => item.id == record_type_id)?.type;  
  return type;
}
  const dateIssued = new Date();

  const sendEmail = async (toEmail, cid, password, recordType, txHash, ctrlNumber) => {

    const type = getRecordName(recordType);
    const ipfsLink = `https://cressential.infura-ipfs.io/ipfs/${cid}`; // Replace with the IPFS link to the record    

    const emailData = {
      to: toEmail,
      subject: 'Your Requested Record Information',
      text: `
      Good day! 

      We are pleased to inform you that your academic record has been issued by the Registrar's office. Below, you will find the details of your record:

        • Control Number: ${ctrlNumber}
        • Record Type: ${type}
        • Transaction Number: ${txHash}
        • IPFS Link: ${ipfsLink}
        • Password Format:

          Concatenate your Control Number: 123, Last Name and the last 5 digits of your wallet address, all in lowercase.

          Example:
          Control Number: 123
          Last Name: Smith
          Wallet Address: 0xAbCdEfGhIjKlMnOpQrStUvWxYz123456ab90

          Sample Password: 123smith6ab90

      You can access your record by clicking on the IPFS Link. Please use the provided password to securely access and download your record. Alternatively, you can access these credentials through the Cressential system for authentication purposes.
  
      ** Note: Please ensure the security of the Password and Transaction Number, as they are vital for authorized verification of your record within the verifier portal. Sharing these credentials implies granting permission for others to verify your record. The security of your record relies on the confidentiality of these credentials.
      
      If you have any questions or need further assistance, please feel free to contact our office.
    
      Best regards,
      Registrar's Office
      `,
    };
  
    try {
      const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/emails/send-email', emailData);
      if (response.status === 200) {
        console.log('Email sent successfully.');
      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleUpdateSubmit = async (CID, hash) => {
    // Create an updated record object to send to the server
    try {
      const receipt = await contract.methods.write(hash).send({ from: accounts[0] });
      const transactionHash = receipt.transactionHash;

      //if blockchain is successful 
      const updatedRecord = {
        ctrl_number: ctrl_number,
        recordType: recordType,
        recordPassword: recordPassword,
        uploadedCID: CID,
        hash: hash,
        dateIssued: dateIssued,
        transactionHash: transactionHash
      };

      try {
        const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/record-per-request/add-record`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(updatedRecord),
        });

        if (response.ok) {
          handleCloseAddDialog();
          setIsSuccess(true);        
          sendEmail(student_email, CID, recordPassword, recordType, transactionHash, ctrl_number);
          setInitialPassword('');
          setUrl('');

          // Fetch updated data and update the state
          fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/record-per-request/${ctrl_number}`, {
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
            .then((fetchedData) => {
              setData(fetchedData);
            })
            .catch((err) => console.log(err));

            setAlertMessage('Record updated successfully.');
        } else {
          setAlertMessage('Failed to update record');
          setRecordType('');
        }
      } catch (error) {
        setIsError(true);
        setAlertMessage('Failed to upload record.');
        console.error('Error:', error);
      }

      setInitialPassword('');
      setUrl('');
      setIsLoadingDialogOpen(false);

    } catch (error) {
      onClose();
      setIsLoadingDialogOpen(false);
      setIsError(true);
      setAlertMessage('Failed to upload record.');
      console.error('Error:', error);

      setInitialPassword('');
      setUrl('');
      setRecordType('');

    }
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

  const pdfUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

  function isValidPassword(password) {
    // Check for a minimum length of 8 characters
    const hasMinimumLength = password.length >= 8;
  
    // You can add other conditions here as needed
    // For example, requiring at least one uppercase letter, one lowercase letter, and one digit
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
  
    // Combine the conditions using logical AND (&&) to enforce all criteria
    return hasMinimumLength && hasUppercase && hasLowercase && hasDigit;
  }
  
  const [showPassword, setShowPassword] = useState(false);
  const [showFinalPassword, setShowFinalPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleFinalPasswordVisibility = () => {
    setShowFinalPassword(!showFinalPassword);
  };

  const CustomSmallCircleIcon  = () => (
    <svg width="8" height="8" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="3" fill="none" stroke="#1A73E8" strokeWidth="2" />
    </svg>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <LoadingModal
        open={isLoadingDialogOpen}
        onClose={isLoadingDialogOpen}
      />
      <DialogTitle>Add Record
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
        <Grid container justifyContent="center" >
          {/* right section */}
          <Grid item textAlign="center" xs={12} md={7} mb={2} p={3} sx={{borderRadius: '5px'}}>
              {/* {pdfUrl && <PDFViewer2 />} */}
              <div className="mt4" style={{ height: '750px' }}>
                {url ? (
                    <div
                        style={{
                            border: '1px solid rgba(0, 0, 0, 0.3)',
                            height: '100%',
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
            </div>
            
          </Grid>

          {/* left section */}
          <Grid item  xs={12} md={5} mb={2}>
            <Grid container justifyContent="center" alignItems="center">
              <Grid item textAlign="center" xs={12} >
                 {/* title */}
                <Grid item  mt={3}>
                  
                  <MDBox height="100%" mt={0.5}>
                    <MDTypography variant="h5" fontWeight="medium">
                    CTRL-{ctrl_number}
                    </MDTypography>
                    <MDTypography variant="caption" color="text"  >
                    Please review the information carefully. Changes cannot be undone.
                    </MDTypography>
                  </MDBox>
                  <Divider sx={{marginBottom: "30px", marginTop: "20px"}}/>
                </Grid>
              </Grid>
              <Grid item textAlign="center" xs={11}>
              
              <DocumentSelection recordType={recordType} setRecordType={setRecordType}/>
            </Grid>
              <Grid item textAlign="center" xs={11} mt={1}>
                {/* <MDInput fullWidth
                  type="file"
                  id="fileUpload"
                  accept=".pdf"
                  onChange={handleFileChange}
                />           */}
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
              
              </Grid>
              <Grid item textAlign="center" mt={4} xs={11} >
                <MDButton
                  variant="contained"
                  color="info"
                  type="submit"
                  onClick={handleFileUpload}                   
                  size="large"
                  fullWidth
                >
                    Add Record
                </MDButton>
              </Grid>
              
              {/* <Grid item textAlign="center" xs={11} mt={2}>
                <MDInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={initialPassword || ''}
                  onChange={(e) => setInitialPassword(e.target.value)}
                  required
                  sx={{ width: '100%' }}
                  disabled={!selectedFile}
                  error={initialPassword && !isValidPassword(initialPassword)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handlePasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                          size="small"
                          sx={{marginRight: "15px"}}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <MDBox sx={{ textAlign: "left" }}>
                {initialPassword && !isValidPassword(initialPassword) && (
                <MDTypography variant="caption" sx={{ color: 'red', textAlign: 'left' }}>
                  * Password should be at least 8 characters long <br/> * It should contain an uppercase letter, a lowercase letter, and a digit.
                </MDTypography>
              )}


                </MDBox> 
                </Grid> */}
              <Grid item xs={11} mt={2}>
                {/* <MDInput
                  label="Retype Password"
                  type={showFinalPassword ? 'text' : 'password'}
                  value={recordPassword || ''}
                  onChange={(e) => setRecordPassword(e.target.value)}
                  required
                  sx={{ width: '100%', marginBottom: "30px" }}
                  disabled={!isValidPassword(initialPassword)}
                  error={recordPassword && recordPassword !== initialPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleFinalPasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                          size="small"
                          sx={{marginRight: "15px"}}
                        >
                          {showFinalPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                /> */}
                <MDBox  mb={3}>
                  
                  <MDBox display="flex" alignItems="center" pt={2}>
                    <CustomSmallCircleIcon />
                    <MDTypography variant="h6" sx={{paddingLeft: "15px"}}>Important:</MDTypography>
                  </MDBox>
                  <MDBox display="flex"   >
                    <MDTypography variant="caption" ml={3} mt={1} sx={{ lineHeight: '1.5' }}>
                      Please ensure that the correct file is uploaded. Preview the encrypted file using the React PDF Viewer before clicking the 'Add Record' button.
                    </MDTypography>                  
                  </MDBox>
                  <MDBox display="flex"   >
                    <MDTypography variant="caption" ml={3} mt={1} sx={{ lineHeight: '1.5' }}>
                      Password is required to verify the authenticity of the record. Please ensure that the password of the encrypted PDF matches the password convention.
                    </MDTypography>                  
                  </MDBox>
                  <MDBox display="flex" alignItems="center" mt={1} pt={2}>
                    <CustomSmallCircleIcon />
                    <MDTypography variant="h6" sx={{paddingLeft: "15px"}}>How this works:</MDTypography>
                  </MDBox>
                  <MDBox display="flex"   >
                    <MDTypography variant="caption" ml={3} my={1} sx={{ lineHeight: '1.5' }}>
                    Academic records are securely stored using IPFS (InterPlanetary File System), ensuring both their integrity and accessibility. Upon storage, each record is assigned a unique identifier, which is subsequently stored on the blockchain. 
                    <br/><br/>
                    This identifier serves as a reference point in the verifier portal to validate the integrity of a document. By cross-referencing this identifier, the verifier portal confirms the authenticity and integrity of the document, providing a reliable means of validation.                    </MDTypography>                  
                  </MDBox>
                
              </MDBox>
               
                
              </Grid>
              
            </Grid>
          </Grid>

         
              
          
        </Grid>
      </DialogContent>
      {/* <MDBox
        component="hr"
        sx={{ opacity: 0.2 }}
      /> */}
      {/* <DialogActions>
        <MDButton onClick={onClose} color="secondary">
          Cancel
        </MDButton>
        <MDButton
          variant="contained"
          color="info"
          type="submit"
          onClick={handleFileUpload} 
        >
            Add Record
        </MDButton>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </DialogActions> */}
    </Dialog>
  );
}

export default DialogBox;
