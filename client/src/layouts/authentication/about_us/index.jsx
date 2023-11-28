// @mui material components
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from "@mui/material/Divider";

import DefaultProjectCard from "../../../examples/Cards/ProjectCards/HomeProjectCard";
import Footer from '../../../examples/Footer/index';
import CustomCard from '../../../examples/Cards/InfoCards/DefaultInfoCard';

import dhar from "../../../assets/images/m_dhar.png";
import denize from "../../../assets/images/m_denize.png";
import bry from "../../../assets/images/m_bry.png";
import barvs from "../../../assets/images/m_barvs.png";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";

// Authentication layout components
import BasicLayout from "../components/BasicLayout";

function Basic({userID, set_user_id} ) {

  return (
    // <BasicLayout image={bgImage}>
    <BasicLayout>
        <Box mt={3} sx={{ pt: 8 }} >
        <Container maxWidth="lg">
            <MDTypography variant="h1" align="center" mt={7} gutterBottom>
                About Us
            </MDTypography>
            <MDTypography variant="body1" mb={10} align="center">
                Empowering Tomorrow's Tech Innovators.
            </MDTypography>
        <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
                <CustomCard 
                    title="Our Mission" 
                    icon="flag"
                    description="At Cressential, our mission is to revolutionize academic records management using blockchain-based smart contracts. We're dedicated to creating a secure, transparent, and efficient system for issuing and verifying academic credentials globally."
                />     
            </Grid>
            <Grid item xs={12} lg={4}>
                <CustomCard 
                    title="Our Vision" 
                    icon="visibility"
                    description="Our vision at Cressential is to create an impactful solution for academic records management. As BS Information Technology students, we aim to develop a practical and innovative blockchain-based platform for issuing and verifying academic credentials."
                />                
            </Grid>
            <Grid item xs={12} lg={4}>
                <CustomCard 
                    title="Our Values" 
                    icon="grade"
                    description="Innovation fuels our pursuit of transforming academic records management. We uphold integrity, collaborate for success, prioritize accessibility, and strive for excellence in our solutions, ensuring a secure and inclusive platform for all users.
                    "
                />                  
            </Grid>
            
        </Grid>
        </Container>
      </Box>
      <MDBox component="section" py={6} >
        <Container >
          <Grid container item xs={12} lg={6} justifyContent="center" mx="auto" textAlign="center">
            <MDTypography variant="h2" mt={7} mb={2}>
              Our Team
            </MDTypography>
            <MDTypography variant="body2" color="text" mb={2}>
            Meet the talented individuals who make up our team! We have a diverse group of students passionate about technology.
            </MDTypography>
          </Grid>
          <Divider sx={{ my: 5 }} />
          <Grid container spacing={3} justifyContent="center" mx="auto" >
            <Grid item xs={12} md={6} lg={3} mb={{ xs: 3, lg: 0 }}>
              <MDBox p={5} bgColor="white" style={{ borderRadius: '20px' }}> 
                <DefaultProjectCard
                  image={bry}
                  label="Technical Writer"
                  title="Bryan De Guzman"
                  description="Focuses on articulating technical details and implementation strategies within the thesis.
                  Edits the content, ensuring clarity and adherence to academic writing standards."
                  action={false}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3} mb={{ xs: 3, lg: 0 }}>
              <MDBox p={5} bgColor="white" style={{ borderRadius: '20px' }}> 
                <DefaultProjectCard
                  image={dhar}
                  label="Developer"
                  title="Dharlene Grefiel"
                  description="Responsible for designing and implementing the user interface (UI) of the web platform using React JS and Material UI. Also manages the server-side logic, database architecture, and application integration."
                  action={false}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3} mb={{ xs: 3, lg: 0 }}>
              <MDBox p={5} bgColor="white" style={{ borderRadius: '20px' }}> 
                <DefaultProjectCard
                  image={barvs}
                  label="Developer"
                  title="Barveily Engco"
                  description="Focuses on building the backend infrastructure and APIs required for the functioning of the web application. This involves working with Node.js, web 3 technologies and managing the data flow."
                  action={false}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3} mb={{ xs: 3, lg: 0 }}>
              <MDBox p={5} bgColor="white" style={{ borderRadius: '20px' }}> 
                <DefaultProjectCard
                  image={denize}
                  label="Technical Writer"
                  title="Denize Gozun"
                  description="Conducts in-depth research on the chosen topic related to academic records management, blockchain technology, or smart contracts.
                  Compiles information and drafts sections of the thesis paper."
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
