import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams  } from "react-router-dom";
import { Link } from "@mui/material";

import {
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
  } from '@mui/material';
  import CloseIcon from '@mui/icons-material/Close';
  import Icon from "@mui/material/Icon";
  import Divider from "@mui/material/Divider";
  import CircularProgress from '../../../../examples/CircularProgress';
  
  // Material Dashboard 2 React components
  import MDBox from "../../../../components/MDBox";
  import MDButton from "../../../../components/MDButton";
  import MDInput from "../../../../components/MDInput";
  import MDTypography from '../../../../components/MDTypography';
  import MDAvatar from '../../../../components/MDAvatar';

const index = ({student_id,  setStudentEmail}) => {
    const [data, setData] = useState([]); // Initialize data as an empty array
    const [applicantInfo, setApplicantInfo] = useState(null);
    const jwtToken = localStorage.getItem('token');
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
        .then((fetchedData) => {
          setData(fetchedData);
        })
        .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
    // Check if data has been loaded before finding the applicant_info
    if (data.length > 0) {
      const foundApplicantInfo  = data.find((item) => item.id == student_id);     
      setApplicantInfo(foundApplicantInfo ); // Set the applicant_info state   

      if (foundApplicantInfo && foundApplicantInfo.email) {
        setStudentEmail(foundApplicantInfo.email);
      }
    }
  }, [data, student_id]);  

  // Check if applicantInfo is available before accessing its properties
  if (!applicantInfo) {
    const loading = (
      <Card sx={{marginTop: "20px"}}>
        <MDBox pt={2} px={2} display="block" justifyContent="space-between" alignItems="center" sx={{paddingBottom: "50px"}}>              
          <MDTypography variant="h6" fontWeight="medium" mb={5}>
            Applicant Information 
          </MDTypography>
          <CircularProgress/>
        </MDBox>
      </Card>
    );
    return loading;
  }
  

const walletAddress = applicantInfo.wallet_address || "N/A";
const formattedWalletAddress =
  walletAddress.length > 10
    ? `${walletAddress.slice(0, 7)}...${walletAddress.slice(-5)}`
    : walletAddress;

 
  const fullName = `${applicantInfo.first_name} ${applicantInfo.last_name}`;
  return (
    <>
        <Card sx={{marginTop: "20px"}}>
            <MDBox pt={2} px={2} display="block" justifyContent="space-between" alignItems="center">              
                <MDTypography variant="h6" fontWeight="medium">
                Applicant Information 
                </MDTypography>
            </MDBox>
              <MDBox p={2}>
                  <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                  <MDTypography variant="caption">Name: </MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">{fullName}</MDTypography>
                  
                  <MDTypography variant="caption" mt={2}>Student Number: </MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">{applicantInfo.student_number}</MDTypography>

                  <MDTypography variant="caption" mt={2}>College:</MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">{applicantInfo.college}</MDTypography>

                  <MDTypography variant="caption" mt={2}>Course: </MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">{applicantInfo.course}</MDTypography>

                  <MDTypography variant="caption" mt={2}>Entry Year:</MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">{applicantInfo.entry_year_from + " - " + applicantInfo.entry_year_to}</MDTypography>

                  <MDTypography variant="caption" mt={2}>Date of Graduation: </MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">
                    {applicantInfo.date_of_graduation ? new Date(applicantInfo.date_of_graduation).toLocaleDateString() : "----"}
                  </MDTypography>
                  
                  <Divider />
                  <MDTypography variant="h6" fontWeight="medium">
                  Contact Information
                  </MDTypography>
                  <MDTypography variant="caption" mt={2}>Wallet Address: </MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">{applicantInfo.wallet_address ? formattedWalletAddress : "N/A"}</MDTypography>

                  <MDTypography variant="caption" mt={2}>Email: </MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">{applicantInfo.email ? applicantInfo.email : "N/A"}</MDTypography>
                  
                  <MDTypography variant="caption" mt={2}>Mobile Number: </MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">{applicantInfo.mobile_number ? applicantInfo.mobile_number : "N/A"}</MDTypography>

                  <MDTypography variant="caption" mt={2}>Permanent Address: </MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">{applicantInfo.permanent_address ? applicantInfo.permanent_address : "N/A"}</MDTypography>

                  </MDBox>
              </MDBox>
            
        </Card>
    </>
  )
}

export default index