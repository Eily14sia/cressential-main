import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams, useNavigate   } from "react-router-dom";
import { Link } from "@mui/material";
import { EthProvider } from "../../contexts/EthContext";

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
import CloudSyncIcon from '@mui/icons-material/CloudSync';

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
import UploadDialogBox from './component/upload_record_modal';
import UpdateDialogBox from './component/update_record_modal';
import DeleteDialogBox from './component/delete_record_modal';
import ApplicantInformation from './component/applicant_information';
import regeneratorRuntime from "regenerator-runtime";

function Alumni_record_per_request() {
  const { ctrl_number } = useParams();
  const [student_email, setStudentEmail] = useState();

  const new_ctrl_number = ctrl_number ? ctrl_number : 0;
  // Retrieve the user_role from localStorage
  const user_role = localStorage.getItem('user_role');
  const navigate = useNavigate();
  const goBack = () => {    
    navigate(-1);
  };

  const jwtToken = localStorage.getItem('token');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/record-per-request/${ctrl_number}`, {
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
      .then((fetchedData) => {
        setData(fetchedData);
      })
      .catch((err) => console.log(err));
  }, [ctrl_number]);

  const [allRecordsCompleted, setAllRecordsCompleted] = useState(false);
  const [reqStatus, setReqStatus] = useState("");

  useEffect(() => {
    if (data.length > 0) {
      // Check if all records have a value in the ipfs column
      const areAllRecordsCompleted = data.every(item => item.ipfs);
      const requestStatus = data.find(item => item.ctrl_number == ctrl_number)?.request_status;
    
      if (areAllRecordsCompleted && requestStatus !== "Completed") {
        // Perform the action you want when all records have a value in ipfs and request_status is not "Completed"
        handleUpdateSubmit(ctrl_number);
      }
    }
  }, [data]);

  const handleUpdateSubmit = async (new_ctrl_number) => {
    // Create an updated record object to send to the server

    try {
      const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/update-record-request/request_status/${new_ctrl_number}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        handleCloseUpdateDialog();
        setIsSuccess(true);
        setAlertMessage('This Record Request has completed.');

        // Fetch updated data and update the state
        fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/record-per-request/${ctrl_number}`, {
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
          .then((fetchedData) => {
            setData(fetchedData);
          })
          .catch((err) => console.log(err));      
      } else {
        setAlertMessage('Failed to update record');
      }
    } catch (error) {
      setIsError(true);
      setAlertMessage(error);
      console.error('Error:', error);
    }
  };


  const date_requested = data.find((item) => item.ctrl_number == ctrl_number)?.date_requested;
  const new_date_requested = date_requested ? new Date(date_requested).toLocaleDateString() : "loading";

  const date_releasing = data.find((item) => item.ctrl_number == ctrl_number)?.date_releasing;
  const new_date_releasing = date_releasing ? new Date(date_releasing).toLocaleDateString() : "loading";

  const status = data.find((item) => item.ctrl_number == ctrl_number)?.payment_status;
  const request_status = data.find((item) => item.ctrl_number == ctrl_number)?.request_status;
  const payment_status = status ?  String(status) : 'loading';
  const student_id = data.find((item) => item.ctrl_number == ctrl_number)?.student_id;

  const columns = [
    { Header: "ID", accessor: "rpr_id"},
    { Header: "Record", accessor: "record", },
    // { Header: "Processing Officer", accessor: "processing_officer", width: "30%" },
    { Header: "Status", accessor: "status"},
    { Header: "Date ", accessor: "date_issued", },
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
  const [record_type_id, setRecordTypeId] = useState('');

  // State to track whether the dialog is open
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);


  // Function to open the dialog
  const handleOpenAddDialog = (record_id, record_type, record_type_id, record_IPFS, record_password) => {
    setIsSuccess(false);
    setIsError(false);    
    setIsAddDialogOpen(true);
    setRecordType(record_type); // Reset other form fields 
    setRecordIPFS(record_IPFS);
    setRecordId(record_id); // Set the record_id state
    setRecordTypeId(record_type_id);
  };
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
  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
    setRecordType('');
    setRecordPassword('');
  };
  // Function to close the dialog
  const handleCloseUploadDialog = () => {
    setIsUploadDialogOpen(false);
  };
  // Function to close the dialog
  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
  };

  const [password, setPassword] = useState('');

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
      .then((data) => {

        if (data.length > 1){

          const wallet_address = data.find((user) => user.id == student_id).wallet_address;
          const last_name = data.find((user) => user.id == student_id).last_name.replace(/\s/g, '');
          // Extract the last 5 characters from the wallet address
          const last5Characters = wallet_address.slice(-5);
  
          // Concatenate the lowercase last name with the last 5 characters of the wallet address
          const password = ctrl_number + last_name.toLowerCase() + last5Characters.toLowerCase();
  
          if(wallet_address && last_name){
            setPassword(password);        
          }
        }

      })
      .catch((err) => console.log(err));
  }, [data]);


  console.log('password:',password); 

  const shouldDisableUpload = (paymentStatus, requestStatus) => {
    return (
      paymentStatus !== "Unpaid" &&
      (requestStatus !== "Pending" || requestStatus !== "Cancelled")
    );
  };

  const shouldDisableAddRecord = (paymentStatus, requestStatus) => {
    return paymentStatus === "Unpaid" && (requestStatus === "Pending" || requestStatus === "Cancelled");
  };
  

  return (
    <EthProvider>
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
                    count={new_ctrl_number}
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
                <ApplicantInformation student_id={student_id} setStudentEmail={setStudentEmail}/>
              </Grid>
              {/* End of Applicant Information */}

              {/* Datatable */}
              <Grid item lg={9} xs={12}>
                <Card sx={{marginTop: "20px"}}>
                  <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                    
                  {/* {parseInt(user_role) === 1 ? (
                    <>
                      <MDButton onClick={goBack} variant="outlined" color="info" size="small">
                        <Icon>arrow_back</Icon>&nbsp; Record Request
                      </MDButton>
                      <Tooltip
                        title={`Request is ${payment_status} and ${request_status}, cannot upload.`}
                        disableHoverListener={shouldDisableUpload(payment_status, request_status)}
                      >
                        <span>
                          <MDButton
                            onClick={handleOpenAddDialog}
                            disabled={shouldDisableAddRecord(payment_status, request_status)}
                            variant="gradient"
                            color="dark"
                            size="small"
                          >
                            <Icon>add</Icon>&nbsp; Add Record
                          </MDButton>
                        </span>
                      </Tooltip>
                    </>
                  ) : (
                    <> */}
                      <MDTypography variant="h6" fontWeight="medium">
                        Record per Request 
                      </MDTypography>
                      <MDButton onClick={goBack} variant="outlined" color="info" size="small">
                        <Icon>arrow_back</Icon>&nbsp; Record Request
                      </MDButton>
                    {/* </>
                  )} */}
                  </MDBox>
                  
                  <MDBox mt={4} p={3}>
                    <DataTable 
                      table={{ columns, 
                        rows: data.map((item) => ({
                          rpr_id: item.rpr_id,
                          record: (
                            <MDBox lineHeight={1}>
                              <MDTypography display="block" variant="button" fontWeight="medium">
                              {item.ipfs ? (
                                <a target="_blank" rel="noopener noreferrer" href={`https://cressential.infura-ipfs.io/ipfs/${item.ipfs}`}>
                                  {item.type}
                                </a>
                              ) : (
                              item.type
                              )}
                              </MDTypography>
                              <MDTypography variant="caption">{item.transaction_hash}</MDTypography>
                            </MDBox>
                            ),
                          
                          // status: (
                          //   <>
                          //   {item.ipfs ? (
                          //     <MDBox ml={-1}>
                          //       <MDBadge
                          //         badgeContent={item.record_status}
                          //         color={getStatusColor(item.record_status)} // Set the badge color dynamically
                          //         variant="gradient"
                          //         size="sm"
                          //       />
                          //     </MDBox>
                          //   ) : ""}
                          //   </>
                          // ),
                          status: (
                            <>
                            {item.ipfs ? (         
                              <MDBox> 
                                {item.record_status === 'Valid' ? (                                   
                                    <MDBadge 
                                      badgeContent="Valid"
                                      color="success" // Set the badge color dynamically
                                      variant="gradient"
                                      size="sm"
                                    />                                                                   
                                ) : (                                    
                                    <MDBadge
                                      badgeContent="Invalid"
                                      color="error" // Set the badge color dynamically
                                      variant="gradient"
                                      size="sm"
                                    />   
                                  
                                )}
                              </MDBox>
                              
                            ) : ""}
                            </>
                          ),
                          date_issued: (
                            (item.date_issued && (
                            <MDBox lineHeight={1}>
                              <MDTypography variant="caption" >
                                Issued: &nbsp;
                              </MDTypography>
                              <MDTypography variant="button" fontWeight="medium">
                                {new Date(item.date_issued).toLocaleDateString()} <br></br>
                              </MDTypography>
                              <MDTypography variant="caption">
                                Expiration: &nbsp; 
                              </MDTypography>
                              <MDTypography
                                variant="button"
                                fontWeight="medium"
                              >
                                {
                                  (() => {
                                    const date = new Date(item.date_issued);
                                    date.setFullYear(date.getFullYear() + 5);
                                    return date.toLocaleDateString();
                                  })()
                                }
                              </MDTypography>
                            </MDBox>
                            ))
                          ),
                          action: (
                            <>
                            {parseInt(user_role) === 1 ? (
                              <>
                              {item.ipfs == null || (payment_status === "Unpaid" && (request_status === "Pending" || request_status === "Cancelled")) ?
                              (

                              <Tooltip title={`Request is ${payment_status} and ${request_status}, cannot upload.`} disableHoverListener={item.ipfs !== null || (payment_status !== "Unpaid" && (request_status !== "Pending" || request_status !== "Cancelled"))}>
                                <span>
                                  <IconButton
                                    color="info"
                                    disabled={item.ipfs !== null || (payment_status === "Unpaid" && (request_status === "Pending" || request_status === "Cancelled"))}
                                    onClick={() => handleOpenUploadDialog(item.rpr_id, item.type, item.ipfs, item.password)}
                                  >
                                    <UploadFileIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              ) : (
                              
                                
                              <Tooltip title="Re-upload">
                                <span>
                                  <IconButton
                                    color="info"
                                    disabled={item.record_status === 'Invalid' || item.ipfs == null || (payment_status === "Unpaid" && (request_status === "Pending" || request_status === "Cancelled"))}
                                    onClick={() => handleOpenAddDialog(item.rpr_id, item.type, item.record_type_id, item.ipfs, item.password)}
                                  >
                                    <CloudSyncIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              )}
                            
                            {/* <Tooltip title={`No record has been uploaded yet, cannot update.`} disableHoverListener={item.ipfs !== null }>
                              <span>
                                <IconButton 
                                    color="success" 
                                    disabled={item.ipfs === null }
                                    onClick={() => handleOpenUpdateDialog(item.rpr_id, item.type, item.ipfs, item.record_status)} >
                                    <EditIcon />
                                  </IconButton>
                                </span>
                            </Tooltip> */}
                            {/* <Tooltip title="Delete" >
                              <IconButton color="secondary" onClick={() => handleDelete(item.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip> */}
                            </> 
                            ) : (null)}
                            </>    
                          )
                        })), 
                      }}
                      canSearch={false}
                      entriesPerPage={false}

                    />
                    <AddDialogBox
                      open={isAddDialogOpen}
                      onClose={handleCloseAddDialog}
                      ctrl_number = {ctrl_number}
                      recordType={record_type}
                      setRecordType={setRecordType}
                      recordIPFS={record_IPFS}
                      setrecordIPFS={setRecordIPFS}   
                      recordID={record_id}                               
                      recordPassword={password}     
                      setRecordPassword={setPassword}   
                      payment_status={payment_status}    
                      setAlertMessage={setAlertMessage}
                      setIsError={setIsError}
                      setIsSuccess={setIsSuccess} 
                      handleCloseAddDialog={handleCloseAddDialog}
                      setData={setData}
                      data={data}
                      student_email={student_email}
                      student_id={student_id}
                      record_type_id={record_type_id}
                    />
                    <UploadDialogBox
                      open={isUploadDialogOpen}
                      onClose={handleCloseUploadDialog}
                      ctrl_number = {ctrl_number}
                      recordType={record_type}
                      setRecordType={setRecordType}
                      recordIPFS={record_IPFS}
                      setrecordIPFS={setRecordIPFS}   
                      recordID={record_id}                               
                      recordPassword={password}     
                      setRecordPassword={setPassword}   
                      payment_status={payment_status}    
                      setAlertMessage={setAlertMessage}
                      setIsError={setIsError}
                      setIsSuccess={setIsSuccess} 
                      handleCloseUploadDialog={handleCloseUploadDialog}
                      setData={setData}
                      data={setData}
                      student_email={student_email}
                      student_id={student_id}
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
                      setAlertMessage={setAlertMessage}
                      setIsError={setIsError}
                      setIsSuccess={setIsSuccess} 
                      handleCloseUpdateDialog={handleCloseUpdateDialog}
                      setData={setData}
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
    </EthProvider>
  );
}

export default Alumni_record_per_request;
