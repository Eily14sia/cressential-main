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
import MDBox from "../../../../../components/MDBox";
import MDTypography from "../../../../../components/MDTypography";
import MDButton from "../../../../../components/MDButton";
import MDBadge from "../../../../../components/MDBadge";
import MDAlert from '../../../../../components/MDAlert';
import CircularProgress from '../../../../../examples/CircularProgress';

// Material Dashboard 2 React example components
import DataTable from "../../../../../examples/Tables/DataTable";

function Issuance_table() {

  const [data, setData] = useState([]);
  const jwtToken = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/due-request", {
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

  const issued_data = data.filter((record) => record.ipfs !== null);


  // =========== For the Datatable =================

  

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
    { Header: "Ctrl No.", accessor: "ctrl_number" },
    { Header: "Date Releasing", accessor: "date_releasing" },
  ];

  function getStatusColor(status) {
    switch (status) {
      case 'Invalid':
        return 'error'; // Set to your desired color for declined status
      case 'Valid':
        return 'info'; // Set to your desired color for completed status     
    }
  } 
  
  function getTypeOfRecord(type_ids) {
    const typeRecord = type_of_record.find((record) => record.id === parseInt(type_ids));
    return typeRecord ? typeRecord.type : null;
  }

  if (loading) {   
    return <CircularProgress/>  ;
  }
  
  function getColorForDate(date, ctrl_num, request_status) {
    if (!date) {
      return "dark"; // Default color
    }
  
    if (request_status === 'Pending' || request_status === 'Received') {

      function formatDate(date) {
        const formatted = new Date(date)
          .toISOString()
          .slice(0, 10);
        return formatted;
      }
      
      const releasingDate = formatDate(date);
      const today = formatDate(new Date());

      if (releasingDate < today) {
          return "error"; // Past due
      } else if (releasingDate === today) {  
        return "warning"; // Today
      }
    
      return "dark"; // Not past due and not today
    }
    
  }    

  return (
    <>
      <DataTable table={{ columns, 
        rows: issued_data.map((item) => ({          
        ctrl_number: (
          <Link to={`/alumni/record-per-request/${item.ctrl_number}`} component={RouterLink}>
            <MDTypography variant="button" fontWeight="medium"> CTRL-{item.ctrl_number} </MDTypography>
          </Link>
          ),   
          date_releasing: (
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
            ),        })), 
      }} canSearch={false} 
      showTotalEntries={false}
      entriesPerPage={false}/>
      
    </>
  );
}

export default Issuance_table;
