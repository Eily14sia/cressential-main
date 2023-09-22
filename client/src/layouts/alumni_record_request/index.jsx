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
import VisibilityIcon from '@mui/icons-material/Visibility';

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
import UpdateDialogBox from './component/update_record_modal';
import regeneratorRuntime from "regenerator-runtime";

function Alumni_record_request() {
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

  useEffect(() => {
    fetch("http://localhost:8081/mysql/payment-record-request")
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the fetched data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  const [student_data, setStudentData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/mysql/student-management")
      .then((res) => res.json())
      .then((student_data) => {
        setStudentData(student_data); // Set the fetched student_data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  function getStudentName(student_id) {
    const last_name = student_data.find((item) => item.id == student_id)?.last_name;
    const middle_name = student_data.find((item) => item.id == student_id)?.middle_name;
    const first_name = student_data.find((item) => item.id == student_id)?.first_name
    const fullname = first_name + " " + middle_name + " " + last_name;
    return fullname;
  }
  const [registrar_data, setRegistrarData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/mysql/registrar-management")
      .then((res) => res.json())
      .then((registrar_data) => {
        setRegistrarData(registrar_data); // Set the fetched registrar_data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  function getRegistrarName(processing_officer) {
    const last_name = registrar_data.find((item) => item.id == processing_officer)?.last_name;
    const middle_name = registrar_data.find((item) => item.id == processing_officer)?.middle_name;
    const first_name = registrar_data.find((item) => item.id == processing_officer)?.first_name
    const fullname = first_name + " " + middle_name + " " + last_name;
    return fullname;
  }

  const [type_of_record, setTypeOfRecord] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/mysql/type-of-record")
      .then((res) => res.json())
      .then((type_of_record) => {
        setTypeOfRecord(type_of_record); // Set the fetched registrar_data into the state
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

  function getStatusColor(status) {
    switch (status) {
      case 'Pending':
        return 'secondary'; // Set to your desired color for pending status
      case 'Received':
        return 'success'; // Set to your desired color for received status
      case 'Declined':
        return 'error'; // Set to your desired color for declined status
      case 'Completed':
        return 'info'; // Set to your desired color for completed status     
    }
  }  

  function getPaymentStatusColor(payment_status) {
    switch (payment_status) {
      case 'Paid':
        return 'success'; // Set to your desired color for pending status
      default:
        return 'secondary'; // Set a default color for other status values
    }
  }

  /* =========================================
               UPDATE RECORD
   ========================================= */

  // State to track whether the dialog is open
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // State for form inputs
  const [processing_officer, updateProcessingOfficer] = useState('');
  const [request_status, updateRequestStatus] = useState('');
  const [date_releasing, updateDateReleasing] = useState('');

  // Function to open the dialog
  const handleOpenUpdateDialog = (ctrl_number, processing_officer, date_releasing, request_status,) => {
    setIsSuccess(false);
    setIsError(false);
    updateProcessingOfficer(processing_officer); // Reset other form fields 
    updateRequestStatus(request_status);
    updateDateReleasing(date_releasing);
    set_ctrl_number(ctrl_number); // Set the _ctrl_number state
    setIsUpdateDialogOpen(true);    
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
                      // Render content for the "Pending" tab
                      <MDBox pt={3}>
                        {/* ... your DataTable code ... */}
                      </MDBox>
                    )}

                    {tabValue === 1 && (
                      // Render content for the "Received" tab
                      <MDBox pt={3}>
                        {/* ... your DataTable code ... */}
                      </MDBox>
                    )}

                    {tabValue === 2 && (
                      // Render content for the "Declined" tab
                      <MDBox pt={3}>
                        {/* ... your DataTable code ... */}
                      </MDBox>
                    )}

                    {tabValue === 3 && (
                      // Render content for the "Declined" tab
                      <MDBox pt={3}>
                        {/* ... your DataTable code ... */}
                      </MDBox>
                    )}

                    {tabValue === 4 && (
                      // Render content for the "Declined" tab
                      <MDBox pt={3}>
                        {/* ... your DataTable code ... */}
                      </MDBox>
                    )}
                  </Grid>
                  <DataTable table={{ columns, 
                    rows: data.map((item) => ({
                    ctrl_num: "CTRL-"+item.ctrl_number,
                    student_id: getStudentName(item.student_id),
                    record_type: getTypeOfRecord(item.request_record_type_id),
                    date_requested: new Date(item.date_requested).toLocaleDateString(), // Format the date_requested
                    date_releasing: new Date(item.date_releasing).toLocaleDateString(), // Format the date_releasing
                    processing_officer: getRegistrarName(item.processing_officer),
                    payment_status: (
                      <>
                        <MDBox ml={-1}>
                          <MDBadge
                            badgeContent={item.payment_status}
                            color={getPaymentStatusColor(item.payment_status)} // Set the badge color dynamically
                            variant="gradient"
                            size="sm"
                          />
                        </MDBox>
                      </>
                    ),
                    request_status: (
                      <>
                        <MDBox ml={-1}>
                          <MDBadge
                            badgeContent={item.request_status}
                            color={getStatusColor(item.request_status)} // Set the badge color dynamically
                            variant="gradient"
                            size="sm"
                          />
                        </MDBox>
                      </>
                    ),
                    action: (
                      <>
                        <Link to={`/alumni/record-per-request/${item.ctrl_number}`} component={RouterLink}>
                          <Tooltip title="View" >
                            <IconButton color="info" >
                                <VisibilityIcon />
                              </IconButton>
                          </Tooltip>
                        </Link>
                        <Tooltip title="Update" >
                          <IconButton color="success" onClick={() => 
                            handleOpenUpdateDialog( 
                              item.ctrl_number, item.processing_officer, item.date_releasing, item.request_status
                            )}>
                            <EditIcon /> 
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" >
                          <IconButton color="secondary" onClick={() => handleOpenDeleteDialog(item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>                                 
                    ), 
                    })), 
                  }} canSearch={true} />
                  <UpdateDialogBox
                    data={data}
                    setData={setData}
                    open={isUpdateDialogOpen}
                    onClose={handleCloseUpdateDialog}
                    processing_officer={processing_officer}
                    setProcessingOfficer={updateProcessingOfficer}
                    request_status={request_status}
                    setRequest_status={updateRequestStatus}   
                    setdate_releasing={updateDateReleasing}   
                    ctrl_number={ctrl_number}     
                    date_releasing={date_releasing}  
                    setIsSuccess={setIsSuccess}
                    setIsError={setIsError}   
                    setAlertMessage={setAlertMessage}
                    handleCloseUpdateDialog={handleCloseUpdateDialog}
                  />
                </MDBox>
              </Card>
            </Grid>
            
          </Grid>
        </MDBox>
      <Footer />
  </DashboardLayout>
  );
}

export default Alumni_record_request;