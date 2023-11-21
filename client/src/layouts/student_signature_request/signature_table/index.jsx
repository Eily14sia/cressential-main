import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Icon from "@mui/material/Icon";

import Tab from "@mui/material/Tab";
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentsIcon from '@mui/icons-material/Payments';

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import MDBadge from "../../../components/MDBadge";
import MDAlert from '../../../components/MDAlert';
import CircularProgress from '../../../examples/CircularProgress';

// Material Dashboard 2 React example components
import DataTable from "../../../examples/Tables/DataTable";
import UpdateDialogBox from './component/update_record_modal';
import CancelDialogBox from './component/cancel_request_modal';
import regeneratorRuntime from "regenerator-runtime";
import { useLocation } from "react-router-dom";
import axios from 'axios';

function Request_table({table_data, setData, setAlertMessage, setIsError, setIsSuccess,
  processing_officer, updateProcessingOfficer, request_status, updateRequestStatus,
  date_releasing, student_id, setStudentID, updateDateReleasing, isUpdateDialogOpen, setIsUpdateDialogOpen,
  ctrl_number, set_ctrl_number, handleUpdateSubmit }) {

  // =========== For the Datatable =================
  // Retrieve the user_role from localStorage
  const jwtToken = localStorage.getItem('token');
  const user_role = localStorage.getItem('user_role');
  const [loading, setLoading] = useState(true);

  const [student_data, setStudentData] = useState([]);

  useEffect(() => {
    // Check if data is not an empty array and set loading to false
    if (table_data.length >= 0) {
      setLoading(false);
    }

  }, [table_data]); // This useEffect watches for changes in the data state

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
  }, [table_data]);

  function getStudentName(student_id) {  
    const student = student_data.find((item) => item.id == student_id);
  
    if (!student) {
      return "loading ...";// or any other appropriate message
    }
  
    const last_name = student.last_name || "";
    const middle_name = student.middle_name || "";
    const first_name = student.first_name || "";
    const fullname = `${first_name} ${middle_name} ${last_name}`;
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
  }, [table_data]);

  function getRegistrarName(processing_officer) {
    const registrar = registrar_data.find((item) => item.id == processing_officer);
  
    if (!registrar) {
      return "loading ..."; // or any other appropriate message
    }
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
  }, [table_data]);

  function getTypeOfRecord(type_ids) {
    
    // Split the type_ids into an array of individual IDs
    const idsArray = type_ids.split(',');
  
    // Initialize an array to store the fetched type values
    const typeValues = [];
  
    // Loop through each ID and fetch the corresponding type value
    idsArray.forEach((id) => {
  
      
      // Find the type record that matches the current ID
      const typeRecord = type_of_record.find((record) => record.id === parseInt(id));
      if (!typeRecord) {
        return "loading ..."; // or any other appropriate message
      }
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
    { Header: "Date", accessor: "date_requested"},
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
      case 'Cancelled':
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


  // Function to open the dialog
  const handleOpenUpdateDialog = (ctrl_number, processing_officer, date_releasing, request_status, student_id) => {
    setIsSuccess(false);
    setIsError(false);
    updateProcessingOfficer(processing_officer); // Reset other form fields 
    updateRequestStatus(request_status);
    updateDateReleasing(date_releasing);
    set_ctrl_number(ctrl_number); // Set the _ctrl_number state
    setStudentID(student_id);
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
  const handleOpenCancelDialog = (ctrl_number) => {
    setIsSuccess(false);
    setIsError(false);
    set_ctrl_number(ctrl_number); // Set the _ctrl_number state
    setIsCancelDialogOpen(true);    
  };

  // Function to close the dialog
  const handleCloseCancelDialog = () => {
    setIsCancelDialogOpen(false);
  };

  function getColorForDate(date, ctrl_num, request_status) {
    if (!date) {
      return "dark"; // Default color
    }
  
    if (request_status === 'Pending' || request_status === 'Received') {
      const currentDate = new Date();
      const releasingDate = new Date(date);
      
      if (releasingDate < currentDate) {
  
        return "error"; // Past due
      } else if (releasingDate.toDateString() === currentDate.toDateString()) {
  
        return "warning"; // Today
      }
    
      return "dark"; // Not past due and not today
    }
    
  }
  
  if (loading) {   
    return <CircularProgress/>  ;
  }

  return (
    <>
      <DataTable table={{ columns, 
        rows: table_data.map((item) => ({
        ctrl_num: "CTRL-"+item.ctrl_number,
        student_id: getStudentName(item.student_id),
        
        // date_requested: new Date(item.date_requested).toLocaleDateString(), // Format the date_requested
        date_requested: (
          <MDBox lineHeight={1}>
            <MDTypography variant="caption" >
              Requested: &nbsp;
            </MDTypography>
            <MDTypography variant="button" fontWeight="medium">
              {new Date(item.date_requested).toLocaleDateString()} <br/>
            </MDTypography>
            <MDTypography variant="caption">
              Releasing: &nbsp;
            </MDTypography>
            <MDTypography
              variant="button"
              color={getColorForDate(item.date_releasing, item.ctrl_number, item.request_status)}
              fontWeight="medium"
            >
              {item.date_releasing ? (new Date(item.date_releasing).toLocaleDateString()) : ""}
            </MDTypography>
          </MDBox>
          ),
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
          {parseInt(user_role) === 1 ? (
            <>
            <Tooltip title={`Update CTRL-${item.ctrl_number}`} >
              <IconButton color="success" onClick={() => 
                handleOpenUpdateDialog( 
                  item.ctrl_number, item.processing_officer, item.date_releasing, item.request_status, item.student_id
                )}>
                <EditIcon /> 
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Delete" >
              <IconButton color="secondary" onClick={() => handleOpenDeleteDialog(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip> */}
            </>
            ) : ( 
              <>
              <Tooltip title="Pay now" >
                <span>
                <IconButton  
                  to={`/record-request`} component={RouterLink} 
                  state={{ activeStep: 1, total_amount: item.total_amount, recordIDs: item.request_record_type_id, ctrl_number: item.ctrl_number }}
                  disabled={item.payment_status !== 'Unpaid' || item.request_status !== 'Pending'} color="success"                     
                    >
                  <PaymentsIcon />
                </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Cancel Request" >
                <span>
                <IconButton disabled={item.request_status !== 'Pending' || item.payment_status !== 'Unpaid'} color="secondary" 
                  onClick={() => handleOpenCancelDialog(item.ctrl_number)}>
                  <CancelIcon />
                </IconButton>
                </span>
              </Tooltip>
              </>
            )}
          </>                                 
        ), 
        })), 
      }} canSearch={true} />
      <UpdateDialogBox
        data={table_data}
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
        handleUpdateSubmit={handleUpdateSubmit}
      />   
      <CancelDialogBox
        setData={setData}
        open={isCancelDialogOpen}
        onClose={handleCloseCancelDialog}
        // onSubmit={(event) => handleCancelSubmit(event, ctrl_number)}                      
        ctrl_number={ctrl_number}   
        setIsSuccess={setIsSuccess}
        setIsError={setIsError}   
        setAlertMessage={setAlertMessage}              
      />             
    </>
  );
}

export default Request_table;
