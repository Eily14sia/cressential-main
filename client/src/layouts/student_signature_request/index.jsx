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
import VisibilityIcon from '@mui/icons-material/Visibility';
import breakpoints from "../../assets/theme/base/breakpoints";

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
import RequestTable from './signature_table';
import regeneratorRuntime from "regenerator-runtime";
import { useLocation } from "react-router-dom";

function Student_record_request() {
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
  const [registrar_data, setRegistrarData] = useState([]);
  const [student_data, setStudentData] = useState([]); 
  const [student_id, setStudentID] = useState('');

  const jwtToken = localStorage.getItem('token');

  useEffect(() => {
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/payment-signature-request", {
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
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/registrar-management", {
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
      .then((registrar_data) => {
        setRegistrarData(registrar_data);
      })
      .catch((err) => console.log(err));
  }, []);

  const pending_data = data.filter((record) => record.request_status === "Pending");
  const received_data = data.filter((record) => record.request_status === "Received");
  const declined_data = data.filter((record) => record.request_status === "Declined" || record.request_status === "Cancelled");
  const completed_data = data.filter((record) => record.request_status === "Completed");
  const user_id = student_data.find((item) => item.id == student_id)?.user_id;

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
        request_status: request_status,      
      };

      try {
        const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/update-signature-request/${ctrl_number}`, {
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

          registrar_data.map(async (item) => {
            const registrar_update = {
              title: "Record request updated",
              description: ctrl_number,
              user_id: item.user_id
            }

            const notif_response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/notif/add-record`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
               Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(registrar_update),
          });

          });

          const student_update = {
            title: "Record request updated",
            description: ctrl_number,
            user_id: user_id
          }

          const notif_response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/notif/add-record`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(student_update),
          });
        

          // Fetch updated data and update the state          
          fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/payment-signature-request", {
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
                  Signature Request Table
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
                          <Tooltip title="Declined" placement="top">
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
                      )}
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
                        updateDateReleasing={updateDateReleasing}
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
                        handleUpdateSubmit={(event) => handleUpdateSubmit(event)}
                        processing_officer = {processing_officer}
                        updateProcessingOfficer={setProcessingOfficer}
                        request_status={request_status}
                        updateRequestStatus={updateRequestStatus}
                        date_releasing={date_releasing}
                        updateDateReleasing={updateDateReleasing}
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
                        handleUpdateSubmit={(event) => handleUpdateSubmit(event)}
                        processing_officer = {processing_officer}
                        updateProcessingOfficer={setProcessingOfficer}
                        request_status={request_status}
                        updateRequestStatus={updateRequestStatus}
                        date_releasing={date_releasing}
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

export default Student_record_request;
