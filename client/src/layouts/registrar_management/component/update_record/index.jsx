import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate} from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import {
  FormControl,
  InputLabel,
  Select, MenuItem
} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import MDAlert from "../../../../components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../../examples/Footer";
import regeneratorRuntime from "regenerator-runtime";


function Update_Record() {
  const initialFormData = {
    lastName: '',
    firstName: '',
    middleName: '',
    studentNumber: '',
    walletAddress: '',
    college: 'CET',
    course: 'BSIT',
    entryYearFrom: '',
    entryYearTo: '',
    graduationDate: '',
    permanentAddress: '',
    mobileNumber: '',
    emailAddress: '',
    is_alumni: 0,
    status: ''
  };
  const [formData, setFormData] = useState({initialFormData});

  const location = useLocation();
  const state_userID = location.state?.user_id;
  const state_status = location.state?.status;

  const [data, setData] = useState([]);
  const jwtToken = localStorage.getItem('token');

    if (state_userID) {
      fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/registrar-management/${state_userID}`,{
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
          setData(data); // Set the fetched data into the state
          if (data.length > 0) {
            // Assuming you expect an array of data
            const item = data[0]; // Take the first item in the array
            

            setFormData((prevFormData) => ({
              ...prevFormData,
              lastName: item.last_name,
              firstName: item.first_name,
              middleName: item.middle_name,              
              walletAddress: item.wallet_address,   
              mobileNumber: item.mobile_number,
              emailAddress: item.email,             
              
            }));
          }
        })
        .catch((err) => console.log(err));
    }

  // =========== For the MDAlert =================
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );

  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    setIsSuccess(false);
    setIsError(false);
    try {
      const response = await fetch('http://localhost:8081/mysql/registrar-management/add-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setAlertMessage('Record added successfully.');
        setFormData(initialFormData);
      } else {
        setAlertMessage('Failed to update record');
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    }
   
  };
  const navigate = useNavigate();
  const goBack = () => {    
    navigate(-1);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
        <MDBox pt={6} pb={3}>          
          <Grid container spacing={6}>
            <Grid item xs={12}>
              {isSuccess && (
                <MDAlert color="success" dismissible sx={{marginBottom: '50px'}} onClose={() => setIsSuccess(false)}>
                      {alertContent("success", alertMessage)}
                </MDAlert>
              )}
              {isError && (
                <MDAlert color="error" dismissible sx={{marginBottom: '50px'}} onClose={() => setIsError(false)}>
                  {alertContent("error", alertMessage)}
                </MDAlert>
              )}
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
                  
                  <MDButton onClick={goBack} variant="gradient" color="dark">
                    <Icon>arrow_back</Icon>&nbsp; Back
                  </MDButton>
                </MDBox>
                <MDBox pt={4} pb={3} px={5}>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={7}>

                      {/* LEFT COLUMN */}                  
                      <Grid item lg={6} sm={12} >                        

                        <Grid container spacing={2}>
                          {/* STUDENT INFORMATION */}   
                          <Grid item xs={12} sx={{margin:"auto"}}>
                            <MDTypography fontWeight={"bold"}>Registrar Information</MDTypography>                         
                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2" >Last Name:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="text" value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required fullWidth/>
                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">First Name:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="text" value={formData.firstName} 
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value})} 
                            required fullWidth/>
                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">Middle Name:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="text" value={formData.middleName} 
                            onChange={(e) => setFormData({ ...formData, middleName: e.target.value})}
                            fullWidth/>
                          </Grid>                          
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">Wallet Address:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="text" value={formData.walletAddress} 
                            onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value})}
                            required fullWidth/>
                          </Grid>
                          
                        </Grid>
                    
                      </Grid>

                      {/* RIGHT COLUMN */}                  
                      <Grid item lg={6} sm={12} >      
                                  
                        <Grid container spacing={2}>                    

                          {/* CONTACT DETAILS */}
                          <Grid item xs={12} sx={{margin:"auto"}}>
                            <MDTypography mt={"5"} fontWeight={"bold"}>Contact Details</MDTypography>                         
                          </Grid>
                          
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">Mobile No:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="number" value={formData.mobileNumber} 
                            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value})}
                            required fullWidth
                            />
                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">Email Address:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="email" value={formData.emailAddress} 
                            onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value})}
                            required 
                            fullWidth/>
                          </Grid>
                          {/* END OF CONTACT DETAILS */}

                          {/* USER INFORMATION */}
                          <Grid item xs={12} >
                            <MDTypography mt={"5"} fontWeight={"bold"}>User Information</MDTypography>                         
                          </Grid>
                          
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">Account Status:</MDTypography>
                          </Grid>
                          <Grid item xs={9} mt={-2}>
                            <FormControl variant="outlined" fullWidth margin="normal">                           
                                <Select
                                style={{ height: "45px" }}
                                required  
                                displayEmpty
                                value={state_status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value})}                    
                                >                           
                                    <MenuItem value={"active"}> Active</MenuItem>
                                    <MenuItem value={"inactive"}> Inactive</MenuItem>
                                </Select>
                            </FormControl>
                          </Grid>
                          
                          {/* END OF USER INFO */}

                          <Grid item xs={6}></Grid>
                          <Grid item xs={6} sx={{marginTop:"10px"}} >
                              <MDButton variant="gradient" color="info" fullWidth type="submit">
                                <Icon>send</Icon> &nbsp; Update Record
                              </MDButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                </MDBox>
            
              
              </Card>
            </Grid>
            
          </Grid>
        </MDBox>
      <Footer />
  </DashboardLayout>
  );
}

export default Update_Record;
