import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDBadge from "../../components/MDBadge";
import MDAlert from "../../components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";


function Verification_table() {

  const [data, setData] = useState([]);
  const [ctrl_number, setCtrlNumber] = useState('');
  const [payment_id, setPaymentID] = useState('');
  const [payment_date, setPaymentDate] = useState('');
  const [payment_method, setPaymentMethod] = useState('');
  const [payment_status, setPaymentStatus] = useState('');

  const jwtToken = localStorage.getItem('token');
  const user_role = parseInt(localStorage.getItem('user_role'));
  const user_id = parseInt(localStorage.getItem('user_id'));

  // console.log("user_role: ", user_role);

  const fetchData = async (url, options) => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error("Failed to authenticate token");
      }
      return await res.json();
    } catch (error) {
      console.error("Error:", error);
      throw error; // Rethrow the error if needed
    }
  };
  
  useEffect(() => {
    const fetchDataForUserRole = async () => {
      try {
        if (user_role === 1) {
          const data = await fetchData("https://cressential-5435c63fb5d8.herokuapp.com/mysql/verification-table", {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          setData(data);
        } 
        else {
          const studentManagementData = await fetchData("https://cressential-5435c63fb5d8.herokuapp.com/mysql/student-management", {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          const student_id = studentManagementData ? studentManagementData.find((item) => item.user_id === user_id)?.id : "";
          // console.log("student_id: ", student_id);
  
          const verificationTableData = await fetchData(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/verification-student/${student_id}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          // console.log("fetchedData: ", verificationTableData);
          setData(verificationTableData);
        }
      } catch (error) {
        // Handle errors or provide user feedback
        console.error("Error:", error);
      }
    };
  
    fetchDataForUserRole();
  }, []);
  

  const columns = [
    { Header: "VerifID", accessor: "verif_id", align: "center"},
    { Header: "Identifiers", accessor: "rpr_id"},
    { Header: "Record Type", accessor: "record"},
    { Header: "Student Name", accessor: "student"},
    { Header: "Verifier Name", accessor: "verifier"},
    { Header: "Institution/Company", accessor: "institution"},
    { Header: "Status", accessor: "verification_status"},
    { Header: "Result", accessor: "result"},
    { Header: "Timestamp", accessor: "timestamp" },
  ];

  // =========== For Record =================
  const [rpr_data, setRprData] = useState([]);

  useEffect(() => {
    fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/verification/getData`, {
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
      .then((fetchedData) => {
        
        setRprData(fetchedData);

      })
      .catch((err) => console.log(err));
  }, []);

  
  function getRecordType(rpr_id) {

    const type = rpr_data ? rpr_data.find((item) => item.rpr_id == rpr_id)?.record_type : "";
    // console.log("type: ", type);
    return type;
  }  

  function getCtrlNumber(rpr_id) {
    // console.log("rpr data: ", rpr_data);
    const ctrl_number = rpr_data ? rpr_data.find((item) => item.rpr_id == rpr_id)?.control_number : "";
    return ctrl_number;
  }  
  
  function getStudentName(rpr_id) {
    const last_name = rpr_data ? rpr_data.find((item) => item.rpr_id == rpr_id)?.last_name : "";
    const middle_name = rpr_data ? rpr_data.find((item) => item.rpr_id == rpr_id)?.middle_name : "";
    const first_name = rpr_data ? rpr_data.find((item) => item.rpr_id == rpr_id)?.first_name : "";
    const middle_initial = middle_name ? middle_name[0]+"." : '';
    const fullname = rpr_data ? last_name + ", " + first_name + " " + middle_initial : "";
    return fullname;
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
                  Verification Table
                </MDTypography>
              </MDBox>              
                <MDBox p={3}>   
                
                  <DataTable table={{ columns, 
                    rows: data.map((item) => ({
                      verif_id: item.v_id,
                      
                      // rpr_id: item.record_per_request_id,
                      rpr_id: item.record_per_request_id ? (
                        <Link                           
                          to={`/record-per-request/${getCtrlNumber(item.record_per_request_id)}`} component={RouterLink} >
                          <Tooltip title="View Record" >
                            <MDBox lineHeight={1}>
                              <MDTypography variant="caption" >
                                Ctrl No: &nbsp;
                              </MDTypography>
                              <MDTypography variant="button" fontWeight="medium">
                                {getCtrlNumber(item.record_per_request_id)} <br/>
                              </MDTypography>
                              <MDTypography variant="caption">
                                RPR ID: &nbsp;
                              </MDTypography>
                              <MDTypography variant="button" fontWeight="medium">
                                {item.record_per_request_id} <br/>
                              </MDTypography>
                            </MDBox>
                          </Tooltip>
                        </Link>
                      ) : "",
                      record: item.record_per_request_id && rpr_data.length > 0
                      ? getRecordType(item.record_per_request_id)
                      : "",                      
                      student: item.record_per_request_id ? getStudentName(item.record_per_request_id) : "",
                      verifier: item.v_last_name + ", " + item.v_first_name + " " + (item.v_middle_name ? item.v_middle_name[0]+"." : ''),
                      institution: item.institution ? item.institution : "",
                      verification_status: (
                        <MDBox ml={-1}>
                          <MDBadge
                            badgeContent={item.is_success ? "Success" : "Failed"}
                            color={item.is_success ? "success" : "error"} // Set the badge color dynamically
                            variant="gradient"
                            size="sm"
                          />
                        </MDBox>
                      ),
                      result: item.verification_result ? item.verification_result : "",
                      timestamp: item.timestamp ? item.timestamp : "",

                    })), 
                  }} canSearch={true} />
                </MDBox>
              </Card>
            </Grid>
            
          </Grid>
        </MDBox>
      <Footer />
  </DashboardLayout>
  );
}

export default Verification_table;
