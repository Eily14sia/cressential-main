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

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDAlert from '../../components/MDAlert';

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import RequestTable from '../request_table';
import regeneratorRuntime from "regenerator-runtime";
import { useLocation } from "react-router-dom";

function Due_request() {
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
  const [type_of_record, setTypeOfRecord] = useState([]);
  const [student_id, setStudentID] = useState('');
  
  const pending_data = data.filter((record) => record.request_status === "Pending");
  const received_data = data.filter((record) => record.request_status === "Received");
  const user_id = student_data.find((item) => item.id == student_id)?.user_id;

  const jwtToken = localStorage.getItem('token');

  useEffect(() => {
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/due-request", {
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
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/student-management", {
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
        setStudentData(student_data)
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/type-of-record", {
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
      .then((type_of_record) => {
        setTypeOfRecord(type_of_record); 
      })
      .catch((err) => console.log(err));
  }, []);


  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // =================  UPDATE =======================

  const [processing_officer, setProcessingOfficer] = useState('');
  const [request_status, updateRequestStatus] = useState('');
  const [date_releasing, updateDateReleasing] = useState('');
  // State to track whether the dialog is open
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // Create a new Date object from the date string
  const parsedDate = new Date(date_releasing);

    // Function to handle update record form submission
    const handleUpdateSubmit = async (event) => {
      event.preventDefault();
      // Create an updated record object to send to the server
      const updatedRecord = {
        date_releasing: date_releasing,
        processing_officer: processing_officer,
        request_status: request_status,      
      };
      try {
        const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/update-record-request/${ctrl_number}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(updatedRecord),
        });
  
        if (response.ok) {
          handleCloseUpdateDialog();
          setIsSuccess(true);
          setAlertMessage('Record updated successfully.');
  
          // Fetch updated data and update the state
          fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/due-request", {
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
        } else {
          setAlertMessage('Failed to update record');
        }
      } catch (error) {
        setIsError(true);
        console.error('Error:', error);
      }
    };
  
  // Function to close the dialog
  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
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
                {/* <Link to="/graduate-record/add-record" component={RouterLink}>
                  <MDButton variant="gradient" color="dark">
                    Add Record&nbsp;
                    <Icon>add</Icon>
                  </MDButton>
                </Link> */}
              </MDBox>
                <MDBox p={3}>                  
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
                      </Tabs>
                    </AppBar>

                    {tabValue === 0 && (
                      // Render content for the "All" tab
                      <MDBox pt={3}>
                        <RequestTable table_data={data} setData={setData} 
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}   
                        setAlertMessage={setAlertMessage}
                        ctrl_number={ctrl_number}
                        set_ctrl_number={set_ctrl_number}
                        handleUpdateSubmit={(event) => handleUpdateSubmit(event)}
                        processing_officer = {processing_officer}
                        updateProcessingOfficer={setProcessingOfficer}
                        request_status={request_status}
                        updateRequestStatus={updateRequestStatus}
                        date_releasing={date_releasing}
                        student_id={student_id}
                        setStudentID={setStudentID}
                        updateDateReleasing={updateDateReleasing}
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
                        handleUpdateSubmit={(event) => handleUpdateSubmit(event)}
                        processing_officer = {processing_officer}
                        updateProcessingOfficer={setProcessingOfficer}
                        request_status={request_status}
                        updateRequestStatus={updateRequestStatus}
                        date_releasing={date_releasing}
                        student_id={student_id}
                        setStudentID={setStudentID}
                        updateDateReleasing={updateDateReleasing}
                        isUpdateDialogOpen={isUpdateDialogOpen}
                        setIsUpdateDialogOpen={setIsUpdateDialogOpen}/>
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
                        handleUpdateSubmit={(event) => handleUpdateSubmit(event)}
                        processing_officer = {processing_officer}
                        updateProcessingOfficer={setProcessingOfficer}
                        request_status={request_status}
                        updateRequestStatus={updateRequestStatus}
                        date_releasing={date_releasing}
                        student_id={student_id}
                        setStudentID={setStudentID}
                        updateDateReleasing={updateDateReleasing}
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

export default Due_request;
