import React, { useState } from 'react';
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



const LoginModal = ({ open, onClose }) => {

  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleClose = () => {
    setSelectedOption('');
    onClose();
  };

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
                onClick={() => handleOptionClick('student')}
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
                onClick={() => handleOptionClick('registrar')}
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
                      Registar
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
        >
          Connect Wallet
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;
