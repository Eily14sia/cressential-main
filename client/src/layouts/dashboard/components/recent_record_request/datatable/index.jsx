import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components

import Icon from "@mui/material/Icon";
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import MetamaskModal from "../../../../../examples/MetamaskModal";

// Material Dashboard 2 React components
import MDBox from "../../../../../components/MDBox";
import MDTypography from "../../../../../components/MDTypography";
import MDButton from "../../../../../components/MDButton";
import MDBadge from "../../../../../components/MDBadge";
import MDAlert from '../../../../../components/MDAlert';
import CircularProgress from '../../../../../examples/CircularProgress';

// Material Dashboard 2 React example components
import DataTable from "../../../../../examples/Tables/DataTable";

function Request_table() {

    const [data, setData] = useState([]);
    const jwtToken = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => {
      setIsDialogOpen(true);
    };
  
    const handleCloseDialog = () => {
      setIsDialogOpen(false);
    };

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
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }, []);

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
        typeValues.push("loading ..."); // or any other appropriate message
      } else {
        typeValues.push(typeRecord.type);
      }
    });
  
    return typeValues;
  }


  const columns = [
    { Header: "Ctrl No.", accessor: "ctrl_num"},
    { Header: "Record Type", accessor: "record_type" },
    { Header: "Payment Status", accessor: "payment_status"},
    { Header: "Request Status", accessor: "request_status"},
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

  if (loading) {   
    return <CircularProgress/>  ;
  }

  return (
    <>
      
      <MetamaskModal open={isDialogOpen} onClose={handleCloseDialog} />
      <DataTable 
        table={{ columns, 
        rows: data.map((item) => ({
       
        ctrl_num: (
          <> 
          {(window.ethereum) ? (
            <Link to={`/record-per-request/${item.ctrl_number}`} component={RouterLink} >
              <MDTypography 
                color="dark" 
                variant="text" 
                fontWeight="medium"
                sx={{
                  '&:hover': {
                    color: 'info.main',
                  },
                }}
              >
                {"CTRL-"+item.ctrl_number}
              </MDTypography>
            </Link>
          ) : (
            <MDTypography 
              color="dark" 
              variant="text" 
              fontWeight="medium"
              onClick={handleOpenDialog}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  color: 'info.main',
                },
              }}
            >
              {"CTRL-"+item.ctrl_number}
            </MDTypography>
          )}          
          </>                                 
        ), 
        record_type: (
          <MDBox lineHeight={1}>
            {getTypeOfRecord(item.request_record_type_id).map((type, index) => (
              <div key={index}>
                <MDTypography display="block" variant="caption" fontWeight="medium">
                  {type}
                </MDTypography>
                
              </div>
            ))}
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
        })), 
      }} canSearch={false} 
      showTotalEntries={false}
      entriesPerPage={false}/>
      
    </>
  );
}

export default Request_table;
