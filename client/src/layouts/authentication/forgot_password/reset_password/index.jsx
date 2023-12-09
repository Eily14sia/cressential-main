import { useState, useEffect } from "react";
import { useParams, Link  } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDInput from "../../../../components/MDInput";
import MDButton from "../../../../components/MDButton";
import MDAlert from "../../../../components/MDAlert";
import FormHelperText from '@mui/material/FormHelperText';

// Authentication layout components
import CoverLayout from "../../components/CoverLayout";

// Images
import bgImage from "../../../../assets/images/university.jpg";
import illustration from "../../../../assets/images/illustrations/authentication.svg"
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Authentication pages components
import { useAuth } from '../../../../context2';

function Reset_password() {
  const { 
    password,
    setPassword,
    initialPassword,
    setInitialPassword } = useAuth();

  const { password_token } = useParams();
  const modifiedToken = password_token.replace(/\+/g, '.'); // Replace dots with underscores
  console.log('modified param:', modifiedToken);

  const [tokenExpired, setTokenExpired] = useState(false);
  const [tokenUserID, setTokenUserID] = useState('');

  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);  

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Create a new record object to send to the server
    const newRecord = {
      password: password,
    };

    if (tokenExpired) {
      setIsError(true);
      setAlertMessage('Token has expired. Please request a new password reset link.');
      return;
    }

    try {
      const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/change-password/${tokenUserID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${modifiedToken}`,
        },
        body: JSON.stringify(newRecord),
      });

      if (response.ok) {
        setIsSuccess(true);
        setAlertMessage('Password updated successfully. You can now log in with your new password.');

      } else {
        setIsError(true);
        setAlertMessage('Failed to change password.');
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    }

    setInitialPassword('');
    setPassword('');
  };

  const checkToken = async () => {

    try {

      const record = {
        token: modifiedToken
      };

      // if the txHash is existing verify the record
      const response = await fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/reset-password", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ record }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const user_id = data.user_id;
        setTokenExpired(false);
        console.log('user_id:', user_id);
        setTokenUserID(user_id);
      } else {
        console.log('Error:', response.status);
        setTokenExpired(true);
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkToken();
  }, []);


  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showInitialPassword, setShowInitialPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInitialPasswordVisibility = () => {
    setShowInitialPassword(!showInitialPassword);
  };

  const handleInitialPasswordChange = (newValue) => {
    const maxLength = 100; // Define a maximum allowed password length
  
    if (newValue.length <= maxLength) {
      setInitialPassword(newValue);
      setIsError(false); // Reset isError when password changes
      setIsSuccess(false); // Reset isSuccess when password changes
      setAlertMessage("");
    } else {
      setIsError(true);
      setAlertMessage(`Password should not exceed ${maxLength} characters.`);
    }
  };
  
  const handlePasswordChange = (newValue) => {
    const maxLength = 100; // Define a maximum allowed password length
  
    if (newValue.length <= maxLength) {
      setPassword(newValue);
      setIsError(false); // Reset isError when password changes
      setIsSuccess(false); // Reset isSuccess when password changes
      setAlertMessage("");
    } else {
      setIsError(true);
      setAlertMessage(`Password should not exceed ${maxLength} characters.`);
    }
  };

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

  return (
    <CoverLayout image={bgImage}>      
      <Card   >     
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Reset Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
           Please enter the required information.
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3 }>
            {isSuccess && (
              <MDAlert color="success" dismissible sx={{marginBottom: '10px'}} onClose={() => setIsSuccess(false)}>
                    {alertContent("success", alertMessage)}
              </MDAlert>
            )}
            {isError && (
              <MDAlert color="error" dismissible sx={{marginBottom: '10px'}} onClose={() => {setIsError(false); setEmail('');}}>
                {alertContent("error", alertMessage)}
              </MDAlert>
            )}
            {tokenExpired && (
              <MDAlert color="error" dismissible sx={{marginBottom: '10px'}} onClose={() => {setIsError(false); setEmail('');}}>
                {alertContent("error", setAlertMessage('Token has expired. Please request a new password reset link.'))}
              </MDAlert>
            )}
          <MDBox >       
            <MDBox
                justifyContent="center"
                alignItems="center"
                width="100%"
                mb={2}
            >
                <img
                    src={illustration}
                    alt="illustration"
                    style={{
                        width: "180px",
                        height: "auto",
                        display: "block", // Ensures the image behaves as a block element
                        margin: "0 auto", // Centers the image horizontally
                    }}
                />
            </MDBox>   

            <form onSubmit={handleSubmit}>
              <MDBox >
                <MDInput
                  type={showInitialPassword ? 'text' : 'password'}
                  label="New Password"
                  value={initialPassword}
                  onChange={(e) => handleInitialPasswordChange(e.target.value)}                  
                  fullWidth   
                  required      
                  error={initialPassword && !isValidPassword(initialPassword)}      
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleInitialPasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                          size="small"
                          sx={{marginRight: "15px"}}
                        >
                          {showInitialPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />              
                </MDBox> 
                {initialPassword && !isValidPassword(initialPassword) && (
                  <FormHelperText error>                 
                    * Password should be at least 8 characters long <br/> 
                    * It should contain an uppercase letter, a lowercase letter, and a digit.
                </FormHelperText>
                )}
              <MDBox mt={2}>
                <MDInput
                  type={showPassword ? 'text' : 'password'}
                  label="Re-type Password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}                  
                  fullWidth   
                  required      
                  disabled={initialPassword && !isValidPassword(initialPassword)}
                  error={password && password !== initialPassword}      
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
                {password && password !== initialPassword && (
                <FormHelperText error>
                  * The passwords do not match.
                </FormHelperText>
                )}
              </MDBox>
              <MDBox mt={3} mb={1} width="100%" display="flex" justifyContent="space-between">                
                <MDBox  mb={1} width="47%">
                  <MDButton variant="gradient" color="secondary" fullWidth size="medium" component={Link}
                  to="/authentication/forgot-password">
                    Request New Link
                  </MDButton>
                </MDBox>
                <MDBox  mb={1} width="47%">
                  <MDButton variant="gradient" color="info" fullWidth size="medium" type="submit">
                    Submit
                  </MDButton>
                </MDBox>
              </MDBox>
            </form>

          </MDBox>
        </MDBox>
       
      </Card>
    </CoverLayout>
  );
}

export default Reset_password;
