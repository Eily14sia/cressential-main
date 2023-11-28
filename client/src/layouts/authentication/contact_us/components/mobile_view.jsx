import React from 'react'
// @mui material components
import Grid from '@mui/material/Grid';
import contact_us from "../../../../assets/images/contact.png";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";


const mobile_view = () => {
  return (
    <>
        <MDTypography variant="h3" align="center" mt={7} gutterBottom>
            Contact Our Team
        </MDTypography>
        <MDTypography variant="body2" align="center">
            We're all ears - Get in Touch with Our Team of Tech Enthusiasts
        </MDTypography>
        <Grid container spacing={2} >
            <Grid item xs={12} align="center" lg={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>  
                <MDBox p={2}>
                    <img
                    src={contact_us}
                    alt="Contact us"
                    style={{ width: '100%', height: 'auto' }}
                />  
                    </MDBox>      
            </Grid>
        </Grid>     

            
    </>
  )
}

export default mobile_view