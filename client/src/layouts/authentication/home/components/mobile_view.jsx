import React from 'react'

// react-router-dom components
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Icon from "@mui/material/Icon";

import bg_link from "../../../../assets/images/home_final.png"

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";


const mobile_view = () => {
  return (
    <Grid container spacing={2}>
        <Grid item xs={12} lg={5} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <MDBox mt={6} px={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >

                <MDTypography variant="h4" gutterBottom textAlign="center" fontWeight="bold"> 
                Take verifier experience <br></br>to the{' '}
                <span style={{ color: '#1A73E8', display: 'inline', fontSize: 'inherit' }}>
                    next level
                </span>
                </MDTypography>
                <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    textAlign="center"
                >
                Revolutionize the verifier experience through a dedicated portal designed for efficiency, streamlining access and simplifying the verification process. 
                </MDTypography>
                <Stack
                sx={{ pt: 4 }}
                direction="row"
                >
                <Link to="/verifier-portal" component={RouterLink}>
                    <MDButton variant="gradient" size="small" color="info" type="submit">
                    Verifier Portal&nbsp;
                    <Icon>arrow_right_alt</Icon>
                    </MDButton>
                </Link>
                </Stack>
            </MDBox>
        </Grid>
        <Grid item xs={12} lg={7}  sx={{ display: 'flex', justifyContent: 'flex-end' }}>  
            <MDBox p={5}>
                <img
                src={bg_link}
                alt="Your Alt Text"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />  
                </MDBox>      
        </Grid>
    </Grid>
  )
}

export default mobile_view