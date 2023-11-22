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
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/record-issuance", {
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
    { Header: "Record", accessor: "record_type" },
    { Header: "Date Issued", accessor: "date_issued" },
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
  
  return (
    <>
      <DataTable table={{ columns, 
        rows: issued_data.map((item) => ({          
        record_type: (
          <MDBox lineHeight={1}>
              <MDTypography display="block" variant="button" fontWeight="medium">
              {item.ipfs ? (
                  <a target="_blank" rel="noopener noreferrer" href={`https://cressential.infura-ipfs.io/ipfs/${item.ipfs}`}>
                    {getTypeOfRecord(item.record_type_id)}
                  </a>     
              ) : (
                <span>N/A</span>
              )}
              </MDTypography>
            </MDBox>            
        ),
        date_issued: item.date_issued ? new Date(item.date_issued).toLocaleDateString() : "N/A", 
       
        
        })), 
      }} canSearch={false} 
      showTotalEntries={false}
      entriesPerPage={false}/>
      
    </>
  );
}

export default Issuance_table;
