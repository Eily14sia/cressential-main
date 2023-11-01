/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Icon from "@mui/material/Icon";
import Container from '@mui/material/Container';
import Divider from "@mui/material/Divider";

import bg_link from "../../../assets/images/homepage_main.png"
import DefaultInfoCard from "../../../examples/Cards/InfoCards/DefaultInfoCard";
import DefaultProjectCard from "../../../examples/Cards/ProjectCards/DefaultProjectCard";
import Footer from '../../../examples/Footer/index';

import registrar from "../../../assets/images/registrar_long.png";
import student from "../../../assets/images/student_long.png";
import verifier from "../../../assets/images/verifier_long.png";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";

// Authentication layout components
import BasicLayout from "../components/BasicLayout";

// Images
import bgImage from "../../../assets/images/bg-sign-in-basic.jpeg";
import Album from "../../../examples/Album";

function Basic({userID, set_user_id} ) {

  const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    // <BasicLayout image={bgImage}>
    <BasicLayout userID={userID} set_user_id={set_user_id}>
      <Box mt={3} sx={{ pt: 8 }} >
        <Container maxWidth="sm" >
          <Grid container spacing={2}>
              <Grid item xs={12} md={5} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <MDTypography variant="h1" gutterBottom>
                  Take verifier experience to the{' '}
                  <span style={{ color: '#1A73E8', display: 'inline', fontSize: 'inherit' }}>
                      next level
                  </span>
                  </MDTypography>
                  <MDTypography
                      variant="h5"
                      fontWeight="regular"
                      color="text"
                  >
                  Revolutionize the verifier experience through a dedicated portal designed for efficiency, streamlining access and simplifying the verification process. 
                  </MDTypography>
                  <Stack
                  sx={{ pt: 4 }}
                  direction="row"
                  >
                    <Link to="/verifier-portal" component={RouterLink}>
                      <MDButton variant="gradient" color="info" type="submit">
                      Verifier Portal&nbsp;
                      <Icon>arrow_right_alt</Icon>
                      </MDButton>
                    </Link>
                  </Stack>
              </Grid>
              <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'flex-end' }}>  
                  <MDBox p={5}>
                      <img
                      src={bg_link}
                      alt="Your Alt Text"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />  
                      </MDBox>      
              </Grid>
          </Grid>
        </Container>
      </Box>
      <MDBox component="section" py={6} sx={{ backgroundColor: '#f8f9fa'}}>
        <Container>
          <Grid container item xs={12} lg={6} justifyContent="center" mx="auto" textAlign="center">
            <MDTypography variant="h2" mb={2}>
              Type of Users
            </MDTypography>
            <MDTypography variant="body2" color="text" mb={2}>
            Dive into the Rich Tapestry of User Profiles within Our Web System
            </MDTypography>
          </Grid>
          <Divider sx={{ my: 5 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={4} mb={{ xs: 3, lg: 0 }}>
              {/* <DefaultInfoCard
                icon="person_3"
                title="Registrar"
                description="Effortlessly manage academic records and ensure seamless administrative processes with our registrar-focused tools."
              /> */}
              <MDBox p={5} bgColor="white" style={{ borderRadius: '20px' }}> 
                <DefaultProjectCard
                  image={registrar}
                  label="User #1"
                  title="Registrar"
                  description="Effortlessly manage academic records and ensure seamless administrative processes with our registrar-focused tools."
                  action={false}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={8} lg={4} mb={{ xs: 3, lg: 0 }}>
              {/* <DefaultInfoCard
                icon="person"
                color="info"
                title="Student"
                description="Access your academic records and keep your educational history at your fingertips with our student and alumni portal."
              /> */}
              <MDBox p={5} bgColor="white" style={{ borderRadius: '20px' }}> 
                <DefaultProjectCard
                  image={student}
                  label="User #2"
                  title="Student/Alumni"
                  description="Access your academic records and keep your educational history at your fingertips with our student and alumni portal."
                  action={false}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={8} lg={4} mb={{ xs: 3, lg: 0 }}>
              {/* <DefaultInfoCard
                icon="verified"
                title="Verifier"
                description="Simplify the verification process, authenticate academic credentials, and enjoy an efficient experience through our dedicated verifier portal."
              /> */}
              <MDBox p={5} bgColor="white" style={{ borderRadius: '20px' }}> 
                <DefaultProjectCard
                  image={verifier}
                  label="User #3"
                  title="Verifier"
                  description="Simplify the verification process, authenticate academic credentials, and enjoy an efficient experience through our dedicated verifier portal."
                  action={false}
                />
              </MDBox>
            </Grid>
          </Grid>
          
          
        </Container>
        
      </MDBox>
      <MDBox py={6} >
          <Footer/>
      </MDBox> 
    </BasicLayout>
  );
}

export default Basic;
