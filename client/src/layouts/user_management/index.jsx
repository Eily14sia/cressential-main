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
import VisibilityIcon from '@mui/icons-material/Visibility';
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

function User_Management() {
  const jwtToken = localStorage.getItem('token');

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/users`, {
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
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    { Header: "user_id", accessor: "user_id", width: "10%" },
    { Header: "email", accessor: "email", width: "10%" },
    { Header: "Wallet Address", accessor: "wallet", width: "30%" },
    { Header: "Status", accessor: "status", width: "10%" },
    { Header: "Role", accessor: "role", width: "10%" },
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
      <MenuItem onClick={closeMenu}><VisibilityIcon />&nbsp; View Record</MenuItem>
      <MenuItem onClick={closeMenu}><EditIcon />&nbsp; Edit Record</MenuItem>
      <MenuItem onClick={closeMenu}><DeleteIcon />&nbsp; Delete Record</MenuItem>
    </Menu>
  );

  function getStatusColor(status) {
    switch (status) {
      case '1':
        return 'secondary';
      case '2':
        return 'info';   
      case 'active':
        return 'success';
      case 'inactive':
        return 'light';   
    }
  } 

  function getRole(role) {
    switch (role) {
      case '1':
        return 'Registar';
      case '2':
        return 'Student';
  }
} 
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
                  User Management Table
                </MDTypography>                
                
              </MDBox>

                <MDBox pt={3}>
                  <DataTable 
                    table={{ columns, 
                      rows: data.map((item) => ({
                       
                        user_id: (
                        <MDBox ml={2} lineHeight={1}>
                          <MDTypography display="block" variant="button" fontWeight="medium">
                           {item.user_id}
                          </MDTypography>
                        </MDBox>
                        ),
                        email: item.email,                        
                        wallet: item.wallet_address,
                        status: (
                          <>
                            <MDBox ml={-1}>
                              <MDBadge
                                badgeContent={item.status}
                                color={getStatusColor(item.status)} // Set the badge color dynamically
                                variant="gradient"
                                size="sm"
                              />
                            </MDBox>
                          </>
                        ),
                        role: (
                          <>
                            <MDBox ml={-1}>
                              <MDBadge
                                badgeContent={getRole(item.role)}
                                color={getStatusColor(item.role)} // Set the badge color dynamically
                                variant="gradient"
                                size="sm"
                              />
                            </MDBox>
                          </>
                        ),
                        action: (
                          <>
                            <Tooltip title="Update">
                              {parseInt(item.role) === 1 ? (
                                <IconButton
                                  color="info"
                                  component={RouterLink}
                                  to="/registrar-management/update-record"
                                  state={{ user_id: item.user_id, status: item.status }}
                                >
                                  <EditIcon />
                                </IconButton>
                              ) : (
                                <IconButton
                                  color="info"
                                  component={RouterLink}
                                  to="/student-management/update-record"
                                  state={{
                                    user_id: item.user_id,
                                    status: item.status,                                    
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              )}
                            </Tooltip>
                          </>  
                          // <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
                          //   more_vert
                          // </Icon>   
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
