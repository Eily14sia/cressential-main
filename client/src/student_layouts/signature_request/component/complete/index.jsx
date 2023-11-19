import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate} from "react-router-dom";
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
import CustomInfoCard from '../../../../examples/Cards/InfoCards/CustomInfoCard';

import illustration from "../../../../assets/images/illustrations/business-task-list.svg"

import axios from 'axios';

const index = () => {


  return (
    <>
        <MDBox pt={2} pb={3} px={5}>
            <Grid container spacing={4} justifyContent="center">

              {/* LEFT COLUMN */}                  
              <Grid item lg={7} textsm={12}>     

                  {/* Payment Method */}
                  <MDBox   
                  p={3}
                  mb={1}
                 
                  >
                  <Grid container spacing={2} justifyContent="center" alignItems="center">                    
                      <Grid item xs={12} sx={{marginBottom:"10px", textAlign: "center"}}>
                        <img src={illustration} alt="illustration" style={{
                          width: "250px",
                          height: "auto", 
                        }}/>
                        </Grid>
                        <Grid item xs={10} sx={{marginBottom:"10px", textAlign: "center"}}>
                          <MDTypography variant="h2" color="info" textGradient >Request Completed!</MDTypography>     
                          <MDTypography variant="body2" mt={3}>
                          Your request has been submitted. Please wait for the payment to be reflected in the request table.
                          </MDTypography>           
                        </Grid>   
                        <Grid item xs={8} sx={{marginTop:"20px", marginBottom:"20px", textAlign: "center"}} >
                          <Link to="/student-request-table" component={RouterLink} >
                            <MDButton variant="gradient" color="info" size="large" fullWidth >
                                <Icon>done</Icon> &nbsp; Done 
                            </MDButton>
                          </Link>

                      </Grid>        
                                      
                     
                  </Grid>
                  </MDBox>
              
      
                      
              </Grid>
            </Grid>
        </MDBox>
    </>
  )
}

export default index