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

import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";


// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import MDInput from "../../../components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import DataTable from "../../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";

// Data
import authorsTableData from "../data/authorsTableData";
import projectsTableData from "../data/projectsTableData";

function Graduate_Add_Record() {
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();

  return (
    <DashboardLayout>
  <DashboardNavbar />
  <MDBox pt={6} pb={3}>
    <Grid container spacing={6} justifyContent="center">
      <Grid item xs={12} sm={6}>
        <Card>
          <MDBox pt={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput type="text" label="Text" fullWidth />
              </MDBox>
              <MDBox>
                <MDInput type="password" label="Password" fullWidth />
              </MDBox>              
              <MDBox mb={1}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel>Select an option</InputLabel>
                  <Select style={{ height: "40px" }}
                    label="Select an option"
                    // Add more props as needed
                  >
                    <MenuItem value="option1">Option 1</MenuItem>
                    <MenuItem value="option2">Option 2</MenuItem>
                    <MenuItem value="option3">Option 3</MenuItem>
                  </Select>
                </FormControl>
              </MDBox>
              <MDBox mb={2}>
                <MDInput fullWidth
                    type="file"
                    accept=".jpg, .png, .jpeg"
                    // Add more props as needed
                  />              </MDBox>
              <MDBox mt={4} mb={1}>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link to="/graduate-record/add-record" component={RouterLink}>
                      <MDButton variant="gradient" color="info" type="submit">
                        Submit&nbsp;
                        <Icon>add</Icon>
                      </MDButton>
                    </Link>
                  </Grid>
                </Grid>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </Grid>
    </Grid>
  </MDBox>
  <Footer />
</DashboardLayout>

  );
}

export default Graduate_Add_Record;
