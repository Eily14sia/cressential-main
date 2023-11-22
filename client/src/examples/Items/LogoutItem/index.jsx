/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { forwardRef } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import MenuItem from "@mui/material/MenuItem";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import CheckCircleIcon from '@mui/icons-material/Check';
import Cancel from '@mui/icons-material/Close';

// custom styles for the LogoutItem
import menuItem from "./styles";

const LogoutItem = forwardRef(({ icon, title, desc, handleCloseDialog, logout, ...rest }, ref) => (
  <MDBox minWidth={300} py={1} justifyContent="center">
    <MDBox py={0.5} display="flex" alignItems="center" lineHeight={1} justifyContent="center">
      <MDTypography variant="body1" color="secondary" lineHeight={0.75}>
        {icon}
      </MDTypography>
      <MDBox display="flex" justifyContent="center">
        <MDTypography variant="h6" fontWeight="regular" sx={{ ml: 1 }}>
          <b>{desc}</b> {title} 
        </MDTypography>
      </MDBox>    
    </MDBox>
    <MDBox display="flex" justifyContent="center">
      <MDButton variant="text" color="error" onClick={handleCloseDialog}> <Cancel sx={{marginRight: "5px", marginBottom: "2px"}}/> No</MDButton>
      <MDButton variant="text" color="info" onClick={logout}> <CheckCircleIcon sx={{marginRight: "5px", marginBottom: "2px"}}/> Yes</MDButton>
    </MDBox>
</MDBox>
));

// Typechecking props for the LogoutItem
LogoutItem.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default LogoutItem;
