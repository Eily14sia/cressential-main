import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Icon from "@mui/material/Icon";
import PDFViewer2 from '../../../render_pdf';
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import MDTypography from '../../../../components/MDTypography';
import MDAvatar from '../../../../components/MDAvatar';
import DocumentSelection from '../processing_officer';

import axios from 'axios';

import { Viewer } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';

function DialogBox({ open, onClose, recordType, setRecordType, recordIPFS, 
recordID, recordPassword, setRecordPassword, payment_status, ctrl_number,
setAlertMessage, setIsError, setIsSuccess, handleCloseUploadDialog, data, setData, student_email}) {


// =========== For the datatable =================
const [selectedFile, setSelectedFile] = useState(null);
const [url, setUrl] = useState(null);
const [errorMessage, setErrorMessage] = useState('');
const [uploadedCID, setUploadedCID] = useState(null);
const [finalCID, setFinalCID] = useState(null);
const [multihash, setMultihash] = useState(null); // Added state for multihash
const [initialPassword, setInitialPassword] = useState('');

const handleFileChange = (e) => {
  // Set the URL of the file before it is selected
  e.target.files.length > 0 && setUrl(URL.createObjectURL(e.target.files[0]));

  const file = e.target.files[0];
  setSelectedFile(file);
  setUploadedCID(null); // Clear the uploaded CID
  setErrorMessage('');
  setMultihash(null); // Clear the multihash
  if (file && file.type === 'application/pdf') {
    // File is a PDF, you can proceed
    setSelectedFile(file);
  } else {
    // File is not a PDF, display an error or handle it as needed
    alert('Please select a PDF file');
  }
  
};

const handleFileUpload = async () => {
  if (selectedFile) {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8081/files/api/maindec', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (recordPassword === null || recordPassword !== initialPassword) {
        handleCloseUploadDialog();
        setIsError(true);
        setAlertMessage('Password is required.');
        setSelectedFile(null);
        setInitialPassword('');
        setUrl('');
      } else {

        if (response.data.encrypted) {
          // File is encrypted, proceed with the upload
          setUploadedCID(response.data.cid);
          setMultihash(response.data.multihash); // Set the multihash
          setFinalCID(response.data.cid);
          // console.log(response.data.cid);
          handleUpdateSubmit(response.data.cid, response.data.multihash);
          // Reset the selectedFile state to clear the file input
          setSelectedFile(null);
        } else {
          // File is not encrypted, display an error message
          handleCloseUploadDialog();
          setIsError(true);
          setAlertMessage('Only encrypted files are allowed.');
          setRecordType('');
          setRecordPassword('');
          setInitialPassword('');
          setUrl('');
          setSelectedFile(null);
        }
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      handleCloseUploadDialog();
      setIsError(true);
      setAlertMessage('Error uploading file. Please try again.');
      setRecordType('');
      setRecordPassword('');
      setInitialPassword('');
      setSelectedFile(null);
      setUrl('');
    }
  } else {
    // If no file is selected, display an error message
    handleCloseUploadDialog();
    setIsError(true);
    setAlertMessage('Please choose an encrypted PDF file first.');
    setRecordType('');
    setSelectedFile(null);
    setRecordPassword('');
    setInitialPassword('');
    setUrl('');
  }
};

  const dateIssued = new Date();

  const sendEmail = async (toEmail, cid, password, recordType) => {

    const ipfsLink = `http://localhost:8080/ipfs/${cid}`; // Replace with the IPFS link to the record    

    const emailData = {
      to: toEmail,
      subject: 'Your Requested Record Information',
      text: `
      Good day! 

      We are pleased to inform you that your academic record has been issued by the Registrar's office. Below, you will find the details of your record:

        • Record Type: ${recordType}
        • Transaction Hash: 0xfa48efae8435d0a50c3bd7e284212f1e1ace81e3ff9726b0243787f7fa851847
        • IPFS Link: ${ipfsLink}
        • Password: ${password}


      You can access your record by clicking on the IPFS Link. Use the provided password to securely access and download your record.

      **Note: Please keep the password secured, as it will also be used for verifying the validity of your record in the verifier portal. Your record's security relies on the confidentiality of this password.

      If you have any questions or need further assistance, please feel free to contact our office.

      Best regards,
      Registrar's Office
      `,
    };
  
    try {
      const response = await axios.post('http://localhost:8081/emails/send-email', emailData);
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

    const updatedRecord = {
      recordPassword: recordPassword,
      uploadedCID: CID,
      hash: hash,
      dateIssued: dateIssued,
      transactionHash: '0xfa48efae8435d0a50c3bd7e284212f1e1ace81e3ff9726b0243787f7fa851847'
    };

    try {
      const response = await fetch(`http://localhost:8081/mysql/upload-record-per-request/${recordID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecord),
      });

      if (response.ok) {
        handleCloseUploadDialog();
        setIsSuccess(true);
        setAlertMessage('Record updated successfully.');
        sendEmail(student_email, CID, recordPassword, recordType);

        // Fetch updated data and update the state
        fetch(`http://localhost:8081/mysql/record-per-request/${ctrl_number}`)
          .then((res) => res.json())
          .then((data) => {
            setData(data); // Set the fetched data into the state
          })
          .catch((err) => console.log(err));
          setRecordType('');
          setRecordPassword('');
          
      } else {
        setAlertMessage('Failed to update record');
        setRecordType('');
        setRecordPassword('');
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
      setRecordType('');
      setRecordPassword('');
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
    return password.length >= 8;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>Upload Record
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
        <Grid container justifyContent="center">   

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
          <Grid item textAlign="center" xs={12} md={5} mb={2}>
            <Grid container justifyContent="center" alignItems="center">
              <Grid item textAlign="center" xs={12} mb={2}>
                 {/* title */}
                <Grid item  mt={3}>
                  
                  <MDBox height="100%" mt={0.5}>
                    <MDTypography variant="h5" fontWeight="medium">
                      {recordType}
                    </MDTypography>
                    <MDTypography variant="caption" color="text"  >
                    Please review the information carefully. Changes cannot be undone.
                    </MDTypography>
                  </MDBox>
                  <Divider sx={{marginBottom: "20px", marginTop: "20px"}}/>
                </Grid>
              </Grid>
              <Grid item textAlign="center" xs={11}>
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
              <Grid item textAlign="center" xs={11} mt={2}>
                <MDInput
                  label="Password"
                  type="password"
                  value={initialPassword || ''}
                  onChange={(e) => setInitialPassword(e.target.value)}
                  required
                  sx={{ width: '100%' }}
                  disabled={!selectedFile}
                  error={initialPassword && !isValidPassword(initialPassword)}
                />
                <MDBox sx={{ textAlign: "left" }}>
                {initialPassword && !isValidPassword(initialPassword) && (
                <MDTypography variant="caption" sx={{ color: 'red', textAlign: 'left' }}>
                  * Password should be at least 8 characters long <br/> * It should contain an uppercase letter, a lowercase letter, and a digit.
                </MDTypography>
              )}


                </MDBox>
              </Grid>
              <Grid item textAlign="center" xs={11} mt={2}>
                <MDInput
                  label="Retype Password"
                  type="password"
                  value={recordPassword || ''}
                  onChange={(e) => setRecordPassword(e.target.value)}
                  required
                  sx={{ width: '100%', marginBottom: "30px" }}
                  disabled={!isValidPassword(initialPassword)}
                  error={recordPassword && recordPassword !== initialPassword}
                />
                
                <MDButton
                  variant="contained"
                  color="info"
                  type="submit"
                  onClick={handleFileUpload} 
                  size="large"                  
                  fullWidth
                >
                    Upload Record
                </MDButton>
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
          disabled={recordPassword !== initialPassword || !isValidPassword(initialPassword)}
        >
            Upload Record
        </MDButton>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </DialogActions> */}
    </Dialog>
  );
}

export default DialogBox;
