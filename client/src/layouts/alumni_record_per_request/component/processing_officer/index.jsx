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
function Processing_officer({ data, }) {
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedItemID, setSelectedItemID] = useState("");
  const [selectedItemPrice, setSelectedItemPrice] = useState(0);
  const [numOfCopies, setNumOfCopies] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0.00);

  // // Update the total amount when numOfCopies or selectedItemPrice changes
  // useEffect(() => {
  //   const newTotalAmount = (numOfCopies * (parseFloat(selectedItemPrice) || 0.00)).toFixed(2);
  //   updateTotalAmount(newTotalAmount); // Call the callback function to update the total amount in the parent component
  // }, [numOfCopies, selectedItemPrice, updateTotalAmount]);

  // useEffect(() => {
  //   updateSelectedItemID(selectedItemID);
  // }, [selectedItemID, updateSelectedItemID]);

  return (
    <>
        
            <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel  sx={{py: "1px"}} >Processing Officer <ArrowDropDownIcon/></InputLabel>
                <Select
                style={{ height: "47px", textAlign: "Left",}}
                label="Select an option"
                value={selectedItem} // Set the selected value
                onChange={(event) => {
                    const selectedItemValue = event.target.value;
                    setSelectedItem(selectedItemValue);
                }}
                >
                {data.map((item) => (
                    <MenuItem key={item.id} value={item.first_name + " " + item.middle_name + " " + item.last_name}>
                    {item.first_name + " " + item.middle_name + " " + item.last_name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
        
    </>
  );
}

export default Processing_officer;
