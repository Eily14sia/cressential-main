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
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDBadge from "../../components/MDBadge";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import RequestTable from '../request_table';

import regeneratorRuntime from "regenerator-runtime";

function Student_record_request() {
  // const { columns, rows } = authorsTableData();
  // =========== For the MDAlert =================
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // State for form inputs
  const [ctrl_number, set_ctrl_number] = useState('');

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );
  
  const [data, setData] = useState([]);
  const pending_data = data.filter((record) => record.request_status === "Pending");
  const received_data = data.filter((record) => record.request_status === "Received");
  const declined_data = data.filter((record) => record.request_status === "Declined");
  const completed_data = data.filter((record) => record.request_status === "Completed");

  useEffect(() => {
    fetch("http://localhost:8081/mysql/payment-student-record-request")
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the fetched data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    { Header: "Ctrl No.", accessor: "ctrl_num"},
    { Header: "Student ID", accessor: "student_id"},
    { Header: "Record Type", accessor: "record_type" },
    { Header: "Date Requested", accessor: "date_requested"},
    { Header: "Date Releasing", accessor: "date_releasing"},
    { Header: "Processing Officer", accessor: "processing_officer"},
    { Header: "Payment Status", accessor: "payment_status"},
    { Header: "Request Status", accessor: "request_status"},
    { Header: "action", accessor: "action"}
  ];
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
        <MDBox pt={6} pb={3}>          
          <Grid container spacing={6}>
            <Grid item xs={12}>
            {isSuccess && (
                <MDAlert color="success" dismissible sx={{marginBottom: '50px'}} onClose={() => setIsSuccess(false)}>
                      {alertContent("success", alertMessage)}
                </MDAlert>
              )}
              {isError && (
                <MDAlert color="error" dismissible onClose={() => setIsError(false)}>
                  {alertContent("error", alertMessage)}
                </MDAlert>
              )} 
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
                <MDTypography variant="h6" color="white">
                  Record Request Table
                </MDTypography>
                
                {/* <Link to="/graduate-record/add-record" component={RouterLink}> */}
                <Link to="/graduate-record/add-record" component={RouterLink}>
                  <MDButton variant="gradient" color="dark">
                    Add Record&nbsp;
                    <Icon>add</Icon>
                  </MDButton>
                </Link>
              </MDBox>
                <MDBox p={3}>
                  {/* <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  /> */}
                  
                  <Grid item xs={12} md={8} lg={12} sx={{ ml: "auto" }} >
                    <AppBar style={{borderRadius: '0.75rem'}} position="static" color="default">
                      <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                      >
                        <Tab label="All"
                          icon={
                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                              folder
                            </Icon>
                          } />
                        <Tab label="Pending"
                          icon={
                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                              pending
                            </Icon>
                          } />
                        <Tab label="Received" 
                            icon={
                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                              verified
                            </Icon>
                          } />
                        <Tab label="Declined" 
                            icon={
                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                              unpublished
                            </Icon>
                          } />
                        <Tab label="Completed" 
                            icon={
                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                              assignment
                            </Icon>
                          } />
                      </Tabs>
                    </AppBar>

                    {tabValue === 0 && (
                      // Render content for the "All" tab
                      <MDBox pt={3}>
                        <RequestTable table_data={data} 
                        setData={setData} 
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}   
                        setAlertMessage={setAlertMessage}
                        />
                      </MDBox>
                    )}

                    {tabValue === 1 && (
                      // Render content for the "Pending" tab
                      <MDBox pt={3}>
                        <RequestTable table_data={pending_data} 
                        setData={setData} 
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}   
                        setAlertMessage={setAlertMessage}
                        />
                      </MDBox>
                    )}

                    {tabValue === 2 && (
                      // Render content for the "Received" tab
                      <MDBox pt={3}>
                        <RequestTable table_data={received_data} 
                        setData={setData} 
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}   
                        setAlertMessage={setAlertMessage}
                        />
                      </MDBox>
                    )}

                    {tabValue === 3 && (
                      // Render content for the "Declined" tab
                      <MDBox pt={3}>
                        <RequestTable table_data={declined_data} 
                        setData={setData} 
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}   
                        setAlertMessage={setAlertMessage}
                        />
                      </MDBox>
                    )}

                    {tabValue === 4 && (
                      // Render content for the "Completed" tab
                      <MDBox pt={3}>
                        <RequestTable table_data={completed_data} 
                        setData={setData} 
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}   
                        setAlertMessage={setAlertMessage}
                        />
                      </MDBox>
                    )}
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

export default Student_record_request;
