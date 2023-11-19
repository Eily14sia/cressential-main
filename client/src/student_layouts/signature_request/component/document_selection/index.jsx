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

function DocumentSelection({ data,  updateSelectedItemID }) {
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedItemID, setSelectedItemID] = useState("");
  const [selectedItemPrice, setSelectedItemPrice] = useState(0);
  const [numOfCopies, setNumOfCopies] = useState(1);

  // // Update the total amount when numOfCopies or selectedItemPrice changes
  // useEffect(() => {
  //   const newTotalAmount = (numOfCopies * (parseFloat(selectedItemPrice) || 0.00)).toFixed(2);
  //   setTotalAmount(newTotalAmount); // Call the callback function to update the total amount in the parent component
  // }, [numOfCopies, selectedItemPrice, setTotalAmount]);

  useEffect(() => {
    updateSelectedItemID(selectedItemID);
  }, [selectedItemID, updateSelectedItemID]);

  return (
    <>
        <Grid item xs={3} sx={{margin:"auto"}}>
            <MDTypography variant="body2">Document:</MDTypography>
        </Grid>
        <Grid item xs={9} sx={{margin:"auto"}}>
            <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel>Select an option</InputLabel>
                <Select
                style={{ height: "50px" }}
                label="Select an option"
                value={selectedItem} // Set the selected value
                onChange={(event) => {
                    const selectedItemValue = event.target.value;
                    setSelectedItem(selectedItemValue);

                    // Find the corresponding item and set the price
                    const selectedPrice = data.find((item) => item.type === selectedItemValue)?.price;
                    setSelectedItemPrice(selectedPrice || ""); // Set the price or an empty string if not found
                    const selectedItemID = data.find((item) => item.type === selectedItemValue)?.id;
                    setSelectedItemID(selectedItemID);
                    // setTotalAmount(selectedPrice * numOfCopies || 0); // Set the price or an empty string if not found
                }}
                >
                {data.map((item) => (
                    <MenuItem key={item.id} value={item.type}>
                    {item.type}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={3} sx={{margin:"auto"}}>
            <MDTypography variant="body2">Price (Php):</MDTypography>
        </Grid>
        <Grid item xs={9}>
            <MDInput type="number" disabled value={selectedItemPrice} fullWidth/>
        </Grid>
        
    </>
  );
}

export default DocumentSelection;
