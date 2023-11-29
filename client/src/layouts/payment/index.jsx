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
import MDAlert from "../../components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";
import UpdateDialogBox from "./component/UpdateRecordModal";

function Payment() {

  const [data, setData] = useState([]);
  const [ctrl_number, setCtrlNumber] = useState('');
  const [payment_id, setPaymentID] = useState('');
  const [payment_date, setPaymentDate] = useState('');
  const [payment_method, setPaymentMethod] = useState('');
  const [payment_status, setPaymentStatus] = useState('');

  const jwtToken = localStorage.getItem('token');

  useEffect(() => {
    fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/payment`, {
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
  }, []);

  const columns = [
    { Header: "Ctrl No.", accessor: "ctrl_num"},
    { Header: "Payment ID", accessor: "payment_id"},
    { Header: "Student", accessor: "student_id"},
    { Header: "Payment Date", accessor: "payment_date" },
    { Header: "Total Amount", accessor: "total_amount"},
    { Header: "Payment Method", accessor: "payment_method"},
    { Header: "Payment Status", accessor: "payment_status"},
  ];

  function getStatusColor(payment_status) {
    switch (payment_status) {
      case 'Paid':
        return 'success'; // Set to your desired color for pending status
      default:
        return 'secondary'; // Set a default color for other status values
    }
  }

  // =========== For Student Name =================
  const [student_data, setStudentData] = useState([]);

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
      .then((fetchedData) => {
        setStudentData(fetchedData);
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

  // State to track whether the dialog is open
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // Function to open the dialog
  const handleOpenUpdateDialog = (ctrl_number, payment_id, payment_date, payment_method, payment_status) => {
    setIsSuccess(false);
    setIsError(false);
    setCtrlNumber(ctrl_number);
    setPaymentID(payment_id);
    setPaymentDate(payment_date);
    setPaymentMethod(payment_method);
    setPaymentStatus(payment_status);
    setIsUpdateDialogOpen(true);
  };

  // Function to close the dialog
  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
  };

  // Function to handle update record form submission
  const handleUpdateSubmit = async (event, ctrl_number, ) => {
    event.preventDefault();
    // Create an updated record object to send to the server
    const updatedRecord = {
      payment_id: payment_id,
      payment_date: payment_date,
      payment_method: payment_method,
      payment_status: payment_status,
    };

  try {
    const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/payment/update-record/${ctrl_number}`, {
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
      fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/payment`, {
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
    console.error('Error:', error);
  }
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
                  Payment Table
                </MDTypography>
              </MDBox>              
                <MDBox p={3}>   
                
                  <DataTable table={{ columns, 
                  rows: data.map((item) => ({
                    ctrl_num: "CTRL-"+item.ctrl_number,
                    payment_id: item.payment_id,
                    student_id: getStudentName(item.student_id),
                    payment_date: new Date(item.payment_date).toLocaleDateString(), // Format the date_requested
                    total_amount: item.total_amount,
                    payment_method: item.payment_method,
                    payment_status: (
                      <>
                      <MDBox ml={-1}>
                        <MDBadge
                          badgeContent={item.payment_status}
                          color={getStatusColor(item.payment_status)} // Set the badge color dynamically
                          variant="gradient"
                          size="sm"
                        />
                      </MDBox></>
                    ),
                    status: (
                      <>
                      <MDBox ml={-1}>
                        <MDBadge
                          badgeContent={item.status}
                          color={getStatusColor(item.status)} // Set the badge color dynamically
                          variant="gradient"
                          size="sm"
                        />
                      </MDBox></>
                    )
                    })), 
                  }} canSearch={true} />
                  <UpdateDialogBox
                    open={isUpdateDialogOpen}
                    onClose={handleCloseUpdateDialog}
                    onSubmit={(event) => handleUpdateSubmit(event, ctrl_number)}                      
                    ctrl_number={ctrl_number}           
                    payment_id={payment_id} 
                    payment_date={payment_date} 
                    payment_method={payment_method} 
                    payment_status={payment_status}  
                    setPaymentID={setPaymentID}
                    setPaymentDate={setPaymentDate}
                    setPaymentMethod={setPaymentMethod}
                    setPaymentStatus={setPaymentStatus}
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

export default Payment;
