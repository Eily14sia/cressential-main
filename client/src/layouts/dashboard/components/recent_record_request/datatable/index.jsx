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

import Icon from "@mui/material/Icon";
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';

// Material Dashboard 2 React components
import MDBox from "../../../../../components/MDBox";
import MDTypography from "../../../../../components/MDTypography";
import MDButton from "../../../../../components/MDButton";
import MDBadge from "../../../../../components/MDBadge";
import MDAlert from '../../../../../components/MDAlert';

// Material Dashboard 2 React example components
import DataTable from "../../../../../examples/Tables/DataTable";

function Request_table() {

    const [data, setData] = useState([]);
    const jwtToken = localStorage.getItem('token');

    useEffect(() => {
      fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/record-request", {
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
          setData(data.slice(0, 5));
        })
        .catch((err) => console.log(err));
    }, []);

  const [type_of_record, setTypeOfRecord] = useState([]);

  useEffect(() => {
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/type-of-record")
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
    { Header: "Record Type", accessor: "record_type" },
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


  return (
    <>
      <DataTable 
        table={{ columns, 
        rows: data.map((item) => ({
        ctrl_num: "CTRL-"+item.ctrl_number,
        record_type: (
          <MDBox lineHeight={1}>
              <MDTypography display="block" variant="button" fontWeight="medium">
                {getTypeOfRecord(item.request_record_type_id)}
              </MDTypography>
              <MDTypography variant="caption">For: {item.purpose}</MDTypography>
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
            <Link to={`/record-per-request/${item.ctrl_number}`} component={RouterLink} >
              <Tooltip title="View" >
                <IconButton color="info" >
                    <VisibilityIcon />
                  </IconButton>
              </Tooltip>
            </Link>
            
          </>                                 
        ), 
        })), 
      }} canSearch={false} 
      showTotalEntries={false}
      entriesPerPage={false}/>
      
    </>
  );
}

export default Request_table;
