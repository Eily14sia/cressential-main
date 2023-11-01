import React from 'react';
// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";

import illustration from "../../assets/images/illustrations/security-error.svg"

// @mui material components
import Grid from "@mui/material/Grid";

const Unauthorized = () => {
  return (
    <div>
      <MDBox   
                  p={10}
                  mb={1}
                 
                  >
                  <Grid container spacing={2} justifyContent="center" alignItems="center">                    
                      <Grid item xs={12} sx={{marginBottom:"10px", textAlign: "center"}}>
                        <img src={illustration} alt="illustration" style={{
                          width: "250px",
                          height: "auto", 
                        }}/>
                        </Grid>
                        <Grid item xs={10} sx={{marginBottom:"10px", textAlign: "center"}}>
                          <MDTypography variant="h1" color="error" textGradient >Access to this page is restricted!</MDTypography>     
                          <MDTypography variant="body2" mt={2}>
                          Please check with the site admin if you believe this is a mistake.
                          </MDTypography>           
                        </Grid>        
                                      
                     
                  </Grid>
                  </MDBox>
    </div>
  );
};

export default Unauthorized;
