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

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";

function DocumentSelection({ recordType, setRecordType }) {

  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8081/mysql/type-of-record")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        if (data.length > 0) {
          // Set recordType to the ID of the first item in the data array
          setRecordType(data[0].id);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
        
        <Grid item xs={12} sx={{ textAlign: "left" }}>
  <FormControl variant="outlined" fullWidth margin="normal">
    <InputLabel>Type of Record</InputLabel>

    <Select
      style={{ height: "50px" }}
      label="Select an option"
      value={recordType}
      onChange={(e) => setRecordType(e.target.value)}
    >
      {data.map((item) => (
        <MenuItem key={item.id} value={item.id}>
          {item.type}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>
        
    </>
  );
}

export default DocumentSelection;
