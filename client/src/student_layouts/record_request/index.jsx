import * as React from 'react';
import { useEffect, useState } from 'react';
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

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Divider from "@mui/material/Divider";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDInput from "../../components/MDInput";
import MDBadge from "../../components/MDBadge";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";
import DocumentSelection from "./document_selection";

function Record_request() {

  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8081/mysql/type-of-record")
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the fetched data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  const steps = [
    'Request Form',
    'Payment',
    'Submit',
  ];

  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const addDocument = () => {
    setSelectedDocuments([...selectedDocuments, {}]); // Add a new document to the selectedDocuments array
  };

  // Initialize with an initial document when the component mounts
  useEffect(() => {
    addDocument();
  }, []); // Run this effect only once when the component mounts


  // Callback function to update the selected item and price
  const updateSelectedItem = (index, item) => {
    const updatedSelectedDocuments = [...selectedDocuments];
    updatedSelectedDocuments[index] = { ...updatedSelectedDocuments[index], ...item };
    setSelectedDocuments(updatedSelectedDocuments);
  };

  // Callback function to update the number of copies
  const updateNumOfCopies = (index, numOfCopies) => {
    const updatedSelectedDocuments = [...selectedDocuments];
    updatedSelectedDocuments[index].numOfCopies = numOfCopies;
    setSelectedDocuments(updatedSelectedDocuments);
  };

  // Callback function to update the total amount
  const updateTotalAmount = (newTotalAmount) => {
    setTotalAmount(newTotalAmount);
  };
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
        <MDBox pt={6} pb={3}>          
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>              
              <MDBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="success"
                mx={2}
                mt={-3}
                mb={1}
                textAlign="center"
              >
                <Stepper activeStep={0} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </MDBox>
              <MDBox pt={4} pb={3} px={5}>
                <Grid container spacing={5}>
                  {/* Applicant Information */}
                  
                  <Grid item xs={6}>                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sx={{margin:"auto"}}>
                        <MDTypography fontWeight={"bold"}>Applicant Information</MDTypography>                         
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">Last Name:</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="text" disabled label="Enter your Last Name" fullWidth/>
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">First Name:</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="text" disabled label="Enter your First Name" fullWidth/>
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">Middle Name:</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="text" disabled label="Enter your Middle Name" fullWidth/>
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">Student No:</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="text" disabled label="Enter your Student Number" fullWidth/>
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">College:</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="text" fullWidth/>
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">Course:</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="text" fullWidth/>
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
                        <MDInput type="date" fullWidth/>
                      </Grid>
                      <Grid item xs={4}>
                        <MDInput type="date" fullWidth/>
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">Date of Graduation</MDTypography>
                        <MDTypography variant="caption">(If applicable)</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="date" fullWidth/>
                      </Grid>


                      <Grid item xs={12} sx={{marginTop:"20px"}}>
                        <MDTypography fontWeight={"bold"}>Purpose</MDTypography>                         
                      </Grid>
                      <Grid item xs={12} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">A. Transcript of Records (TOR):</MDTypography>
                      </Grid>
                      <Grid item xs={12} sx={{margin:"auto"}}>
                        <FormGroup sx={{marginLeft:"30px"}}>
                          <FormControlLabel control={<Checkbox defaultChecked />} label="1. Evaluation" />
                          <FormControlLabel control={<Checkbox />} label="2. Employment/Promotion" />
                          <FormControlLabel control={<Checkbox />} label="3. For further studies (Specify the college/university)" />
                        <MDInput type="text" variant="standard" label="Please specify" fullWidth/>
                        </FormGroup>
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">B. Others:</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="text" variant="standard" label="Please specify" fullWidth/>
                      </Grid>
                     

                      <Grid item xs={12} sx={{marginTop:"20px"}}>
                        <MDTypography mt={"5"} fontWeight={"bold"}>Contact Details</MDTypography>                         
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">Permanent Address:</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="text" multiline rows={2}  label="Enter your Permanent Address" fullWidth/>
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">Mobile No:</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="number" label="Enter your Mobile Number" fullWidth/>
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">Email Address:</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="email" label="Enter your Email Address" fullWidth/>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Request for */}
                  <Grid item xs={6}>                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sx={{margin:"auto"}}>
                        <MDTypography fontWeight={"bold"}>Request For:</MDTypography>                         
                      </Grid>

                      {/* <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">Document:</MDTypography>
                      </Grid>
                      <Grid item xs={9} sx={{margin:"auto"}}>
                        <FormControl variant="outlined" fullWidth margin="normal">
                          <InputLabel>Select an option</InputLabel>
                          <Select
                            style={{ height: "50px" }}
                            label="Select an option"
                            value={selectedItem} // Set the selected value
                            onChange={(event) => {
                              const selectedItemValue = event.target.value;
                              setSelectedItem(selectedItemValue);

                              // Find the corresponding item and set the price
                              const selectedPrice = data.find((item) => item.type === selectedItemValue)?.price;
                              setSelectedItemPrice(selectedPrice || ""); // Set the price or an empty string if not found
                              setTotalAmount(selectedPrice * numOfCopies || 0); // Set the price or an empty string if not found
                            }}
                          >
                            {data.map((item) => (
                              <MenuItem key={item.id} value={item.type}>
                                {item.type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">Price (Php):</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="number" disabled value={selectedItemPrice} fullWidth/>
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2" >No. of Copies:</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="number" value={numOfCopies} label="Enter Number of Copies" fullWidth
                        onChange={(event) => {
                          const value = event.target.value;
                          setNumOfCopies(value);
                          // Calculate the new total amount based on the selected item's price and the number of copies
                          const newTotalAmount = value * (parseFloat(selectedItemPrice) || 0); // Ensure selectedItemPrice is parsed as a float or use 0 if it's not valid
                          setTotalAmount(newTotalAmount);
                        }}
                        />
                      </Grid> */}                      
                        {selectedDocuments.map((_, index) => (
                              <DocumentSelection key={index} data={data} updateTotalAmount={updateTotalAmount}
                                updateSelectedItem={updateSelectedItem}
                                updateNumOfCopies={updateNumOfCopies}
                              />
                            ))}                                                   
                      <Grid item xs={7} >
                      </Grid>
                      <Grid item xs={5} style={{ textAlign: 'right' }} >
                        <MDButton style={{ padding:'5px' }} onClick={addDocument}>+ Another Request</MDButton>
                      </Grid>
                      <Grid item xs={3} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">Total Amount:</MDTypography>
                      </Grid>
                      <Grid item xs={9}>
                        <MDInput type="number" value={totalAmount} fullWidth/>
                      </Grid>
                      {/* <MDBox component="form" role="form">
                        <MDBox mb={2}>
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
                          <MDInput type="text" label="Input" fullWidth />
                        </MDBox>
                        <MDBox mb={4}>
                          <MDInput type="password" label="Input" fullWidth />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput fullWidth 
                                type="file"
                                accept=".jpg, .png, .jpeg"
                                // Add more props as needed
                              />              
                        </MDBox>                    
                      </MDBox> */}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={6} justifyContent="flex-end">
                  <Grid item xs={2}>
                    <MDBox mt={4} mb={1}>
                      <MDButton variant="gradient" color="info" fullWidth>
                        Next
                      </MDButton>
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            
              
              </Card>
            </Grid>
            
          </Grid>
        </MDBox>
      <Footer />
  </DashboardLayout>
  );
}

export default Record_request;
