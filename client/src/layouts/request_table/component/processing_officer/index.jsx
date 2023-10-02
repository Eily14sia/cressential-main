import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Icon from "@mui/material/Icon";
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
function Processing_officer({ processing_officer, setProcessingOfficer }) {
  const [registrar_data, setregistrar_data] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:8081/mysql/registrar-management")
      .then((res) => res.json())
      .then((registrar_data) => {
        setregistrar_data(registrar_data); // Set the fetched registrar_data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  // Check if registrar_data is still loading
  if (registrar_data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <FormControl variant="outlined" fullWidth margin="normal">
        <InputLabel sx={{ py: "1px" }}>Processing Officer <ArrowDropDownIcon /></InputLabel>
        <Select
          style={{ height: "47px", textAlign: "Left" }}
          value={processing_officer} // Set the selected value
          onChange={(e) => setProcessingOfficer(e.target.value)}
        >
          {registrar_data.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.first_name + " " + item.middle_name + " " + item.last_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

export default Processing_officer;
