import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams  } from "react-router-dom";
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
import CustomCard from "../../examples/Cards/CustomCard";

import AddDialogBox from './component/add_record_modal';
import UpdateDialogBox from './component/update_record_modal';
import DeleteDialogBox from './component/delete_record_modal';
import ApplicantInformation from './component/applicant_information';
import regeneratorRuntime from "regenerator-runtime";

function Alumni_record_issuance() {
  const { ctrl_number } = useParams();

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
    { Header: "Action", accessor: "action", width: "10%" },
  ];

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

  // State for form inputs
  const [recordUpdateType, setUpdateRecordType] = useState('');
  const [recordUpdatePrice, setUpdaterecordIPFS] = useState('');

  // Function to open the dialog
  const handleOpenUpdateDialog = (record_id, record_type, record_IPFS, record_status, record_password) => {
    setIsSuccess(false);
    setIsError(false);
    setRecordType(record_type); // Reset other form fields 
    setRecordIPFS(record_IPFS);
    setRecordId(record_id); // Set the record_id state
    setIsUpdateDialogOpen(true);
    setRecordStatus(record_status);
    setRecordPassword(record_password);
  };

  // Function to close the dialog
  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
  };

  // Function to handle update record form submission
  const handleUpdateSubmit = async (event, record_id, record_IPFS, record_status ) => {
    event.preventDefault();
    // Create an updated record object to send to the server
    const updatedRecord = {
      type: recordUpdateType,
      price: recordUpdatePrice,
    };

    try {
      const response = await fetch(`http://localhost:8081/mysql/update-record/${record_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecord),
      });

      if (response.ok) {
        handleCloseUpdateDialog();
        setIsSuccess(true);
        setAlertMessage('Record updated successfully.');

        // Fetch updated data and update the state
        fetch("http://localhost:8081/mysql/type-of-record")
          .then((res) => res.json())
          .then((data) => {
            setData(data); // Set the fetched data into the state
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          
          {/* Info Cards */}
          <Grid container spacing={3}> 
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
                  <Link to="/alumni/record-request" component={RouterLink}>
                    <MDButton variant="outlined" color="info" size="small">
                      <Icon>arrow_back</Icon>&nbsp; Record Request
                    </MDButton>
                  </Link>
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
                          <MDBox ml={2} lineHeight={1}>
                            <MDTypography display="block" variant="button" fontWeight="medium">
                             {item.ipfs}
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
                        date_issued: new Date(item.date_issued).toLocaleDateString(),
                        action: (
                          <>
                          <Tooltip title="Update" >
                              <IconButton color="info" onClick={() => handleOpenUpdateDialog(item.id, item.type, item.ipfs, item.record_status, item.password)} >
                                  <EditIcon />
                                </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" >
                            <IconButton color="secondary" onClick={() => handleDelete(item.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          </>     
                        )
                      })), 
                    }}
                    canSearch={true}
                  />
                  <UpdateDialogBox
                    open={isUpdateDialogOpen}
                    onClose={handleCloseUpdateDialog}
                    onSubmit={(event) => handleUpdateSubmit(event, record_id)}
                    recordType={record_type}
                    setRecordType={setRecordType}
                    recordIPFS={record_IPFS}
                    setrecordIPFS={setRecordIPFS}   
                    recordId={record_id}    
                    recordStatus={record_status}     
                    setRecordStatus={setRecordStatus}        
                    recordPassword={record_password}     
                    setRecordPassword={setRecordPassword}   
                    payment_status={payment_status}     
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

export default Alumni_record_issuance;
