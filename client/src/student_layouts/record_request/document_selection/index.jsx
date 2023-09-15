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
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import MDInput from "../../../components/MDInput";

function DocumentSelection({ data, updateTotalAmount  }) {
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedItemPrice, setSelectedItemPrice] = useState("");
  const [numOfCopies, setNumOfCopies] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  // Update the total amount when numOfCopies or selectedItemPrice changes
  useEffect(() => {
    const newTotalAmount = numOfCopies * (parseFloat(selectedItemPrice) || 0);
    updateTotalAmount(newTotalAmount); // Call the callback function to update the total amount in the parent component
  }, [numOfCopies, selectedItemPrice, updateTotalAmount]);

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
                    setTotalAmount(selectedPrice * numOfCopies || 0); // Set the price or an empty string if not found
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
        <Grid item xs={3} sx={{margin:"auto"}}>
            <MDTypography variant="body2" >No. of Copies:</MDTypography>
        </Grid>
        <Grid item xs={9}>
            <MDInput type="number" value={numOfCopies} label="Enter Number of Copies" fullWidth
                onChange={(event) => {
                const value = event.target.value;
                setNumOfCopies(value);
                // Calculate the new total amount based on the selected item's price and the number of copies
                const newTotalAmount = value * (parseFloat(selectedItemPrice) || 0); // Ensure selectedItemPrice is parsed as a float or use 0 if it's not valid
                setTotalAmount(newTotalAmount);
            }}
            />
        </Grid>
    </>
  );
}

export default DocumentSelection;
