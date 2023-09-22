import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import MDInput from "../../../components/MDInput";
import MDBadge from "../../../components/MDBadge";

// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import DataTable from "../../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";

import { useMaterialUIController } from "../../../context";

function Add_Record() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedItemID, setSelectedItemID] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/mysql/type-of-record")
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the fetched data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    { Header: "Type", accessor: "type"},
    { Header: "Price", accessor: "price", align: "center"},
    { Header: "Action", accessor: "action", align: "center"}
  ];


  return (
    <DashboardLayout>
      <DashboardNavbar />
        <MDBox pt={6} pb={3}>          
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>              
              <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >                 
                  <Link to="/student-management" component={RouterLink}>
                    <MDButton variant="gradient" color="dark">
                      <Icon>arrow_back</Icon>&nbsp; Back
                    </MDButton>
                  </Link>
                </MDBox>
                <MDBox pt={4} pb={3} px={5}>
                  <Grid container spacing={7}>

                    {/* LEFT COLUMN */}                  
                    <Grid item lg={6} sm={12} >  
                                
                      <Grid container spacing={2}>

                        {/* STUDENT INFORMATION */}   
                        <Grid item xs={12} sx={{margin:"auto"}}>
                          <MDTypography fontWeight={"bold"}>Student Information</MDTypography>                         
                        </Grid>
                        <Grid item xs={3} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">Last Name:</MDTypography>
                        </Grid>
                        <Grid item xs={9}>
                          <MDInput type="text"  label="Enter Last Name" fullWidth/>
                        </Grid>
                        <Grid item xs={3} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">First Name:</MDTypography>
                        </Grid>
                        <Grid item xs={9}>
                          <MDInput type="text"  label="Enter First Name" fullWidth/>
                        </Grid>
                        <Grid item xs={3} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">Middle Name:</MDTypography>
                        </Grid>
                        <Grid item xs={9}>
                          <MDInput type="text"  label="Enter Middle Name" fullWidth/>
                        </Grid>
                        <Grid item xs={3} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">Student No:</MDTypography>
                        </Grid>
                        <Grid item xs={9}>
                          <MDInput type="text"  label="Enter Student Number" fullWidth/>
                        </Grid>
                        <Grid item xs={3} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">Wallet Address:</MDTypography>
                        </Grid>
                        <Grid item xs={9}>
                          <MDInput type="text"  label="Enter wallet address" fullWidth/>
                        </Grid>
                        <Grid item xs={3} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">College:</MDTypography>
                        </Grid>
                        <Grid item xs={9}>
                          <MDInput type="text" fullWidth/>
                        </Grid>
                        <Grid item xs={3} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">Course:</MDTypography>
                        </Grid>
                        <Grid item xs={9}>
                          <MDInput type="text" fullWidth/>
                        </Grid>
                        <Grid item xs={4} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">Entry Year:</MDTypography>
                        </Grid>
                        <Grid item xs={4} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">From:</MDTypography>
                        </Grid>
                        <Grid item xs={4} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">To:</MDTypography>
                        </Grid>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={4}>
                          <MDInput type="date" fullWidth/>
                        </Grid>
                        <Grid item xs={4}>
                          <MDInput type="date" fullWidth/>
                        </Grid>
                        <Grid item xs={3} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">Date of Graduation</MDTypography>
                          <MDTypography variant="caption">(If applicable)</MDTypography>
                        </Grid>
                        <Grid item xs={9}>
                          <MDInput type="date" fullWidth/>
                        </Grid>     
                      </Grid>
                    </Grid>

                    {/* RIGHT COLUMN */}                  
                    <Grid item lg={6} sm={12} >      
                                
                      <Grid container spacing={2}>                    

                        {/* CONTACT DETAILS */}
                        <Grid item xs={12} sx={{margin:"auto"}}>
                          <MDTypography mt={"5"} fontWeight={"bold"}>Contact Details</MDTypography>                         
                        </Grid>
                        <Grid item xs={3} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">Permanent Address:</MDTypography>
                        </Grid>
                        <Grid item xs={9}>
                          <MDInput type="text" multiline rows={2}  label="Enter Permanent Address" fullWidth/>
                        </Grid>
                        <Grid item xs={3} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">Mobile No:</MDTypography>
                        </Grid>
                        <Grid item xs={9}>
                          <MDInput type="number" label="Enter Mobile Number" fullWidth/>
                        </Grid>
                        <Grid item xs={3} sx={{margin:"auto"}}>
                          <MDTypography variant="body2">Email Address:</MDTypography>
                        </Grid>
                        <Grid item xs={9}>
                          <MDInput type="email" label="Enter Email Address" fullWidth/>
                        </Grid>
                        {/* END OF CONTACT DETAILS */}
                        <Grid item xs={8}></Grid>
                        <Grid item xs={4} sx={{marginTop:"10px"}} >
                            <MDButton variant="gradient" color="info" fullWidth>
                              <Icon>send</Icon> &nbsp;Submit
                            </MDButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                </MDBox>
            
              
              </Card>
            </Grid>
            
          </Grid>
        </MDBox>
      <Footer />
  </DashboardLayout>
  );
}

export default Add_Record;
