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

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDBadge from "../../components/MDBadge";
import MDAlert from '../../components/MDAlert';

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import RequestTable from '../../layouts/request_table';
import regeneratorRuntime from "regenerator-runtime";
import { useLocation } from "react-router-dom";
import breakpoints from "../../assets/theme/base/breakpoints";

function Request_table() {
  const jwtToken = localStorage.getItem('token');
  
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

  // =========== For the Datatable =================
  const [data, setData] = useState([]);
  const [student_data, setStudentData] = useState([]);
  const [registrar_data, setRegistrarData] = useState([]);
  const [type_of_record, setTypeOfRecord] = useState([]);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  
  // Retrieve the user_role from localStorage
  const user_id = localStorage.getItem('user_id');
  const user_data = data.filter((record) => record.request_status === "Pending");


  const pending_data = data.filter((record) => record.request_status === "Pending");
  const received_data = data.filter((record) => record.request_status === "Received");
  const declined_data = data.filter((record) => record.request_status === "Declined");
  const completed_data = data.filter((record) => record.request_status === "Completed");

  useEffect(() => {
    fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/student-record-request/${user_id}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to authenticate token");
        }
        return res.json();
      })
      .then((data) => {
        setData(data); 
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/student-management`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to authenticate token");
        }
        return res.json();
      })
      .then((student_data) => {
        setStudentData(student_data); 
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/registrar-management`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to authenticate token");
        }
        return res.json();
      })
      .then((data) => {
        setRegistrarData(data); 
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/type-of-record`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to authenticate token");
        }
        return res.json();
      })
      .then((data) => {
        setTypeOfRecord(data); 
      })
      .catch((err) => console.log(err));
  }, []);

  function getTypeOfRecord(type_ids) {
    // Split the type_ids into an array of individual IDs
    const idsArray = type_ids.split(',');
  
    // Initialize an array to store the fetched type values
    const typeValues = [];
  
    // Loop through each ID and fetch the corresponding type value
    idsArray.forEach((id) => {
      // Find the type record that matches the current ID
      const typeRecord = type_of_record.find((record) => record.id === parseInt(id));
  
      // If a matching record is found, push its type value to the typeValues array
      if (typeRecord) {
        typeValues.push(typeRecord.type);
      }
    });
  
    return(typeValues.join(', '));
  }

  const columns = [
    { Header: "Ctrl No.", accessor: "ctrl_num"},
    { Header: "Student Name", accessor: "student_id"},
    { Header: "Record Type", accessor: "record_type" },
    { Header: "Date", accessor: "date_requested"},
    { Header: "Processing Officer", accessor: "processing_officer"},
    { Header: "Payment Status", accessor: "payment_status"},
    { Header: "Request Status", accessor: "request_status"},
    { Header: "action", accessor: "action"}
  ];
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    function handleResize() {
      const isMobile = window.innerWidth < breakpoints.values.sm;
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
                
              </MDBox>
                <MDBox p={3}>
                  {/* <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  /> */}
                  
                  <Grid item xs={12} md={12} lg={12} sx={{ ml: "auto" }} >
                    <AppBar style={{borderRadius: '0.75rem'}} position="static" color="default">
                    {mobileView && (
                        <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                      >
                          <Tooltip title="All" placement="top">
                            <Tab label=""
                            icon={
                              <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                folder
                              </Icon>
                            } />
                          </Tooltip>
                          <Tooltip title="Pending" placement="top">
                            <Tab label=""
                            icon={
                              <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                pending
                              </Icon>
                            } />
                          </Tooltip>
                          <Tooltip title="Received" placement="top">
                            <Tab label="" 
                              icon={
                              <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                verified
                              </Icon>
                            } />
                          </Tooltip>
                          <Tooltip title="Cancelled" placement="top">
                            <Tab label="" 
                                icon={
                                <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                  unpublished
                                </Icon>
                              } />
                          </Tooltip>
                          <Tooltip title="Completed" placement="top">
                            <Tab label="" 
                                icon={
                                <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                  assignment
                                </Icon>
                              } />
                          </Tooltip>
                        </Tabs>
                      )}
                      {!mobileView && (
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
                        <Tab label="Cancelled" 
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
                      )}
                    </AppBar>

                    {tabValue === 0 && (
                      // Render content for the "All" tab
                      <MDBox pt={3}>
                        <RequestTable 
                        table_data={data} 
                        setData={setData} 
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}   
                        setAlertMessage={setAlertMessage} 
                        ctrl_number={ctrl_number}
                        set_ctrl_number={set_ctrl_number}
                        isUpdateDialogOpen={isUpdateDialogOpen}
                        setIsUpdateDialogOpen={setIsUpdateDialogOpen}
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
                        ctrl_number={ctrl_number}
                        set_ctrl_number={set_ctrl_number}
                        isUpdateDialogOpen={isUpdateDialogOpen}
                        setIsUpdateDialogOpen={setIsUpdateDialogOpen}
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
                        ctrl_number={ctrl_number}
                        set_ctrl_number={set_ctrl_number}
                        isUpdateDialogOpen={isUpdateDialogOpen}
                        setIsUpdateDialogOpen={setIsUpdateDialogOpen}
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
                        ctrl_number={ctrl_number}
                        set_ctrl_number={set_ctrl_number}
                        isUpdateDialogOpen={isUpdateDialogOpen}
                        setIsUpdateDialogOpen={setIsUpdateDialogOpen}
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
                        ctrl_number={ctrl_number}
                        set_ctrl_number={set_ctrl_number}
                        isUpdateDialogOpen={isUpdateDialogOpen}
                        setIsUpdateDialogOpen={setIsUpdateDialogOpen}
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

export default Request_table;
