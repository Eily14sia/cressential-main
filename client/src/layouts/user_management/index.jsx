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

import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDBadge from "../../components/MDBadge";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";

// Data
import authorsTableData from "./data/authorsTableData";
import projectsTableData from "./data/projectsTableData";

function User_Management() {
  // const { columns, rows } = authorsTableData();
  // const { columns: pColumns, rows: pRows } = projectsTableData();

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/mysql/users")
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the fetched data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    { Header: "name", accessor: "name", width: "30%" },
    { Header: "Wallet Address", accessor: "wallet", width: "30%" },
    { Header: "Status", accessor: "status", width: "10%" },
    { Header: "Action", accessor: "action", width: "10%" },
  ];

  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Authors Table
                </MDTypography>
                
                <MDButton variant="gradient" color="dark">
                  Add Record&nbsp;
                  <Icon>add</Icon>
                </MDButton>
              </MDBox>

                <MDBox pt={3}>
                  {/* <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  /> */}
                  <DataTable 
                    table={{ columns, 
                      rows: data.map((item) => ({
                       
                        name: (
                        <MDBox ml={2} lineHeight={1}>
                          <MDTypography display="block" variant="button" fontWeight="medium">
                           {item.name}
                          </MDTypography>
                          <MDTypography variant="caption">{item.email}</MDTypography>
                        </MDBox>
                        ),
                        wallet: item.wallet_address,
                        status: (
                          <MDBox ml={-1}>
                            <MDBadge badgeContent="active" color="success" variant="gradient" size="sm" />
                          </MDBox>
                        ),
                        action: (
                          // <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
                          //   more_vert
                          // </Icon>
                          <>
                          <Tooltip title="Update" >
                            <IconButton color="info" onClick={() => handleOpenUpdateDialog(item)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" >
                            <IconButton color="secondary" onClick={() => handleDelete(item.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          </>     
                        )
                      })), 
                    }}
                    canSearch={true}
                  />
                  {renderMenu}
                </MDBox>
              </Card>
            </Grid>
            
          </Grid>
        </MDBox>
      <Footer />
  </DashboardLayout>
  );
}

export default User_Management;
