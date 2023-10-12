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

// Material Dashboard 2 React example components
import DataTable from "../../../../../examples/Tables/DataTable";

function Issuance_table() {

  const [data, setData] = useState([]);

  useEffect(() => {
      fetch("http://localhost:8081/mysql/record-issuance")
      .then((res) => res.json())
      .then((data) => {
          setData(data); // Set the fetched data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  const issued_data = data.filter((record) => record.ipfs !== null);


  // =========== For the Datatable =================

  

  const [type_of_record, setTypeOfRecord] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/mysql/type-of-record")
      .then((res) => res.json())
      .then((type_of_record) => {
        setTypeOfRecord(type_of_record); // Set the fetched registrar_data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    { Header: "Record", accessor: "record_type" },
    { Header: "Date Issued", accessor: "date_issued" },
    { Header: "Status", accessor: "record_status"},
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
  
    return(typeRecord.type);
  }
  
  return (
    <>
      <DataTable table={{ columns, 
        rows: issued_data.map((item) => ({          
        record_type: (
          <MDBox lineHeight={1}>
              <MDTypography display="block" variant="button" fontWeight="medium">
              {item.ipfs ? (
                  <a target="_blank" rel="noopener noreferrer" href={`http://localhost:8080/ipfs/${item.ipfs}`}>
                    {getTypeOfRecord(item.record_type_id)}
                  </a>     
              ) : (
                <span>N/A</span>
              )}
              </MDTypography>
            </MDBox>            
        ),
        date_issued: item.date_issued ? new Date(item.date_issued).toLocaleDateString() : "N/A", 
        record_status: (
          <>
          <MDBox ml={-1}>
            <MDBadge
              badgeContent={item.record_status}
              color={getStatusColor(item.record_status)} // Set the badge color dynamically
              variant="gradient"
              size="sm"
            />
          </MDBox></>
        ),
        
        })), 
      }} canSearch={false} 
      showTotalEntries={false}
      entriesPerPage={false}/>
      
    </>
  );
}

export default Issuance_table;
