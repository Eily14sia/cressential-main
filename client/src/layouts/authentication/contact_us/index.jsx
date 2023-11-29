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
                                {/* Question # 1 */}
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="faq-panel1a-content"
                                        id="faq-panel1a-header"
                                    >
                                        <MDTypography variant="body1">
                                            What is Cressential?
                                        </MDTypography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <MDTypography variant="body2">
                                            Cressential is an innovative academic records management system developed as part of our Bachelor of Science in Information Technology capstone project. It leverages web 3 technologies, specifically blockchain, IPFS and Smart Contract, to issue and verify academic credentials securely and efficiently.
                                        </MDTypography>
                                    </AccordionDetails>
                                </Accordion>
                                {/* Question # 2 */}
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="faq-panel2a-content"
                                        id="faq-panel2a-header"
                                    >
                                        <MDTypography variant="body1">
                                        How does Cressential use blockchain technology?
                                        </MDTypography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <MDTypography variant="body2">
                                        Cressential maximizes blockchain's security by storing academic records on Interplenatary File System (IPFS), referencing their unique code (multihash) in the blockchain. During verification, the stored multihash in the bloackchain is fetched. A comparison between the retrieved file's hash and the received record's hash ensures integrity. Any mismatch alerts possible data tampering, ensuring a secure and immutable academic record verification process.                                   
                                        </MDTypography>
                                    </AccordionDetails>
                                </Accordion>
                                {/* Question # 3 */}
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="faq-panel1a-content"
                                        id="faq-panel1a-header"
                                    >
                                        <MDTypography variant="body1">
                                        What problem does Cressential aim to solve?
                                        </MDTypography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <MDTypography variant="body2">
                                        Cressential addresses issues of credential fraud and labor-intensive verification processes in academic record management. By employing blockchain-based issuance and verification, it enhances data security, authenticity, and accessibility for academic credentials.
                                        </MDTypography>
                                    </AccordionDetails>
                                </Accordion>
                                {/* Question # 4 */}
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="faq-panel2a-content"
                                        id="faq-panel2a-header"
                                    >
                                        <MDTypography variant="body1">
                                        How does Cressential ensure security for academic records?                                     
                                        </MDTypography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <MDTypography variant="body2">
                                        While academic records themselves are stored in IPFS—a decentralized and resilient file system—Cressential stores the multihash (a cryptographic fingerprint) of each record on the blockchain. This approach ensures the integrity and authenticity of records. Smart contracts within the blockchain network automate verification processes, ensuring tamper-proof records without relying on intermediaries. Blockchain's immutable nature coupled with IPFS's decentralized storage fortifies the security of academic credentials within Cressential.                                        </MDTypography>
                                    </AccordionDetails>
                                </Accordion>
                                {/* Question # 5 */}
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="faq-panel2a-content"
                                        id="faq-panel2a-header"
                                    >
                                        <MDTypography variant="body1">
                                        What benefits does Cressential offer to students and institutions?
                                        </MDTypography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <MDTypography variant="body2">
                                        Cressential streamlines the academic credential process, offering students ownership and control over their records while simplifying verification for institutions. It ensures data integrity, reduces fraud, and enhances the credibility of academic credentials.                                        </MDTypography>
                                    </AccordionDetails>
                                </Accordion>
                                {/* Question # 6 */}
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="faq-panel2a-content"
                                        id="faq-panel2a-header"
                                    >
                                        <MDTypography variant="body1">
                                        What sets Cressential apart from traditional academic records management systems?                                        
                                        </MDTypography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <MDTypography variant="body2">
                                        Cressential eliminates the risk of record falsification or loss by providing a decentralized and transparent platform. It enables instant verification, reduces administrative burden, and empowers individuals to control and share their academic achievements securely.                                        </MDTypography>
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
