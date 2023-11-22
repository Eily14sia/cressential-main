import { useState } from "react";

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

// Authentication layout components
import CoverLayout from "../components/CoverLayout";

// Images
import bgImage from "../../../assets/images/university.jpg";
import LoginModal from '../components/ConnectWallet';
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Authentication pages components
import { useAuth } from '../../../context2';

function Log_in() {
  const { 
    login,
    setEmail,
    password,
    setPassword,
    setAlertMessage,
    alertMessage, 
    isSuccess, setIsSuccess,
    isError, setIsError } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            Log in
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
           Enter the required information.
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3 }>
            {isSuccess && (
              <MDAlert color="success" dismissible sx={{marginBottom: '40px'}} onClose={() => setIsSuccess(false)}>
                    {alertContent("success", alertMessage)}
              </MDAlert>
            )}
            {isError && (
              <MDAlert color="error" dismissible sx={{marginBottom: '20px'}} onClose={() => setIsError(false)}>
                {alertContent("error", alertMessage)}
              </MDAlert>
            )}
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="email" label="Email" fullWidth onChange={(e) => setEmail(e.target.value)} />
            </MDBox>
            <MDBox mb={2}>
              {/* <MDInput type="password" label="Password" onChange={(e) => setPassword(e.target.value)} fullWidth /> */}
              <MDInput
                 type={showPassword ? 'text' : 'password'}
                 label="Password"
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
            <MDBox display="flex" alignItems="center" ml={1}>
              <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="regular"
                  textGradient
                >
                  Forgot Password?
                </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={login}>
               Log in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Log in with {" "}
                <MDTypography
                  component={Link}
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient                  
                  onClick={handleOpenDialog}
                >
                  Metamask
                </MDTypography>
                <LoginModal  open={isDialogOpen} onClose={handleCloseDialog} />
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
       
      </Card>
    </CoverLayout>
  );
}

export default Log_in;
