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

import login_student from '../../../../../assets/images/login_student.png';
import login_registar from '../../../../../assets/images/login_registrar.png';
import illustration from "../../../../../assets/images/illustrations/no-records.png"

// Material Dashboard 2 React components
import MDBox from "../../../../../components/MDBox";
import MDTypography from "../../../../../components/MDTypography";
import MDButton from "../../../../../components/MDButton";
// react-router-dom components
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../context2';

const MetamaskModal = ({ open, onClose, userID, set_user_id }) => {

  const handleClose = () => {
    window.open("https://metamask.io/download.html", "_blank");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Metamask Warning
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
        <Grid container spacing={1} justifyContent="center">
                  
          <Grid item xs={12} sx={{marginBottom:"5px", textAlign: "center"}}>
            <img src={illustration} alt="illustration" style={{
              width: "170px",
              height: "auto", 
            }}/>
          </Grid>
          <Grid item xs={10} sx={{marginBottom:"10px", textAlign: "center"}}>
            <MDTypography variant="h3" color="error" textGradient >No Metamask Detected</MDTypography>     
            <MDTypography variant="body2" mt={3}>
              To interact with this application, you need to install Metamask. Metamask is a browser extension that allows you to interact with the Ethereum blockchain. 
            </MDTypography>           
          </Grid>   
          <Grid item xs={6} sx={{marginTop:"30px", marginBottom:"20px", textAlign: "center"}} >
            <MDButton variant="gradient" color="info" size="large" fullWidth onClick={handleClose}>
              <Icon>install_desktop</Icon> &nbsp; Install Metamask
            </MDButton>
          </Grid>        
            
        </Grid>
    
 
      </DialogContent>
      
    </Dialog>
  );
};

export default MetamaskModal;
