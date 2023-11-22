import React, { useState, useEffect } from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Icon
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import MDTypography from '@mui/material/MDTypography';
import { CardActionArea } from '@mui/material';
import Divider from "@mui/material/Divider";

import login_student from '../../../../assets/images/login_student.png';
import login_registar from '../../../../assets/images/login_registrar.png';
import illustration from "../../../../assets/images/illustrations/access-denied.png"

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
// react-router-dom components
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context2';

const LoginModal = ({ open, onClose, userID, set_user_id }) => {
  const [selectedOption, setSelectedOption] = useState('');
  // const [walletAddress, setWalletAddress] = useState('');
  const navigate = useNavigate();
  const { connectWallet} = useAuth();

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    
  };

  const handleClose = () => {
    setSelectedOption('');
    onClose();
  };

  const handleLogin = async () => {
    // Call the login function
    await connectWallet();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Login User
        <IconButton
          sx={{
            position: 'absolute',
            right: '20px',
            top: '8px',
          }}
          edge="end"
          color="inherit"
          onClick={handleClose}
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
        <Grid container spacing={1} justifyContent="center">
                  
                  <Grid item xs={12} sx={{marginBottom:"5px", textAlign: "center"}}>
                    <img src={illustration} alt="illustration" style={{
                      width: "170px",
                      height: "auto", 
                    }}/>
                    </Grid>
                    <Grid item xs={10} sx={{marginBottom:"10px", textAlign: "center"}}>
                      <MDTypography variant="h3" color="info" textGradient >Login with Metamask</MDTypography>     
                      <MDTypography variant="body2" mt={3}>
                        By clicking the 'Connect Wallet' button, you are allowing the application to access your Metamask account.
                      </MDTypography>           
                    </Grid>   
                    <Grid item xs={6} sx={{marginTop:"30px", marginBottom:"20px", textAlign: "center"}} >
                     
                      <MDButton variant="gradient" color="info" size="large" fullWidth onClick={handleLogin} >
                          <Icon>lock_open_icon</Icon> &nbsp; Connect Wallet 
                      </MDButton>

                  </Grid>        
                  
              </Grid>
    
 
      </DialogContent>
      
    </Dialog>
  );
};

export default LoginModal;
