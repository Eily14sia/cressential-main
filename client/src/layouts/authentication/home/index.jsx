import { useState, useEffect } from "react";

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
import breakpoints from "../../../assets/theme/base/breakpoints";

import bg_link from "../../../assets/images/home_final.png"
import DefaultInfoCard from "../../../examples/Cards/InfoCards/DefaultInfoCard";
import DefaultProjectCard from "../../../examples/Cards/ProjectCards/HomeProjectCard";
import Footer from '../../../examples/Footer/index';

import registrar from "../../../assets/images/final_registrars.png";
import student from "../../../assets/images/final_student.png";
import verifier from "../../../assets/images/final_verifier.png";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";

// Authentication layout components
import BasicLayout from "../components/BasicLayout";
import Mobile_view from "./components/mobile_view";
import Tablet_view from "./components/tablet_view";

function Basic({userID, set_user_id} ) {
  const [mobileView, setMobileView] = useState(false);
  const [tabletView, setTabletView] = useState(false);

  useEffect(() => {
    function handleResize() {
      const isTablet = window.innerWidth >= breakpoints.values.sm && window.innerWidth < breakpoints.values.lg;
      const isMobile = window.innerWidth < breakpoints.values.sm;

      setTabletView(isTablet);
      setMobileView(isMobile);
    }

    // Initial setup
    handleResize();

    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoints]);

  return (
    // <BasicLayout image={bgImage}>
    <BasicLayout userID={userID} set_user_id={set_user_id}>
      <Box mt={3} sx={{ pt: 8 }} my={10}>
        <Container >         
        {mobileView && <Mobile_view />}
          {tabletView && !mobileView && <Tablet_view />}
          {!mobileView && !tabletView && (
              <Grid container spacing={2} >
                <Grid item xs={12} lg={5} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                <Grid item xs={12} lg={7} sx={{ display: 'flex', justifyContent: 'flex-end' }}>  
                    <MDBox p={5}>
                        <img
                        src={bg_link}
                        alt="Your Alt Text"
                        style={{ width: '100%', height: 'auto' }}
                    />  
                        </MDBox>      
                </Grid>
              </Grid>             
              )}
          
        </Container>
      </Box>
      <MDBox component="section" py={6} sx={{backgroundColor: '#f8f9fa'}}>
        <Container sx={{mb: 8 }}> 
          <Grid container item xs={12} lg={6} justifyContent="center" mx="auto" textAlign="center">
            <MDTypography variant="h2" mt={8} mb={2}>
              User Profiles
            </MDTypography>
            <MDTypography variant="body2" color="text" mb={2}>
            Dive into the Rich Tapestry of User Profiles within Our Web System
            </MDTypography>
          </Grid>
          <Divider sx={{ mt: 5 , mb: 10}} />
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={8} lg={4} mb={{ xs: 3, lg: 0 }}>
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
