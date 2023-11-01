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
import React from 'react';
import { useEffect, useState } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";

// Material Dashboard 2 React example components
import SidenavCollapse from "./SidenavCollapse";
import SidenavCollapseNested from "./SidenavCollapseNested";

// Custom styles for the Sidenav
import SidenavRoot from "./SidenavRoot";
import sidenavLogoLabel from "./styles/sidenav";
import Alumni_record_request from "../../layouts/alumni_record_request";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "../../context";

function Sidenav({ color, brand, brandName, routes, userID, ...rest }) {

  // Retrieve the user_role from localStorage
  const user_role = localStorage.getItem('user_role');

  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  // const pathSegments = location.pathname.split('/'); // Split the pathname into segments
  // const collapseName = pathSegments[1]; // The first segment after the initial '/'
  const [collapseName, setCollapseName] = useState(null);

  useEffect(() => {
    console.log(collapseName); // Log the value of collapseName
  }, [collapseName]);
  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);



  // console.log(parseInt(userID))
  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = (parseInt(user_role) === 1) ? [

    // Example of a "collapse" type
    <NavLink key="dashboard" to="/dashboard" onClick={() => setCollapseName("dashboard")}>
    <SidenavCollapse name="Dashboard" icon={<Icon fontSize="small">dashboard</Icon>} active={collapseName === "dashboard"} />
    </NavLink>,

    /// Example of a "collapse" type for "Student" without navigation
    <div
      key="student"
      onClick={() => {
        if (collapseName === "student") {
          setCollapseName(null); // Toggle collapseName to null if it's already "alumni"
        } else {
          setCollapseName("student");
        }
      }}
    >
      <SidenavCollapse
        name="Student Record"
        icon={
          <div>
            <Icon fontSize="small">person</Icon> 
          </div>
        }
        active={collapseName === "student"}
        isNested={true}
      />
    </div>,

    // Conditionally render sub-items for "Student" tab when it's clicked
    collapseName === "student" && (
      <>
        <NavLink key="registrar-student-record-request" to="/student/record-request">
          <SidenavCollapseNested name="Record Request" icon={<Icon fontSize="small">send</Icon>} active={collapseName === "registrar-student-record-request"} />
        </NavLink>
        <NavLink key="registrar-student-record-issuance" to="/student/record-issuance">
          <SidenavCollapseNested name="Record Issuance" icon={<Icon fontSize="small">description</Icon>} active={collapseName === "registrar-student-record-issuance"} />
        </NavLink>
      </>
    ),



    /// Example of a "collapse" type for "Alumni" without navigation
    <div
    key="alumni"
    onClick={() => {
      if (collapseName === "alumni") {
        setCollapseName(null); // Toggle collapseName to null if it's already "alumni"
      } else {
        setCollapseName("alumni");
      }
    }}
    >
    <SidenavCollapse
      name="Alumni Record"
      icon={
        <div>
          <Icon fontSize="small">school</Icon> {/* Icon indicating Alumni */}
        </div>
      }
      active={collapseName === "alumni"}
      isNested={true}
    />
    </div>,

    // Conditionally render sub-items for "Alumni" tab when it's clicked
    collapseName === "alumni" && (
    <>
      <NavLink key="registrar-alumni-record-request" 
        to="/alumni/record-request" >
        <SidenavCollapseNested name="Record Request" icon={<Icon fontSize="small">send</Icon>} active={collapseName === "registrar-alumni-record-request"} />
      </NavLink>
      <NavLink key="registrar-alumni-record-issuance" to="/alumni/record-issuance">
        <SidenavCollapseNested name="Record Issuance" icon={<Icon fontSize="small">description</Icon>} active={collapseName === "registrar-alumni-record-issuance"} />
      </NavLink>
    </>
    ),

    <NavLink key="due-request" to="/due-request" onClick={() => setCollapseName("due-request")}>
    <SidenavCollapse name="Due Record Request" icon={<Icon fontSize="small">today</Icon>} active={collapseName === "due-request"} />
    </NavLink>,
    <NavLink key="payment" to="/payment" onClick={() => setCollapseName("payment")}>
    <SidenavCollapse name="Payment" icon={<Icon fontSize="small">payment</Icon>} active={collapseName === "payment"} />
    </NavLink>,

    <NavLink key="type-of-record" to="/type-of-record" onClick={() => setCollapseName("type-of-record")}>
    <SidenavCollapse name="Type of Record" icon={<Icon fontSize="small">folder</Icon>} active={collapseName === "type-of-record"} />
    </NavLink>,

    <NavLink key="student-management" to="/student-management" onClick={() => setCollapseName("student-management")}>
    <SidenavCollapse name="Student Management" icon={<Icon fontSize="small">backpack</Icon>} active={collapseName === "student-management"} />
    </NavLink>,

    <NavLink key="registrar-management" to="/registrar-management" onClick={() => setCollapseName("registrar-management")}>
    <SidenavCollapse name="Registrar Management" icon={<Icon fontSize="small">admin_panel_settings</Icon>} active={collapseName === "registrar-management"} />
    </NavLink>,

    <NavLink key="user-management" to="/user-management" onClick={() => setCollapseName("user-management")}>
    <SidenavCollapse name="User Management" icon={<Icon fontSize="small">group</Icon>} active={collapseName === "user-management"} />
    </NavLink>,

  ] : (parseInt(user_role) === 2) ? [
// ==================  STUDENT  =======================

  <NavLink key="record-request" to="/record-request" onClick={() => setCollapseName("record-request")}>
    <SidenavCollapse name="Record Request" icon={<Icon fontSize="small">send</Icon>} active={collapseName === "record-request"} />
  </NavLink>,
  <NavLink key="student-request-table" to="/student-request-table" onClick={() => setCollapseName("student-request-table")}>
    <SidenavCollapse name="Request Table" icon={<Icon fontSize="small">assignment</Icon>} active={collapseName === "student-request-table"} />
  </NavLink>,
  
]: [
  // Code to execute if none of the conditions are met
];
    






  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>
      {renderRoutes.map((route, index) => (
        <React.Fragment key={index}>{route}</React.Fragment>
      ))}
</List>

    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;