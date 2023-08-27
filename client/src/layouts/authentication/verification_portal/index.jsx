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
import * as React from 'react';
// react-router-dom components
import { Link } from "react-router-dom";


import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";

// Authentication layout components
import CoverLayout from "../components/CoverLayout";

// Images
import bgImage from "../../../assets/images/university.jpg";
// Authentication pages components
import Footer from "../components/Footer";

function Cover() {


  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Verify Academic Record
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
           Enter the required information and upload the PDF File
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="text" label="Transaction Number" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={4}>
              <MDInput type="password" label="Password" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
                <MDInput fullWidth variant="standard" 
                    type="file"
                    accept=".jpg, .png, .jpeg"
                    // Add more props as needed
                  />              
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth>
                Verify Record
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Results will show here                
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
        {/* <MDBox pt={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput type="text" label="Text" fullWidth />
              </MDBox>
              <MDBox>
                <MDInput type="password" label="Password" fullWidth />
              </MDBox>              
              <MDBox mb={1}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel>Select an option</InputLabel>
                  <Select style={{ height: "40px" }}
                    label="Select an option"
                    // Add more props as needed
                  >
                    <MenuItem value="option1">Option 1</MenuItem>
                    <MenuItem value="option2">Option 2</MenuItem>
                    <MenuItem value="option3">Option 3</MenuItem>
                  </Select>
                </FormControl>
              </MDBox>
              <MDBox mb={2}>
                <MDInput fullWidth
                    type="file"
                    accept=".jpg, .png, .jpeg"
                    // Add more props as needed
                  />              </MDBox>
              <MDBox mt={4} mb={1}>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link to="/graduate-record/add-record" component={RouterLink}>
                      <MDButton variant="gradient" color="info" type="submit">
                        Submit&nbsp;
                        <Icon>add</Icon>
                      </MDButton>
                    </Link>
                  </Grid>
                </Grid>
              </MDBox>
            </MDBox>
          </MDBox> */}
      </Card>
    </CoverLayout>
  );
}

export default Cover;
