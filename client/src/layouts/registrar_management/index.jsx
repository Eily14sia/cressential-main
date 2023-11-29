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

function Student_Management() {
  // const { columns, rows } = authorsTableData();
  // const { columns: pColumns, rows: pRows } = projectsTableData();

  const [data, setData] = useState([]);
  const jwtToken = localStorage.getItem('token');

  useEffect(() => {
    fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/registrar-management`, {
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
    { Header: "User ID", accessor: "user_id", align: "center", width: "10%", },
    { Header: "Name", accessor: "name", align: "left", width: "20%",  },
    { Header: "Contact Info", accessor: "contact_info", align: "left",},
    { Header: "Status", accessor: "status" },
    { Header: "Action", accessor: "action" },
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

  function getStatusColor(status) {
    switch (status) {
      case 'Pending':
        return 'secondary'; // Set to your desired color for pending status
      case 'Received':
        return 'success'; // Set to your desired color for received status
      case 'Declined':
        return 'error'; // Set to your desired color for declined status
      case 'Completed':
        return 'info'; // Set to your desired color for completed status     
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
                  Registrar Management Table
                </MDTypography>
                
                <Link to="/registrar-management/add-record" component={RouterLink}>
                  <MDButton variant="gradient" color="dark">                    
                    <Icon>add</Icon> &nbsp;Add record
                  </MDButton>
                </Link>
              </MDBox>

                <MDBox pt={3}>
                  <DataTable 
                    table={{ columns, 
                      rows: data.map((item) => ({
                       
                        name: (
                        <MDBox lineHeight={1}>
                          <MDTypography display="block" variant="button" fontWeight="medium">
                           {item.first_name + " " + item.middle_name + " " + item.last_name}
                          </MDTypography>                          
                        </MDBox>
                        ),
                        contact_info: (
                          <MDBox lineHeight={1} textAlign="left">
                            <MDTypography display="block" variant="caption" fontWeight="medium">
                              {item.email}
                            </MDTypography>
                            <MDTypography variant="caption">{item.mobile_number}</MDTypography>
                          </MDBox>
                        ),
                        user_id: item.user_id,                       
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
                        action: (
                          // <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
                          //   more_vert
                          // </Icon>
                          <>
                          <Tooltip title="Update" >
                            <IconButton color="info" component={RouterLink}
                              to="/registrar-management/update-record" state={{ user_id: item.user_id, status: item.status, }}>
                              <EditIcon />
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

export default Student_Management;
