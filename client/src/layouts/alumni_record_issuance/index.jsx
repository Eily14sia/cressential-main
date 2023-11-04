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

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDAlert from "../../components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import IssuanceTable from  "../issuance_table";
import regeneratorRuntime from "regenerator-runtime";

function Alumni_record_issuance() {

  // =========== For the MDAlert =================
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );

  const [data, setData] = useState([]);
  const [recordID, setRecordID] = useState('');
  const [record_status, setRecordStatus] = useState('');

  // State to track whether the dialog is open
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const jwtToken = localStorage.getItem('token');

  useEffect(() => {
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/alumni/record-issuance", {
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

  const handleUpdateSubmit = async () => {
    // Create an updated record object to send to the server

    const updatedRecord = {
      recordStatus: record_status,
    };

    try {
      const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/update-record-per-request/${recordID}`, {
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
        // sendEmail('eilywow14@gmail.com', CID, recordPassword);
        
        fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/alumni/record-issuance", {
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
                <MDAlert color="error" dismissible sx={{marginBottom: '50px'}} onClose={() => setIsError(false)}>
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
                  Record Issuance Table
                </MDTypography>
              </MDBox>
                <MDBox p={3}>
                  <IssuanceTable 
                    recordID={recordID}
                    setRecordID={setRecordID}
                    record_status={record_status}
                    setRecordStatus={setRecordStatus}
                    handleUpdateSubmit={(event) => handleUpdateSubmit(event)} 
                    data={data} 
                    setData={setData} 
                    setIsSuccess={setIsSuccess}
                    setIsError={setIsError}   
                    setAlertMessage={setAlertMessage}
                    isUpdateDialogOpen={isUpdateDialogOpen}
                    setIsUpdateDialogOpen={setIsUpdateDialogOpen}
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

export default Alumni_record_issuance;
