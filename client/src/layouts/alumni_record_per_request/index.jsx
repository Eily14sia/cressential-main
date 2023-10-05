import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams, useNavigate   } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDBadge from "../../components/MDBadge";
import MDAlert from "../../components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import CustomCard from "../../examples/Cards/CustomCard";

import AddDialogBox from './component/add_record_modal';
import UpdateDialogBox from './component/update_record_modal';
import DeleteDialogBox from './component/delete_record_modal';
import ApplicantInformation from './component/applicant_information';
import regeneratorRuntime from "regenerator-runtime";

function Alumni_record_per_request() {
  const { ctrl_number } = useParams();

  // Retrieve the user_role from localStorage
  const user_role = localStorage.getItem('user_role');
  const navigate = useNavigate();
  const goBack = () => {    
    navigate(-1);
  };


  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:8081/mysql/record-per-request/${ctrl_number}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the fetched data into the state
      })
      .catch((err) => console.log(err));
  }, [ctrl_number]);

  const date_requested = data.find((item) => item.ctrl_number == ctrl_number)?.date_requested;
  const new_date_requested = new Date(date_requested).toLocaleDateString();

  const date_releasing = data.find((item) => item.ctrl_number == ctrl_number)?.date_releasing;
  const new_date_releasing = new Date(date_releasing).toLocaleDateString();

  const payment_status = String(data.find((item) => item.ctrl_number == ctrl_number)?.payment_status);
  const student_id = data.find((item) => item.ctrl_number == ctrl_number)?.student_id;

  const columns = [
    { Header: "Record", accessor: "record", width: "30%" },
    // { Header: "Processing Officer", accessor: "processing_officer", width: "30%" },
    { Header: "Status", accessor: "status", width: "10%" },
    { Header: "Date Issued", accessor: "date_issued", width: "10%" },
  ];
  
  if (parseInt(user_role) === 1) {
    columns.push({ Header: "Action", accessor: "action", width: "10%" });
  }
  

  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );
  function getStatusColor(status) {
    switch (status) {
      case 'Valid':
        return 'info'; 
      case 'Invalid':
        return 'error'; 
   
    }
  } 

  // =========== For the MDAlert =================
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );

  /* =========================================
               UPDATE RECORD
   ========================================= */

  // State for form inputs
  const [record_type, setRecordType] = useState('');
  const [record_IPFS, setRecordIPFS] = useState('');
  const [recordTypeError, setRecordTypeError] = useState('');
  const [recordIPFSError, setrecordIPFSError] = useState('');
  const [record_status, setRecordStatus] = useState('');
  const [record_password, setRecordPassword] = useState('');

  const [record_id, setRecordId] = useState('');

  // State to track whether the dialog is open
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);


  // Function to open the dialog
  const handleOpenUploadDialog = (record_id, record_type, record_IPFS, record_password) => {
    setIsSuccess(false);
    setIsError(false);
    setRecordType(record_type); // Reset other form fields 
    setRecordIPFS(record_IPFS);
    setRecordId(record_id); // Set the record_id state
    setIsUploadDialogOpen(true);
    setRecordPassword(record_password);
  };
  // Function to open the dialog
  const handleOpenUpdateDialog = (record_id, record_type, record_IPFS, record_status) => {
    setIsSuccess(false);
    setIsError(false);
    setRecordType(record_type); // Reset other form fields 
    setRecordIPFS(record_IPFS);
    setRecordId(record_id); // Set the record_id state
    setIsUpdateDialogOpen(true);
    setRecordStatus(record_status);
  };

  // Function to close the dialog
  const handleCloseUploadDialog = () => {
    setIsUploadDialogOpen(false);
  };
  // Function to close the dialog
  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          
          {/* Info Cards */}
          <Grid container spacing={3}> 
            <Grid item xs={12} md={12} lg={12}>
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
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
           
              <MDBox mb={1.5}>
                <CustomCard
                  color="secondary"
                  icon="label_important"
                  title="Control Number"
                  count={ctrl_number}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <CustomCard
                  icon="person"
                  title="Date Requested"
                  count={new_date_requested}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <CustomCard
                  color="success"
                  icon="calendar_month"
                  title="Date Releasing"
                  count={new_date_releasing}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <CustomCard
                  color="primary"
                  icon="payments"
                  title="Payment Status"
                  count={payment_status}                  
                />
              </MDBox>
            </Grid>
          </Grid>
          {/* end of Info Cards */}

          <Grid container spacing={3}>

            {/* Applicant Infomation */}
            <Grid item lg={3} xs={12}>
              <ApplicantInformation student_id={student_id}/>
            </Grid>
            {/* End of Applicant Information */}

            {/* Datatable */}
            <Grid item lg={9} sm={12}>
              <Card sx={{marginTop: "20px"}}>
                <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" fontWeight="medium">
                    Record per Request
                  </MDTypography>
                   
                    <MDButton onClick={goBack} variant="outlined" color="info" size="small">
                      <Icon>arrow_back</Icon>&nbsp; Record Request
                    </MDButton>
                  
                </MDBox>
                <MDBox >
                  {/* <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  /> */}
                  <DataTable 
                    table={{ columns, 
                      rows: data.map((item) => ({
                       
                        record: (
                          <MDBox ml={1} lineHeight={1}>
                            <MDTypography display="block" variant="button" fontWeight="medium">
                            <a target="_blank" rel="noopener noreferrer" href={`http://localhost:8080/ipfs/${item.ipfs}`}>
                            {item.ipfs}
                            </a>
                            </MDTypography>
                            <MDTypography variant="caption">{item.type}</MDTypography>
                          </MDBox>
                          ),
                        
                        status: (
                          <>
                          <MDBox ml={-1}>
                            <MDBadge
                              badgeContent={item.record_status}
                              color={getStatusColor(item.record_status)} // Set the badge color dynamically
                              variant="gradient"
                              size="sm"
                            />
                          </MDBox></>
                        ),
                        date_issued: item.date_issued ? new Date(item.date_issued).toLocaleDateString() : "",
                        action: (
                          <>
                          {parseInt(user_role) === 1 ? (
                            <>
                          <Tooltip title="Upload" >
                              <IconButton color="info" 
                              disabled={item.ipfs != null || payment_status === "Unpaid" ? true : false}
                              onClick={() => handleOpenUploadDialog(item.rpr_id, item.type, item.ipfs, item.password)} >
                                <UploadFileIcon />
                                </IconButton>
                          </Tooltip>
                          <Tooltip title="Update" >
                              <IconButton color="success" onClick={() => handleOpenUpdateDialog(item.rpr_id, item.type, item.ipfs, item.record_status)} >
                                  <EditIcon />
                                </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" >
                            <IconButton color="secondary" onClick={() => handleDelete(item.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          </> 
                          ) : (null)}
                          </>    
                        )
                      })), 
                    }}
                    canSearch={true}
                  />
                  <AddDialogBox
                    open={isUploadDialogOpen}
                    onClose={handleCloseUploadDialog}
                    ctrl_number = {ctrl_number}
                    recordType={record_type}
                    setRecordType={setRecordType}
                    recordIPFS={record_IPFS}
                    setrecordIPFS={setRecordIPFS}   
                    recordID={record_id}                               
                    recordPassword={record_password}     
                    setRecordPassword={setRecordPassword}   
                    payment_status={payment_status}    
                    setAlertMessage={setAlertMessage}
                    setIsError={setIsError}
                    setIsSuccess={setIsSuccess} 
                    handleCloseUploadDialog={handleCloseUploadDialog}
                    setData={setData}
                    data={setData}
                  />
                  <UpdateDialogBox
                    open={isUpdateDialogOpen}
                    onClose={handleCloseUpdateDialog}
                    ctrl_number = {ctrl_number}
                    recordType={record_type}
                    setRecordType={setRecordType}   
                    recordIPFS={record_IPFS}
                    recordID={record_id}    
                    recordStatus={record_status}     
                    setRecordStatus={setRecordStatus}  
                    payment_status={payment_status}    
                    setAlertMessage={setAlertMessage}
                    setIsError={setIsError}
                    setIsSuccess={setIsSuccess} 
                    handleCloseUpdateDialog={handleCloseUpdateDialog}
                    setData={setData}
                    data={setData}
                  />
                  {renderMenu}
                </MDBox>
              </Card>
            </Grid>
            {/* End of Datatable */}
          </Grid>
        </MDBox>
      <Footer />
  </DashboardLayout>
  );
}

export default Alumni_record_per_request;
