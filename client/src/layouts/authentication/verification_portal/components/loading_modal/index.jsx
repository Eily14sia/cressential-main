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
import MDInput from '../../../../../components/MDInput';
import FormHelperText from '@mui/material/FormHelperText';

function DialogBox({ open, onDialogClose, isSuccess, isError, setIsSuccess, setIsError, alertMessage, alertContent, isLoading, setIsLoadingDialogOpen,
  transaction_hash, password, filename, studentName, recordType, verificationResult, generateReport, setGenerateReport, setAlertMessage, rpr_id
}) {

  const navigate = useNavigate();

  const [result, setResult] = useState('');
  const [description, setDescription] = useState('');
  const [hideComponent, setHideComponent] = useState(false);


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
          // Incorrect Password
          setResult("Incorrect Password."); 
          setDescription("Unable to verify the record as the entered Password is incorrect. Please confirm to the owner of the record.");
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

  const handleGenerateReport = () => {
    setGenerateReport(true);
    setHideComponent(true);
  };

  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [lastNameValidationMessage, setLastNameValidationMessage] = useState('');
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [firstNameValidationMessage, setFirstNameValidationMessage] = useState('');
  const [isMiddleNameValid, setIsMiddleNameValid] = useState(true);
  const [middleNameValidationMessage, setMiddleNameValidationMessage] = useState('');
  const [isInstitutionValid, setIsInstitutionValid] = useState(true);
  const [institutionValidationMessage, setInstitutionValidationMessage] = useState('');

  const initialFormData = {
    lastName: '',
    firstName: '',
    middleName: '',
    institution: '',
    transaction_hash: '',
    password: '',
    studentName: '',
    recordType: '',
    alertMessage: '',
    isSuccess: false,
    verificationResult: '',
    description: '',
    rpr_id: ''
  };
  const [formData, setFormData] = useState({initialFormData});

  const handleLastNameChange = (newValue) => {
    const maxLength = 100; // Define a maximum allowed last name length

    if (newValue.length > maxLength) {
      // If it exceeds the maximum length, mark it as invalid
      setIsLastNameValid(false);
      setLastNameValidationMessage('Last name should not exceed 100 characters.');
    } else {
      // If it passes all validations, set the last name and mark it as valid
      // setLastName(newValue);
      setFormData({ ...formData, lastName: newValue });
      setIsLastNameValid(true);
      setLastNameValidationMessage(''); // Clear validation message when valid
    }
  };

  const handleFirstNameChange = (newValue) => {
    const maxLength = 100; // Define a maximum allowed first name length

    if (newValue.length > maxLength) {
      // If it exceeds the maximum length, mark it as invalid
      setIsFirstNameValid(false);
      setFirstNameValidationMessage('First name should not exceed 100 characters.');
    } else {
      // If it passes all validations, set the first name and mark it as valid
      // setFirstName(newValue);
      setFormData({ ...formData, firstName: newValue });
      setIsFirstNameValid(true);
      setFirstNameValidationMessage(''); // Clear validation message when valid
    }
  };

  const handleMiddleNameChange = (newValue) => {
    const maxLength = 100; // Define a maximum allowed middle name length

    if (newValue.length > maxLength) {
      // If it exceeds the maximum length, mark it as invalid
      setIsMiddleNameValid(false);
      setMiddleNameValidationMessage('Middle name should not exceed 100 characters.');
    } else {
      // If it passes all validations, set the middle name and mark it as valid
      // setMiddleName(newValue);
      setFormData({ ...formData, middleName: newValue });
      setIsMiddleNameValid(true);
      setMiddleNameValidationMessage(''); // Clear validation message when valid
    }
  };

  const handleInstitutionChange = (newValue) => {
    const maxLength = 100; // Define a maximum allowed Institution length

    if (newValue.length > maxLength) {
      // If it exceeds the maximum length, mark it as invalid
      setIsInstitutionValid(false);
      setInstitutionValidationMessage('Institution should not exceed 100 characters.');
    } else {
      // If it passes all validations, set the Institution and mark it as valid
      // setInstitution(newValue);
      setFormData({ ...formData, institution: newValue });
      setIsInstitutionValid(true);
      setInstitutionValidationMessage(''); // Clear validation message when valid
    }
  };



  useEffect(() => {
    if (verificationResult) {
      setHideComponent(false);
      setFormData({ ...formData, 
          transaction_hash: transaction_hash, 
          password: password,
          studentName: studentName,
          recordType: recordType,
          alertMessage: alertMessage,
          isSuccess: (verificationResult === 2 || verificationResult === 3) ? true : false,
          verificationResult: result,
          description: description,
          rpr_id: rpr_id ? rpr_id : null
      });

    }
  }, [verificationResult, result]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Check if all fields are valid
    if (!isFirstNameValid) {
      setAlertMessage('First name is invalid. Please check your input.');
      setIsError(true);
      return;
    }
    if (!isMiddleNameValid) {
      setAlertMessage('Middle name is invalid. Please check your input.');
      setIsError(true);
      return;
    }
    if (!isLastNameValid) {
      setAlertMessage('Last name is invalid. Please check your input.');
      setIsError(true);
      return;
    }
    if (!isInstitutionValid) {
      setAlertMessage('Institution is invalid. Please check your input.');
      setIsError(true);
      return;
    }

    try {
      const response = await fetch('https://cressential-5435c63fb5d8.herokuapp.com/mysql/verify/add-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const nodes = await response.json();       
        const verificationID = nodes.verificationID;
        
        navigate('/verification-report', { 
          state: { 
            verificationID: verificationID,
            verifier: formData.lastName + ', ' + formData.firstName + ' ' + formData.middleName, 
            institution: formData.institution,           
            transaction_hash: transaction_hash, 
            password: password,
            studentName: studentName,
            recordType: recordType,
            alertMessage: alertMessage,
            isSuccess: (verificationResult === 2 || verificationResult === 3) ? true : false,
            verifResult: result,
            description: description, 
            result_num: verificationResult
          }}); // Navigate to the verification report page
      } else {
        setAlertMessage('Failed to update record');
        setIsError(true);
      }
    } catch (error) {
      setAlertMessage('Failed to update record');
      setIsError(true);
      console.error('Error:', error);
    }
    
  };

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
          onClick={() => {
            onDialogClose();
            setHideComponent(false);
          }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        
      </DialogTitle>

      <DialogContent sx={{minHeight: '30vh'}}>
      
        <Grid container justifyContent="center" mt={2} alignItems="center">
                            
          <Grid item xs={11} sx={{textAlign: "center"}}>
            {isSuccess && (
              <MDAlert color="success" mt={3} dismissible sx={{marginBottom: '30px'}} onClose={() => setIsSuccess(false)}>
                    {alertContent("success", alertMessage)}
              </MDAlert>
            )}
            {isError && (
              <MDAlert color="error" mt={3} dismissible sx={{marginBottom: '30px'}} onClose={() => setIsError(false)}>
                {alertContent("error", alertMessage)}
              </MDAlert>
            )}
          </Grid>

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

            {/* Verification successful */}
            {!hideComponent && verificationResult && (verificationResult == 2) && (
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
                <Grid item xs={5} my={3} sx={{textAlign: "center"}}>
                    <MDButton  
                      onClick={() => {
                        onDialogClose();
                        setHideComponent(false);
                      }}
                      variant="outlined"
                      color="info"
                      size="large"
                      >
                      <Icon>undo</Icon> &nbsp;
                      Verify again
                    </MDButton>
                  </Grid>   
                  <Grid item xs={5} my={3} sx={{textAlign: "center"}}>
                    <MDButton  
                      onClick={handleGenerateReport}
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

            {/* Hash Mismatch */}
            {!hideComponent && verificationResult && (verificationResult == 3) && (
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
                
                  <Grid item xs={5} my={3} sx={{textAlign: "center"}}>
                    <MDButton  
                      onClick={() => {
                        onDialogClose();
                        setHideComponent(false);
                      }}
                      variant="outlined"
                      color="info"
                      size="large"
                      >
                      <Icon>undo</Icon> &nbsp;
                      Verify again
                    </MDButton>
                  </Grid>   
                  <Grid item xs={5} my={3} sx={{textAlign: "center"}}>
                    <MDButton  
                      onClick={handleGenerateReport}
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

            {/* Verification Warning */}
            {!hideComponent && !isLoading && verificationResult && (verificationResult != 2 && verificationResult != 3) && (
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
                  <Grid item xs={5} my={3} sx={{textAlign: "center"}}>
                    <MDButton  
                      onClick={() => {
                        onDialogClose();
                      }}
                      variant="outlined"
                      color="info"
                      size="large"
                      >
                      <Icon>undo</Icon> &nbsp;
                      Verify again
                    </MDButton>
                  </Grid> 
                  <Grid item xs={5} my={3} sx={{textAlign: "center"}}>
                    <MDButton  
                      onClick={handleGenerateReport}
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
            
            {generateReport && (
              <>
                <MDTypography variant="h4" color="info" fontWeight="regular">
                  Verifier's Information
                </MDTypography>
                <MDTypography display="block" variant="button"  my={1}>

                  Enter accurate details, as they will be shown in the generated report.               
                 </MDTypography>
                <MDBox mx={3}>
                  <form onSubmit={handleSubmit}>
                    <Grid container mt={3} spacing={2} justifyContent="center" alignItems="center">
                      <Grid item xs={4}>
                        <MDInput
                          required
                          type="text"
                          label="Last Name"
                          value={formData.lastName}
                          variant="outlined"
                          onChange={(e) => handleLastNameChange(e.target.value)}
                          fullWidth
                          error={!isLastNameValid}
                        />
                        <MDBox sx={{ textAlign: "left" }}>
                          {!isLastNameValid && (
                            <FormHelperText error>{lastNameValidationMessage}</FormHelperText>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={4}>
                        <MDInput
                          required
                          type="text"
                          label="First Name"
                          value={formData.firstName}
                          variant="outlined"
                          onChange={(e) => handleFirstNameChange(e.target.value)}
                          fullWidth
                          error={!isFirstNameValid}
                        />
                        <MDBox sx={{ textAlign: "left" }}>
                          {!isFirstNameValid && (
                            <FormHelperText error>{firstNameValidationMessage}</FormHelperText>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={4}>
                        <MDInput
                          type="text"
                          label="Middle Name"
                          value={formData.middleName}
                          variant="outlined"
                          onChange={(e) => handleMiddleNameChange(e.target.value)}
                          fullWidth
                          error={!isMiddleNameValid}
                        />
                        <MDBox sx={{ textAlign: "left" }}>
                          {!isMiddleNameValid && (
                            <FormHelperText error>{middleNameValidationMessage}</FormHelperText>
                          )}
                        </MDBox>
                      </Grid>


                    
                      <Grid item xs={12} mt={1}>
                      
                        <MDInput
                          required
                          type="text"
                          label="Institution/Company Name"
                          value={formData.institution}
                          variant="outlined"
                          onChange={(e) => handleInstitutionChange(e.target.value)}
                          fullWidth
                          error={!isInstitutionValid}
                        />
                        <MDBox sx={{ textAlign: "left" }}>
                          {!isInstitutionValid && (
                            <FormHelperText error>{institutionValidationMessage}</FormHelperText>
                          )}
                        </MDBox>
                      </Grid>
                      
                      
                      <Grid item xs={6} mt={3} mb={4} sx={{textAlign: "center"}}>
                        <MDButton  
                          onClick={() => {
                            onDialogClose();
                          }}
                          variant="outlined"
                          color="info"
                          size="large"
                          fullWidth
                          >
                          <Icon>undo</Icon> &nbsp;
                          Verify Again
                        </MDButton>
                      </Grid>   
                      <Grid item xs={6} mt={3} mb={4} sx={{textAlign: "center"}}>
                        <MDButton  
                          type="submit"
                          // to={`/verification-report`} component={RouterLink} 
                          // state={{ 
                          //   transaction_hash: transaction_hash, 
                          //   password: password,
                          //   studentName: studentName,
                          //   recordType: recordType,
                          //   alertMessage: alertMessage,
                          //   isSuccess: false,
                          //   verificationResult: result,
                          //   description: description
                          // }}
                          variant="gradient"
                          color="info"
                          size="large"
                          fullWidth
                          >
                          <Icon>send</Icon> &nbsp;
                          Submit
                        </MDButton>
                      </Grid>   


                    </Grid>
                  </form>
                </MDBox>
              </>
            )}


          
        </Grid>
      </DialogContent>

    </Dialog>
  );
}

export default DialogBox;
