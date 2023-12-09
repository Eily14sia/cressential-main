import { useState, useEffect } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
import MDAlert from "../../../components/MDAlert";
import axios from 'axios';

// Authentication layout components
import CoverLayout from "../components/CoverLayout";

// Images
import bgImage from "../../../assets/images/university.jpg";
import illustration from "../../../assets/images/illustrations/fogot.svg"


// Authentication pages components
import { useAuth } from '../../../context2';

function Log_in() {
  const { 
    setEmail,
    email } = useAuth();

  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);  

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );

  const emailResetPassword = async (toEmail, token) => {

    const password_token = encodeURIComponent(localStorage.getItem('password_token'));
    const modifiedToken = password_token.replace(/\./g, '+'); // Replace dots with underscores
    const resetLink = `https://cressential-5435c63fb5d8.herokuapp.com/authentication/reset-password/${modifiedToken}`;
    
    const emailData = {
      to: toEmail,
      subject: 'Password Reset Link',
      text: `
      Good day!
  
      You have requested to reset your password. Please click on the following link to reset your password:

      ${resetLink}
  
      If you did not initiate this request, you can safely ignore this email.
  
      Thank you,
      Registrar's Office
      `,
    };
  
    try {
      const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/emails/send-email', emailData);
      if (response.status === 200) {
        console.log('Email sent successfully.');
        return true;
      } else {
        console.error('Failed to send email.');
        return false;
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const checkEmail = async (e) => {
    e.preventDefault();

    const record = {
      email: email,
    };
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)?(gmail|yahoo|edu\.ph)(?:\.[a-zA-Z]{2,})$/i;
    
    if (!email){
      setIsError(true);
      setAlertMessage("Email is required.");
    } else {
      if (emailRegex.test(email.toLowerCase())) {

        try {
          // Make an authentication request to your server or API
          const response = await fetch('https://cressential-5435c63fb5d8.herokuapp.com/mysql/check-email', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ record }),
          });
      
          if (response.ok) {
          const data = await response.json();
          const token = data.token; // Assuming the token is returned from the server
          const user_email = data.user.email;
          localStorage.setItem('password_token', token);
          
          const emailSuccess = await emailResetPassword(user_email, token);
            if (emailSuccess){
              setIsSuccess(true);
              setAlertMessage('Email sent successfully. Please check your inbox for the password reset link.');
            } else {
              setIsError(true);
              setAlertMessage('Failed to send email.');
            }

          }  else if (response.status === 404) {
            setIsError(true);
            setAlertMessage('Email not found.');          
          }
        } catch (error) {
            console.error('Error:', error);
        }
      } else {
        setIsError(true);
        setAlertMessage('Invalid email format. Email should be a valid Gmail, Yahoo or School email.');
      }
    }
    setEmail('');
  };

  const handleEmailChange = (newValue) => {
    const maxLength = 100; // Define a maximum allowed email length
  
    if (newValue.length <= maxLength) {
      setEmail(newValue);
      setIsError(false); // Reset isError when email changes
      setIsSuccess(false); // Reset isSuccess when email changes
      setAlertMessage("");
    } else {
      setIsError(true);
      setAlertMessage(`Email should not exceed ${maxLength} characters.`);
    }
  };
  

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
            Forgot Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
           Please enter your registered email address.
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
          <MDBox >
            <MDBox
                justifyContent="center"
                alignItems="center"
                width="100%"
            >
                <img
                    src={illustration}
                    alt="illustration"
                    style={{
                        width: "280px",
                        height: "auto",
                        display: "block", // Ensures the image behaves as a block element
                        margin: "0 auto", // Centers the image horizontally
                    }}
                />
            </MDBox>

            <form onSubmit={checkEmail}>
              <MDBox mb={2}>
                <MDInput value={email} type="email" required label="Email" fullWidth onChange={(e) => handleEmailChange(e.target.value)} />
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" size="medium" fullWidth type="submit">
                  Submit
                </MDButton>
              </MDBox>
            </form>

          </MDBox>
        </MDBox>
       
      </Card>
    </CoverLayout>
  );
}

export default Log_in;
