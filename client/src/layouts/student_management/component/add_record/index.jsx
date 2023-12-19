import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
import FormHelperText from '@mui/material/FormHelperText';

function Add_Record() {
  const jwtToken = localStorage.getItem('token');
  
  // =========== For the MDAlert =================
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );

  const initialFormData = {
    lastName: '',
    firstName: '',
    middleName: '',
    studentNumber: '',
    walletAddress: '',
    college: '',
    course: '',
    entryYearFrom: '',
    entryYearTo: '',
    graduationDate: '',
    permanentAddress: '',
    mobileNumber: '',
    emailAddress: '',
  };
  const [formData, setFormData] = useState({initialFormData});

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    setIsSuccess(false);
    setIsError(false);

    if (!studentNumberUnique) {
      setAlertMessage('Student number already exist.');
      setIsError(true);
      return;
    }
    if (!walletAddressUnique) {
      setAlertMessage('Wallet Address already exist.');
      setIsError(true);
      return;
    }
    if (!emailUnique) {
      setAlertMessage('Email already exist.');
      setIsError(true);
      return;
    }
    if (!mobileNumberUnique) {
      setAlertMessage('Mobile Number already exist.');
      setIsError(true);
      return;
    }

    try {
      const response = await fetch('https://cressential-5435c63fb5d8.herokuapp.com/student-management/add-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
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

  const [data, setData] = useState([]);
  const [studentNumberUnique, setStudentNumberUnique] = useState(true);
  const [walletAddressUnique, setWalletAddressUnique] = useState(true);
  const [emailUnique, setEmailUnique] = useState(true);
  const [mobileNumberUnique, setMobileNumberUnique] = useState(true);


  useEffect(() => {
    fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/student-management`, {
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
  

  const isStudentNumberUnique = (studentNumber) => {
    console.log('Checking uniqueness for student number:', studentNumber);
  
    for (const student of data) {
      console.log('Comparing with existing student number:', student.student_number);
  
      if (student.student_number == studentNumber) {
        console.log('Duplicate student number found:', studentNumber);
        return false;
      }
    }
  
    console.log('No duplicate found for student number:', studentNumber);
    return true;
  };

  const isWalletAddressUnique = (walletAddress) => {
    console.log('Checking uniqueness for student number:', walletAddress);
  
    for (const student of data) {
      console.log('Comparing with existing student number:', student.wallet_address);
  
      if (student.wallet_address.toLowerCase() === walletAddress.toLowerCase()) {
        console.log('Duplicate student number found:', walletAddress);
        return false;
      }
    }
  
    console.log('No duplicate found for student number:', walletAddress);
    return true;
  };
  const isEmailUnique = (email) => {
    console.log('Checking uniqueness for email:', email);
  
    for (const student of data) {
      console.log('Comparing with existing email:', student.email);
  
      if (student.email.toLowerCase() === email.toLowerCase()) {
        console.log('Duplicate email found:', email);
        return false;
      }
    }
  
    console.log('No duplicate found for email:', email);
    return true;
  };

  const isMobileNumberUnique = (number) => {
    console.log('Checking uniqueness for mobile number:', number);
  
    for (const student of data) {
      console.log('Comparing with existing mobile number:', student.mobile_number);
  
      if (parseInt(student.mobile_number) === parseInt(number)) {
        console.log('Duplicate mobile number found:', number);
        return false;
      }
    }
  
    console.log('No duplicate found for email:', number);
    return true;
  };

  const handleChangeStudentNumber = async (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, studentNumber: value });
    const unique = await isStudentNumberUnique(value);
    setStudentNumberUnique(unique);
    console.log("is unique:", unique);
  };

  const handleChangeWalletAddress = async (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, walletAddress: value });
    const unique = await isWalletAddressUnique(value);
    setWalletAddressUnique(unique);
    console.log("is wallet address unique:", unique);
  };
  const handleChangeEmail = async (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, emailAddress: value });
    const unique = await isEmailUnique(value);
    setEmailUnique(unique);
    console.log("is email unique:", unique);
  };
  const handleChangeMobileNumber = async (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, mobileNumber: value });
    const unique = await isMobileNumberUnique(value);
    setMobileNumberUnique(unique);
    console.log("is email unique:", unique);
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
                            <MDTypography fontWeight={"bold"}>Student Information</MDTypography>                         
                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2" >Last Name:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="text" maxLength="100" value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required label="Enter Last Name" fullWidth/>
                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">First Name:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="text" maxLength="100" value={formData.firstName} 
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value})} 
                            required label="Enter First Name" fullWidth/>
                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">Middle Name:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="text" maxLength="100" value={formData.middleName} 
                            onChange={(e) => setFormData({ ...formData, middleName: e.target.value})}
                            label="Enter Middle Name" fullWidth/>
                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">Student No:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="number" name="studentNumber" value={formData.studentNumber} 
                            onChange={handleChangeStudentNumber}
                            required label="Enter Student Number" 
                            error={!studentNumberUnique}
                            fullWidth/>
                            <MDBox sx={{ textAlign: "left" }}>
                              {!studentNumberUnique && (
                              <FormHelperText error>
                                * Entered student number already exist.
                              </FormHelperText>
                              )}
                            </MDBox>
                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">Wallet Address:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="text" value={formData.walletAddress} name="walletAddress"
                            onChange={handleChangeWalletAddress}
                            error={!walletAddressUnique}
                            minLength="42" 
                            required label="Enter wallet address" fullWidth/>
                            <MDBox sx={{ textAlign: "left" }}>
                              {!walletAddressUnique && (
                              <FormHelperText error>
                                * Entered wallet address already exist.
                              </FormHelperText>
                              )}
                            </MDBox>

                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">College:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <FormControl variant="outlined" fullWidth margin="normal">
                                <InputLabel>Select an option</InputLabel>
                                <Select
                                style={{ height: "50px" }}
                                label="Select an option"  required  
                                value={formData.college} 
                                onChange={(e) => setFormData({ ...formData, college: e.target.value})}                        
                                >                            
                                    <MenuItem value="CET"> CET</MenuItem>
                                    <MenuItem value="CE"> CE</MenuItem>
                                    <MenuItem value="CHASS"> CHASS</MenuItem>
                                    <MenuItem value="CAUP"> CAUP</MenuItem>
                                    <MenuItem value="CS"> CS</MenuItem>
                                    <MenuItem value="CN"> CN</MenuItem>
                                </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">Course:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                          <FormControl variant="outlined" fullWidth margin="normal">
                                <InputLabel>Select an option</InputLabel>
                                <Select
                                style={{ height: "50px" }}
                                label="Select an option"   required  
                                value={formData.course} 
                                onChange={(e) => setFormData({ ...formData, course: e.target.value})}                    
                                >                            
                                    <MenuItem value="BSIT"> BSIT</MenuItem>
                                    <MenuItem value="BECEd"> BECEd</MenuItem>
                                    <MenuItem value="CHASS"> CHASS</MenuItem>
                                    <MenuItem value="BAC"> BAC</MenuItem>
                                    <MenuItem value="BSBio"> BSBio</MenuItem>
                                    <MenuItem value="BSN"> BSN</MenuItem>
                                </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={4} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">Entry Year:</MDTypography>
                          </Grid>
                          <Grid item xs={4} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">From:</MDTypography>
                          </Grid>
                          <Grid item xs={4} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">To:</MDTypography>
                          </Grid>
                          <Grid item xs={3}></Grid>
                          <Grid item xs={4}>
                            <MDInput
                              value={formData.entryYearFrom}
                              onChange={(e) =>
                                setFormData({ ...formData, entryYearFrom: e.target.value })
                              }
                              type="text"  // Use type "text" instead of "date"
                              inputMode="numeric"  // Set input mode to "numeric"
                              pattern="\d{4}"  // Use a pattern to accept four numeric digits
                              placeholder="YYYY"  // Optionally, provide a placeholder for clarity
                              fullWidth
                            />                          
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput value={formData.entryYearTo} 
                            onChange={(e) => setFormData({ ...formData, entryYearTo: e.target.value})}
                            type="text"  // Use type "text" instead of "date"
                            inputMode="numeric"  // Set input mode to "numeric"
                            pattern="\d{4}"  // Use a pattern to accept four numeric digits
                            placeholder="YYYY"  // Optionally, provide a placeholder for clarity
                            fullWidth/>
                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">Date of Graduation</MDTypography>
                            <MDTypography variant="caption">(If applicable)</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput value={formData.graduationDate} 
                            onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value})}type="date" fullWidth/>
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
                            <MDTypography variant="body2">Permanent Address:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="text" required 
                            value={formData.permanentAddress} 
                            onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value})}
                            multiline rows={2}  label="Enter Permanent Address" fullWidth/>
                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">Mobile No:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="number" value={formData.mobileNumber} 
                            onChange={handleChangeMobileNumber}
                            error={!mobileNumberUnique}
                            required label="Enter Mobile Number" fullWidth
                            />
                            <MDBox sx={{ textAlign: "left" }}>
                              {!mobileNumberUnique && (
                              <FormHelperText error>
                                * Entered mobile number already exist.
                            </FormHelperText>
                              )}
                            </MDBox>
                          </Grid>
                          <Grid item xs={3} sx={{margin:"auto"}}>
                            <MDTypography variant="body2">Email Address:</MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput type="email" value={formData.emailAddress} 
                            onChange={handleChangeEmail}
                            required label="Enter Email Address" 
                            error={!emailUnique}
                            fullWidth/>
                            <MDBox sx={{ textAlign: "left" }}>
                              {!emailUnique && (
                              <FormHelperText error>
                                * Entered email already exist.
                              </FormHelperText>
                              )}
                            </MDBox>
                          </Grid>
                          {/* END OF CONTACT DETAILS */}
                          <Grid item xs={7}></Grid>
                          <Grid item xs={5} sx={{marginTop:"10px"}} >
                              <MDButton variant="gradient" color="info" fullWidth type="submit">
                                <Icon>send</Icon> &nbsp;Submit
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

export default Add_Record;
