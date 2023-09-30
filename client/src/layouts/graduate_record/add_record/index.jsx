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

import axios from 'axios';

function Graduate_Add_Record() {
  // const { columns, rows } = authorsTableData();
  // const { columns: pColumns, rows: pRows } = projectsTableData();

  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedCID, setUploadedCID] = useState(null);
  const [multihash, setMultihash] = useState(null); // Added state for multihash

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setUploadedCID(null); // Clear the uploaded CID
    setErrorMessage('');
    setMultihash(null); // Clear the multihash
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post('http://localhost:8081/files/api/maindec', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.encrypted) {
          // File is encrypted, proceed with the upload
          setUploadedCID(response.data.cid);
          setMultihash(response.data.multihash); // Set the multihash

          // Reset the selectedFile state to clear the file input
          setSelectedFile(null);
        } else {
          // File is not encrypted, display an error message
          setErrorMessage('Only encrypted files are allowed.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setErrorMessage('Error uploading file. Please try again.');
      }
    } else {
      // If no file is selected, display an error message
      setErrorMessage('Please choose an encrypted PDF file first.');
    }
  };


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
              {/* <MDBox mb={2}>
                <MDInput fullWidth
                    type="file"
                    id="fileUpload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    // Add more props as needed
                  />              </MDBox> */}

              <MDBox mb={2}>
                <input fullWidth
                  type="file"
                  id="fileUpload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <div>
                  <MDButton onClick={() => document.getElementById('fileUpload').click()}>Select File</MDButton>
                  {selectedFile && <span>{selectedFile.name}</span>}
                </div>
              </MDBox>

              <MDBox mt={4} mb={1}>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link to="/graduate-record/add-record" component={RouterLink}>
                      <MDButton variant="gradient" color="info" type="submit" onClick={handleFileUpload}>
                        Submit&nbsp;
                        <Icon>add</Icon>
                      </MDButton>
                      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                      {uploadedCID && (
                      <div>
                        <p>File uploaded successfully to IPFS.</p>
                        <p>CID: {uploadedCID}</p>
                        <p>Multihash: {multihash}</p> {/* Display the multihash */}
                        <p>
                          View the file on IPFS:
                          <a target="_blank" rel="noopener noreferrer" href={`https://ipfs.io/ipfs/${uploadedCID}`}>
                          https://dweb.link/ipfs/{uploadedCID}
                          </a>
                        </p>
                      </div>
                    )}
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
