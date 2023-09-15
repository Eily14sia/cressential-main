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

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";

function Payment() {
  // const { columns, rows } = authorsTableData();
  // const { columns: pColumns, rows: pRows } = projectsTableData();

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/mysql/payment-record-request")
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the fetched data into the state
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
    { Header: "action", accessor: "action"}
  ];
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function getStatusColor(payment_status) {
    switch (payment_status) {
      case 'Paid':
        return 'success'; // Set to your desired color for pending status
      default:
        return 'secondary'; // Set a default color for other status values
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
        <MDBox pt={6} pb={3}>          
          <Grid container spacing={6}>
            <Grid item xs={12}>
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
                
                {/* <Link to="/graduate-record/add-record" component={RouterLink}> */}
                <Link to="/graduate-record/add-record" component={RouterLink}>
                  <MDButton variant="gradient" color="dark">
                    Add Record&nbsp;
                    <Icon>add</Icon>
                  </MDButton>
                </Link>
              </MDBox>
                <MDBox p={3}>   
                  <DataTable table={{ columns, 
                  rows: data.map((item) => ({
                    ctrl_num: "CTRL-"+item.ctrl_number,
                    payment_id: item.payment_id,
                    student_id: item.student_id,
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
                    ),
                    action: (
                      <>
                        <Tooltip title="Update" >
                          <IconButton color="info" onClick={() => handleOpenUpdateDialog(item.id, item.type, item.price)}>
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
