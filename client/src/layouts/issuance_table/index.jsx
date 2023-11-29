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
import CancelIcon from '@mui/icons-material/Cancel';

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDBadge from "../../components/MDBadge";
import MDAlert from '../../components/MDAlert';
import CircularProgress from '../../examples/CircularProgress';

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import UpdateDialogBox from './component/update_record_modal';
import CancelDialogBox from './component/cancel_request_modal';
import regeneratorRuntime from "regenerator-runtime";
import { useLocation } from "react-router-dom";

function Issuance_table({data, setData, setAlertMessage, setIsError, setIsSuccess, recordID, setRecordID,
  record_status,  setRecordStatus, handleUpdateSubmit, isUpdateDialogOpen,
  setIsUpdateDialogOpen}) {


  // State for form inputs
  const [record_type, setRecordType] = useState('');
  const [record_IPFS, setRecordIPFS] = useState('');


  // =========== For the Datatable =================
  // Retrieve the user_role from localStorage
  const user_role = localStorage.getItem('user_role');
  const jwtToken = localStorage.getItem('token');
  const [student_data, setStudentData] = useState([]);

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

  function getStudentName(student_id) {
    const last_name = student_data.find((item) => item.id == student_id)?.last_name;
    const middle_name = student_data.find((item) => item.id == student_id)?.middle_name;
    const first_name = student_data.find((item) => item.id == student_id)?.first_name
    const fullname = first_name + " " + middle_name + " " + last_name;
    return fullname;
  }
  const [registrar_data, setRegistrarData] = useState([]);

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

  function getRegistrarName(processing_officer) {
    const last_name = registrar_data.find((item) => item.id == processing_officer)?.last_name;
    const first_name = registrar_data.find((item) => item.id == processing_officer)?.first_name
    const fullname = first_name + " " + last_name;
    return fullname;
  }

  const [type_of_record, setTypeOfRecord] = useState([]);

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

  const columns = [
    { Header: "Ctrl No.", accessor: "ctrl_num"},
    { Header: "Record", accessor: "record_type" },
    { Header: "Student Name", accessor: "student_id"},
    { Header: "Date Issued", accessor: "date_issued"},
    { Header: "Processing Officer", accessor: "processing_officer"},
    { Header: "Record Status", accessor: "record_status"},
    { Header: "action", accessor: "action"}
  ];

  function getStatusColor(status) {
    switch (status) {
      case 'Invalid':
        return 'error'; // Set to your desired color for declined status
      case 'Valid':
        return 'info'; // Set to your desired color for completed status     
    }
  }  

  /* =========================================
               UPDATE RECORD
   ========================================= */

  // Function to open the dialog
  const handleOpenUpdateDialog = (recordID, recordType, ipfs, record_status,) => {
    setIsSuccess(false);
    setIsError(false);
    setRecordID(recordID); 
    setRecordType(recordType);
    setRecordIPFS(ipfs);
    setRecordStatus(record_status);
    setIsUpdateDialogOpen(true);    
  };

  // Function to close the dialog
  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
  };

  /* =========================================
               CANCEL RECORD
   ========================================= */

  // State to track whether the dialog is open
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Function to open the dialog
  const handleOpenCancelDialog = (recordID) => {
    setIsSuccess(false);
    setIsError(false);
    setRecordID(recordID); // Set the _recordID state
    setIsCancelDialogOpen(true);    
  };

  // Function to close the dialog
  const handleCloseCancelDialog = () => {
    setIsCancelDialogOpen(false);
  };

  return (
    <>
      <DataTable table={{ columns, 
        rows: data.map((item) => ({
        ctrl_num: (
          <Link to={`/alumni/record-per-request/${item.ctrl_number}`} component={RouterLink}>
            <MDTypography variant="button" fontWeight="medium"> CTRL-{item.ctrl_number} </MDTypography>
          </Link>
          ),       
        record_type: (
          <MDBox lineHeight={1}>
              <MDTypography display="block" variant="button" fontWeight="medium">
              {item.ipfs ? (
                <a target="_blank" rel="noopener noreferrer" href={`https://cressential.infura-ipfs.io/ipfs/${item.ipfs}`}>
                  {item.type}
                </a>
              ) : (
                <span>Null</span>
              )}
              </MDTypography>
              <MDTypography variant="caption">For: {item.purpose}</MDTypography>
            </MDBox>            
        ),
        student_id: getStudentName(item.student_id),
        date_issued: item.date_issued ? new Date(item.date_issued).toLocaleDateString() : "Null", // Format the date_releasing
        processing_officer: (item.processing_officer ? getRegistrarName(item.processing_officer) : ""),
        record_status: (
          <>
          {item.ipfs ? (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent={item.record_status}
                color={getStatusColor(item.record_status)} // Set the badge color dynamically
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ) : ""}
          </>
        ),
        action: (
          <>
            <Tooltip title="Update" >
                <IconButton color="success" onClick={() => handleOpenUpdateDialog(item.rpr_id, item.type, item.ipfs, item.record_status)} >
                    <EditIcon />
                  </IconButton>
            </Tooltip>
          </>                                 
        ), 
        })), 
      }} canSearch={true} />
      <UpdateDialogBox
        handleUpdateSubmit={handleUpdateSubmit}
        open={isUpdateDialogOpen}
        onClose={handleCloseUpdateDialog}
        recordType={record_type}
        recordIPFS={record_IPFS}
        recordStatus={record_status}     
        setRecordStatus={setRecordStatus}          
        setAlertMessage={setAlertMessage}
        setIsError={setIsError}
        setIsSuccess={setIsSuccess} 
        handleCloseUpdateDialog={handleCloseUpdateDialog}
        setData={setData}
        data={setData}
      />
      <CancelDialogBox
        setData={setData}
        open={isCancelDialogOpen}
        onClose={handleCloseCancelDialog}
        // onSubmit={(event) => handleCancelSubmit(event, recordID)}                      
        recordID={recordID}   
        setIsSuccess={setIsSuccess}
        setIsError={setIsError}   
        setAlertMessage={setAlertMessage}              
      />             
    </>
  );
}

export default Issuance_table;
