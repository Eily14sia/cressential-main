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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import PDFViewer2 from '../../../../layouts/render_pdf_sign';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import MDAlert from "../../../../components/MDAlert";

// Material Dashboard 2 React example components
import DataTable from "../../../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";
import DocumentSelection from "../document_selection";
import DialogBox from '../add_record_modal';

import { useMaterialUIController } from "../../../../context";

const index = ( {totalAmount, setTotalAmount, setActiveStep, cartItems, setCartItems, ctrl_number, setCtrlNumber}) => {

    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [data, setData] = useState([]);   
    const [selectedItemID, setSelectedItemID] = useState("");
    const [selectedPurpose, setSelectedPurpose] = useState('');
    const [purposeCollege, setPurposeCollege] = useState('');
  
      
    const [file, setFile] = useState('');
    const [url, setUrl] = useState(null);

    // =========== For the MDAlert =================
    const [alertMessage, setAlertMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
  
    const alertContent = (name) => (
      <MDTypography variant="body2" color="white">
        {alertMessage}
      </MDTypography>
    );
  
    // State to track whether the dialog is open
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const jwtToken = localStorage.getItem('token');  

  const handleFileChange = async (e) => {
    e.target.files.length > 0 && setUrl(URL.createObjectURL(e.target.files[0]));

    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      try {
        // Read the contents of the selected file
        const fileBuffer = await selectedFile.arrayBuffer();

        // Calculate the hash (multihash) of the file using SHA-256
        const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);

        // Convert the hash buffer to a hexadecimal string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

        // Set the calculated hash in state
      } catch (error) {
        console.error("Error calculating hash:", error);
        setHash(null);
      }
    } else {
      setUrl(null);
      setFile(null);
    }
  };

  const CustomSmallCircleIcon  = () => (
    <svg width="8" height="8" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="3" fill="none" stroke="#1A73E8" strokeWidth="2" />
    </svg>
  );

  return (
    <>
        <MDBox pt={2} py={5} px={3}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item textAlign="center" xs={12} lg={8} sx={{borderRadius: '5px'}}>             
                
                  {/* {pdfUrl && <PDFViewer2 />} */}
                  
                  {url ? (
                      <div
                          style={{
                              border: '1px solid rgba(0, 0, 0, 0.3)',
                          }}
                      >
                          {/* <Viewer fileUrl={url} /> */}
                          <PDFViewer2 fileUrl={url}/>
                      </div>
                  ) : (
                      <div
                          style={{
                              alignItems: 'center',
                              border: '2px dashed rgba(0, 0, 0, .3)',
                              display: 'flex',
                              fontSize: '2rem',
                              height: '100%',
                              justifyContent: 'center',
                              width: '100%',
                          }}
                      >
                          Preview area
                      </div>
                  )}       
              
            </Grid>
            <Grid item xs={12} lg={4} sx={{borderRadius: '5px'}}>         

               
              <MDInput fullWidth variant="outlined" 
                type="file"
                id="fileUpload"
                accept=".pdf"
                mx={2}
                onChange={handleFileChange}
              />   

              <MDBox display="flex" alignItems="center" mt={2} pt={2}>
                <CustomSmallCircleIcon />
                <MDTypography variant="h6" sx={{paddingLeft: "15px"}}>Important:</MDTypography>
              </MDBox>
              <MDBox display="flex"   >
                <MDTypography variant="caption" ml={3} mt={1}>
                  Please ensure that the correct PDF file is uploaded. This only accepts PDF File Format.
                </MDTypography>                  
              </MDBox>
              <MDBox display="flex" alignItems="center" mt={1} pt={2}>
                <CustomSmallCircleIcon />
                <MDTypography variant="h6" sx={{paddingLeft: "15px"}}>How this works:</MDTypography>
              </MDBox>
              <MDBox display="flex"   >
                <MDTypography variant="caption" ml={3} my={1}>
                  Using the React PDF Viewer, click the area where you wish the registrar to sign in your document. Then wait for the signature field coordinates to reflect below. Finally, click the 'Submit Signature' button. 
                </MDTypography>                  
              </MDBox>  
            
            <MDButton sx={{marginTop: "20px"}} variant="gradient" color="dark" fullWidth>Submit Signature</MDButton>   
            
              
              
            </Grid>
          </Grid>
        </MDBox>
    </>
  )
}

export default index