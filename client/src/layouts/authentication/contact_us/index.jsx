import { useState, useEffect } from "react";

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from "@mui/material/Divider";
import breakpoints from "../../../assets/theme/base/breakpoints";
import Footer from '../../../examples/Footer/index';

import contact_us from "../../../assets/images/contact.png";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";

// Authentication layout components
import BasicLayout from "../components/BasicLayout";
import Mobile_view from "./components/mobile_view";
import Tablet_view from "./components/tablet_view";
import { List, ListItem, ListItemText, ListItemIcon,
    Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
    <BasicLayout>
        <Box mt={3} sx={{ pt: 8 }} >
            <Container maxWidth="lg">
                
            {mobileView && <Mobile_view />}
            {tabletView && !mobileView && <Tablet_view />}
            {!mobileView && !tabletView && (
                <>
                <MDTypography variant="h1" align="center" mt={7} gutterBottom>
                    Contact Our Team
                </MDTypography>
                <MDTypography variant="body1" align="center">
                    We're all ears - Get in Touch with Our Team of Tech Enthusiasts
                </MDTypography>
                <Grid container spacing={2} >
                    <Grid item xs={12} align="center" lg={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>  
                        <MDBox p={5}>
                            <img
                            src={contact_us}
                            alt="Contact us"
                            style={{ width: '70%', height: 'auto' }}
                        />  
                            </MDBox>      
                    </Grid>
                </Grid>     

                
                </>
               )} 
               <Divider sx={{ mb: 3 }} />
               <Grid container spacing={3} mt={3}>                
                    
                    <Grid item xs={12} md={12} lg={8}>
                        <Card elevation={3} style={{ padding: '20px' }}>
                            <MDTypography variant="h4" gutterBottom>
                                FAQs
                            </MDTypography>
                            <List>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="faq-panel1a-content"
                                        id="faq-panel1a-header"
                                    >
                                        <MDTypography variant="subtitle1">Question 1</MDTypography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <MDTypography variant="body2">
                                        Answer to the question goes here.
                                        </MDTypography>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="faq-panel2a-content"
                                        id="faq-panel2a-header"
                                    >
                                        <MDTypography variant="subtitle1">Question 2</MDTypography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <MDTypography variant="body2">
                                        Answer to the question goes here.
                                        </MDTypography>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="faq-panel1a-content"
                                        id="faq-panel1a-header"
                                    >
                                        <MDTypography variant="subtitle1">Question 3</MDTypography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <MDTypography variant="body2">
                                        Answer to the question goes here.
                                        </MDTypography>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="faq-panel2a-content"
                                        id="faq-panel2a-header"
                                    >
                                        <MDTypography variant="subtitle1">Question 4</MDTypography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <MDTypography variant="body2">
                                        Answer to the question goes here.
                                        </MDTypography>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="faq-panel2a-content"
                                        id="faq-panel2a-header"
                                    >
                                        <MDTypography variant="subtitle1">Question 5</MDTypography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <MDTypography variant="body2">
                                        Answer to the question goes here.
                                        </MDTypography>
                                    </AccordionDetails>
                                </Accordion>
                            </List>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                        <Card elevation={3} style={{ padding: '20px' }}>
                        <MDTypography variant="h4" gutterBottom>
                            Contact Information
                        </MDTypography>
                        <List>
                            <ListItem>
                            <ListItemIcon>
                                <PhoneIcon />
                            </ListItemIcon>
                            <ListItemText primary="Phone" secondary="+63 912 345 6789" />
                            </ListItem>
                            <ListItem>
                            <ListItemIcon>
                                <EmailIcon />
                            </ListItemIcon>
                            <ListItemText primary="Email" secondary="cressential.record@gmail.com" />
                            </ListItem>
                            <ListItem>
                            <ListItemIcon>
                                <LocationOnIcon />
                            </ListItemIcon>
                            <ListItemText primary="Address" secondary="Gen. Luna corner Muralla St., Intramuros Manila, Philippines 1002" />
                            </ListItem>
                        </List>
                        </Card>
                    </Grid>
                </Grid>    
            </Container>
          
        </Box>
        <MDBox py={6} >
            <Footer/>
        </MDBox> 
    </BasicLayout>
  );
}

export default Basic;
