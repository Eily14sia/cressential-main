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


function DocumentSelection({ recordType, setRecordType }) {

  const [data, setData] = useState([]);  
  const jwtToken = localStorage.getItem('token');
  
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
