import React, { useState, useEffect } from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
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

  const handleLogin = () => {
    // Call the login function
    connectWallet();
  };
  
  // Define a function to handle form submission
  // const login = async () => {
  //   try {
  //     // Make an authentication request to your server or API
  //     const response = await fetch('http://localhost:8081/mysql/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ walletAddress }),
  //     });
  
  //     if (response.ok) {
  //       const data = await response.json();
  //       const token = data.token; // Assuming the token is returned from the server
        
  //       // Save the token in localStorage or sessionStorage
  //       localStorage.setItem('token', token);
        
  //       // Redirect the user to the dashboard or perform other actions
  //       console.log('Login successful');
  //       navigate('/dashboard');
  //     } else {
  //       // Authentication failed
  //       // You can display an error message to the user
  //       console.error('Login failed');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  // Use a useEffect to trigger login when walletAddress changes
// useEffect(() => {
//   if (walletAddress) {
//     login();
//   }
// }, [walletAddress]);



  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Login as:
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
        <Grid container spacing={5} justifyContent="center" alignItems="center" style={{ paddingLeft: '35px', paddingRight: '35px' }} > 
            <Grid item xs={12} md={6} textAlign="center" >
              <Card sx={{
                  maxWidth: 345,
                  borderColor: selectedOption === 'student' ? 'light' : 'transparent',
                  borderWidth: selectedOption === 'student' ? 2 : 0,
                }}
                onClick={() => {
                  handleOptionClick('student');           
                }}
                className={selectedOption === 'student' ? 'selected-card' : ''}
              >
                <CardActionArea   >
                  <CardMedia      
                    style={{
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '90%',
                      maxHeight: '90%',
                      margin: 'auto'
                    }}             
                    component="img"
                    height="140"
                    image={login_student}
                    alt="login_Student"
                  />
                  <CardContent>
                    <MDTypography gutterBottom variant="h5" component="div">
                      Student
                    </MDTypography>
                    <MDTypography variant="caption" fontWeight="light" color="inherit">
                      Lizards are a widespread group of squamate reptiles, with over 6,000
                      species.
                    </MDTypography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} textAlign="center">
              <Card sx={{
                  maxWidth: 345,
                  borderColor: selectedOption === 'registrar' ? 'light' : 'transparent',
                  borderWidth: selectedOption === 'registrar' ? 2 : 0,
                }}
                onClick={() => {
                  handleOptionClick('registrar');        
                }}
                className={selectedOption === 'registrar' ? 'selected-card' : ''}
              >
                <CardActionArea>
                  <CardMedia      
                    style={{
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '90%',
                      maxHeight: '90%',
                      margin: 'auto'
                    }}             
                    component="img"
                    height="140"
                    image={login_registar}
                    alt="login_registar"
                  />
                  <CardContent>
                    <MDTypography gutterBottom variant="h5" component="div">
                      Registrar
                    </MDTypography>
                    <MDTypography variant="caption" fontWeight="light" color="inherit">
                      Lizards are a widespread group of squamate reptiles, with over 6,000
                      species.
                    </MDTypography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
        </Grid>
      </DialogContent>
      <MDBox
        component="hr"
        sx={{ opacity: 0.2 }} // Adjust this value to control the opacity level
      />
      <DialogActions>
        <MDButton onClick={handleClose} color="secondary">
          Cancel
        </MDButton>
        <MDButton
          variant="contained"
          color="info"
          disabled={!selectedOption}
          onClick={handleLogin}
        >
          Connect Wallet
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;
