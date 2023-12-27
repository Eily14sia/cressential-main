import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  IconButton,
} from '@mui/material';
import React, { useEffect, useState} from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink, useNavigate} from "react-router-dom";
import { Link } from "@mui/material";
// Material Dashboard 2 React components
import MDBox from "../../../../../components/MDBox";
import MDButton from "../../../../../components/MDButton";
import MDAlert from "../../../../../components/MDAlert";
import MDTypography from '../../../../../components/MDTypography';
import CircularProgress from '../../../../../examples/CircularProgress';
import CircularSuccess from '../../../../../examples/CircularSuccess';
import CircularError from '../../../../../examples/CircularError';

function DialogBox({ open, onDialogClose, isSuccess, isError, setIsSuccess, setIsError, alertMessage, alertContent, isLoading, setIsLoadingDialogOpen,
  transaction_hash, password, filename, studentName, recordType, verificationResult
}) {

  const [result, setResult] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const handleVerificationResult = () => {
      switch (verificationResult) {
        case 1: 
          // If verificationResult is 1, set the result and description accordingly
          setResult('Transaction Number not found.'); 
          setDescription("Unable to verify the record as the provided transaction number does not exist in the records. Please confirm to the owner of the record.");
          break;
        case 2: 
          // Data is Authentic and Unaltered
          setResult('Data is Authentic and Unaltered.'); 
          setDescription("The provided record has been verified as authentic and remains unaltered.");
          break;
        case 3: 
          // Hash mismatch detected. Possible data tampering.
          setResult('Hash mismatch detected. Possible data tampering.'); 
          setDescription("A discrepancy in the hash values has been detected, suggesting potential data tampering.");
          break;
        case 4: 
          // The record's validity period has expired
          setResult("The record's validity period has expired."); 
          setDescription("Unable to verify the record as the validity period for the provided record has lapsed, and it is no longer considered valid. Please confirm to the owner of the record.");
          break;
        case 5: 
          // The record is no longer valid
          setResult("The record is no longer valid."); 
          setDescription("Unable to verify the record as it appears to be an outdated version, and a new version may have been re-uploaded. Please reach out to the owner of the record for confirmation.");
          break;
        case 6: 
          // Incorrect Transaction number or Password
          setResult("Incorrect Transaction number or Password."); 
          setDescription("Unable to verify the record as the entered Transaction number or Password is incorrect. Please confirm to the owner of the record.");
          break;
        default:
          // Handle the default case if verificationResult doesn't match any specified cases
          setResult('Unknown Verification Result'); 
          setDescription('Please check the verification status.'); 
          break;
      }
    };
    handleVerificationResult();
  }, [verificationResult]);

  return (
    <Dialog open={open} onClose={onDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <IconButton
          sx={{
            position: 'absolute',
            right: '20px',
            top: '18px',
          }}
          edge="end"
          color="inherit"
          onClick={onDialogClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{minHeight: '30vh'}}>
        <Grid container justifyContent="center" mt={2} alignItems="center">
         
            {isLoading && (
              <>
                <CircularProgress/>
                <Grid container spacing={1} justifyContent="center" alignItems="center">                    
                            
                  <Grid item xs={10} sx={{textAlign: "center"}}>
                    <MDTypography variant="h3" mt={2} color="info" textGradient >Processing Request</MDTypography>     
                  </Grid>  
                  <Grid item xs={10} mb={5} sx={{textAlign: "center"}}>
                    <MDTypography variant="body2" mt={3}>
                    Retrieving data from the blockchain. This process may take a minute or longer. Please wait.
                    </MDTypography>           
                  </Grid>   
                </Grid>
              </>
            )}
            {isSuccess && (
              <>
                <CircularSuccess/>
                <Grid container spacing={1} justifyContent="center" alignItems="center">                    
                            
                  <Grid item xs={10} sx={{textAlign: "center"}}>
                    <MDTypography variant="body1" color="dark" textGradient fontWeight="regular">Verification Successful </MDTypography>     
                  </Grid>  
                  <Grid item xs={10} mb={3} sx={{textAlign: "center"}}>
                    <MDTypography variant="h4" mt={2} color="success" textGradient >
                      {alertMessage} 
                    </MDTypography>     
                  </Grid> 
                </Grid>
                <Grid container spacing={1} justifyContent="center" alignItems="center">  
                  <Grid item xs={10} my={3} sx={{textAlign: "center"}}>

                    <MDButton  
                      to={`/verification-report`} component={RouterLink} 
                      state={{ 
                        transaction_hash: transaction_hash, 
                        password: password,
                        studentName: studentName,
                        recordType: recordType,
                        alertMessage: alertMessage,
                        isSuccess: true,
                        verificationResult: result,
                        description: description
                      }}                      
                      variant="gradient"
                      color="info"
                      size="large"
                      >
                      <Icon>note_add</Icon> &nbsp;
                      Generate Report
                    </MDButton>
                  </Grid>   
                </Grid>
              </>
            )}
            {isError && (
              <>
                <CircularError/>
                <Grid container spacing={1} justifyContent="center" alignItems="center">                    
                            
                  <Grid item xs={10} sx={{textAlign: "center"}}>
                    <MDTypography variant="body1" color="dark" fontWeight="regular">Verification Warning </MDTypography>     
                  </Grid>  
                  <Grid item xs={10} mb={3} sx={{textAlign: "center"}}>
                    <MDTypography variant="h5" mt={2} color="error" textGradient >
                      {alertMessage} 
                    </MDTypography>              
                  </Grid>   
                </Grid>
                <Grid container spacing={1} justifyContent="center" alignItems="center">  
                <Grid item xs={10} my={3} sx={{textAlign: "center"}}>
                  <MDButton  
                    to={`/verification-report`} component={RouterLink} 
                    state={{ 
                      transaction_hash: transaction_hash, 
                      password: password,
                      studentName: studentName,
                      recordType: recordType,
                      alertMessage: alertMessage,
                      isSuccess: false,
                      verificationResult: result,
                      description: description
                    }}
                    variant="gradient"
                    color="info"
                    size="large"
                    >
                    <Icon>note_add</Icon> &nbsp;
                    Generate Report
                  </MDButton>
                </Grid>   
              </Grid>
              </>
            )}

          
        </Grid>
      </DialogContent>
      <MDBox
        component="hr"
        sx={{ opacity: 0.2 }}
      />
    </Dialog>
  );
}

export default DialogBox;
