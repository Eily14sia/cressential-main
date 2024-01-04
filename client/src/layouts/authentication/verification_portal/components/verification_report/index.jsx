// react-router-dom components
import { Link } from "react-router-dom";
import React, { useEffect, useState} from 'react';
import { useLocation } from "react-router-dom";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../../../components/MDBox";
import MDTypography from "../../../../../components/MDTypography";
import MDInput from "../../../../../components/MDInput";
import MDButton from "../../../../../components/MDButton";
import PDFViewer2 from '../../../../../layouts/render_pdf';

import '@react-pdf-viewer/core/lib/styles/index.css';

// Authentication layout components
import CoverLayout from "../../../components/ReportCoverLayout";

import GeneratePDF from '../generate_pdf';
import GeneratePDFIncorrect from '../generate_pdf_incorrect';

// Images
import bgImage from "../../../../../assets/images/university.jpg";
// Authentication pages components

function Verifier_portal() {

  const location = useLocation();

  const verificationID = location.state?.verificationID;
  const verifier = location.state?.verifier;
  const institution = location.state?.institution;
  const transaction_number = location.state?.transaction_hash;
  const password = location.state?.password;
  const filename = location.state?.filename;
  const studentName = location.state?.studentName;
  const recordType = location.state?.recordType;
  const isSuccess = location.state?.isSuccess;
  const status = location.state?.verifResult;
  const description = location.state?.description;
  const result_num = location.state?.result_num;
  console.log("result_num: ", result_num);
  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Record Verification Report
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            You can now download or print the record verification report.
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3} display="flex" justifyContent="center" alignItems="center">
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
        {(result_num == 2 || result_num == 3 ) ? (
          <GeneratePDF 
            transaction_number={transaction_number}
            password={password}
            filename={filename}
            studentName={studentName}
            recordType={recordType}
            isSuccess={isSuccess}
            status={status}
            description={description}
            verifier={verifier}
            institution={institution}
            verificationID={verificationID}
          />
        ) : (
          <GeneratePDFIncorrect
            transaction_number={transaction_number}
            password={password}
            filename={filename}
            studentName={studentName}
            recordType={recordType}
            isSuccess={isSuccess}
            status={status}
            description={description}
            verifier={verifier}
            institution={institution}
            verificationID={verificationID}
          />
        )}

          
        </Grid>
      </Grid>
    </MDBox>
       
      </Card>
    </CoverLayout>
  );
}

export default Verifier_portal;
