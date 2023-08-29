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

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";
import AddDialogBox from './component/AddRecordModal';
import UpdateDialogBox from './component/UpdateRecordModal';

// Data
import authorsTableData from "./data/authorsTableData";
import projectsTableData from "./data/projectsTableData";

function Type_of_Record() {
  // const { columns, rows } = authorsTableData();
  // const { columns: pColumns, rows: pRows } = projectsTableData();

  // =========== For the datatable =================
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/type-of-record")
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the fetched data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    { Header: "id", accessor: "id", width: "10%" },
    { Header: "type", accessor: "type"},
    { Header: "price", accessor: "price", align: "center"},
    { Header: "action", accessor: "action", align: "center"}
  ];

  // ======== Add Record Dialog Box ==========
  
  // State to track whether the dialog is open
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to open the dialog
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // State for form inputs
  const [recordType, setRecordType] = useState('');
  const [recordPrice, setRecordPrice] = useState('');

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Create a new record object to send to the server
    const newRecord = {
      type: recordType,
      price: recordPrice,
    };

    try {
      const response = await fetch('http://localhost:8081/add-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecord),
      });

      if (response.ok) {
        handleCloseDialog();
      } else {
        console.error('Failed to add record');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ======== Update Record Dialog Box ==========

  // State to track whether the dialog is open
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // Function to open the dialog
  const handleOpenUpdateDialog = () => {
    setIsUpdateDialogOpen(true);
  };

  // Function to close the dialog
  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
  };

  // State for form inputs
  const [recordUpdateType, setUpdateRecordType] = useState('');
  const [recordUpdatePrice, setUpdateRecordPrice] = useState('');

  // Function to handle form submission
  const handleUpdateSubmit = (event) => {
    event.preventDefault();
    // Here you can perform actions with the form data, like sending it to a server
    // For now, let's just print the values to the console
    console.log('Record Type:', recordType);
    console.log('Record Price:', recordPrice);
    // Close the dialog after submission
    handleCloseUpdateDialog();
  };

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
                  Type of Record Table
                </MDTypography>
                
                <MDButton variant="gradient" color="dark" onClick={handleOpenDialog}>
                  Add Record&nbsp;
                  <Icon>add</Icon>
                </MDButton>
                <AddDialogBox
                  open={isDialogOpen}
                  onClose={handleCloseDialog}
                  onSubmit={handleSubmit}
                  recordType={recordType}
                  setRecordType={setRecordType}
                  recordPrice={recordPrice}
                  setRecordPrice={setRecordPrice}
                />
              </MDBox>

                <MDBox pt={3}>
                  {/* <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  /> */}
                  <DataTable table={{ columns, 
                  rows: data.map((item) => ({
                    id: item.id,
                    type: item.type,
                    price: item.price,
                    action: (
                      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" onClick={handleOpenUpdateDialog}>
                        Update
                      </MDTypography>
                    ),
                    })), 
                  }} canSearch={true} />
                  <UpdateDialogBox
                  open={isUpdateDialogOpen}
                  onClose={handleCloseUpdateDialog}
                  onSubmit={handleUpdateSubmit}
                  recordType={recordUpdateType}
                  setRecordType={setUpdateRecordType}
                  recordPrice={recordUpdatePrice}
                  setRecordPrice={setUpdateRecordPrice}
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

export default Type_of_Record;
