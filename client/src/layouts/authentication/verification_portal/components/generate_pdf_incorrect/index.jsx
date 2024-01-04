import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";

import logoDark from "../../../../../assets/images/logo_header3.png";
import logo from "../../../../../assets/images/logo_low.png";
import title from "../../../../../assets/images/verification_report.png";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "white",
    position: "relative",
  },
  section: {
    margin: 18,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: 20,
    textAlign: "center",
  },
  title: {
    width: 350,
    height: 40
  },
  content: {
    fontSize: 11,
    marginRight: 30,
    marginLeft: 30,
    marginTop: 15,
  },
  viewer: {
    width: '100%',
    height: 600,
  },
  logo: {
    width: 150,
    height: 120
  },
  footerNote: {
    position: "absolute",
    bottom: 7,
    left: 20,
    right: 20,
    fontSize: 8,
  },
  backgroundImage: {
    width: 350,
    height: 350,
    position: "absolute",
    top: "20%",
    left: "14%",
    zIndex: -1,
    opacity: 0.1,
  },
  table: { 
    marginRight: 30,
    marginLeft: 30,
    marginTop: 10, 
    display: "table", 
    width: "auto", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0 
  }, 
  tableRowHeader: { 
      margin: "auto", 
      flexDirection: "row",
      backgroundColor: "#174A9B",
      color: "#FFFFFF"
  }, 
  tableRow: { 
      margin: "auto", 
      flexDirection: "row",
  },
  tableCol: { 
      width: "50%", 
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0 
  }, 
  tableCell: { 
      paddingRight: 5,
      paddingLeft: 5,
      paddingBottom: 3,
      marginTop: 5, 
      fontSize: 11 
  }
});

// Create Document Component
function BasicDocument({
  transaction_number, password, studentName, recordType, status, isSuccess, description, verifier, institution, verificationID
}) {

// Split the transaction number into segments (e.g., every 16 characters)
const segments_tx_number = transaction_number ? transaction_number.match(/.{1,38}/g) || [] : [];

const date_today = new Date();
const verification_date = date_today.toLocaleString('en-US', { timeZone: 'Asia/Manila' });

  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document>
        {/* Render a single page */}
        <Page size="A4" style={styles.page}>
          <View style={styles.backgroundImage}>
              <Image src={logo} style={styles.backgroundImage} />
          </View>
          <View style={styles.section}>
            <Text style={styles.header}>
              <Image src={logoDark} style={styles.logo} />
            </Text>
            <Text style={styles.header}>
              <Image src={title} style={styles.title} />
            </Text>
            <Text style={styles.content}>
             Despite meticulous validation attempts within our advanced blockchain-based issuance and verification system tailored for academic records, the verification process encountered issues, leading to unsuccessful validation. Below is a detailed report of the encountered conditions:            
            </Text>
            
            <Text style={styles.content}>
                Verifier Information:
            </Text>
            <View style={styles.table}> 
              {/* TableHeader */} 
                <View style={styles.tableRowHeader}> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>ATTRIBUTES</Text> 
                    </View> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>DETAILS</Text> 
                    </View> 
                    
                </View> 
              {/* TableContent */} 
                <View style={styles.tableRow}> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>Verifier Name</Text> 
                    </View> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>{verifier ? verifier : ''} </Text> 
                    </View>                     
                </View> 
                <View style={styles.tableRow}> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>Institution/Company Name</Text> 
                    </View> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>{institution ? institution : ''} </Text> 
                    </View>                     
                </View>                
                
            </View>

            <Text style={styles.content}>
                Verification Summary:
            </Text>
            <View style={styles.table}> 
              {/* TableHeader */} 
                <View style={styles.tableRowHeader}> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>ATTRIBUTES</Text> 
                    </View> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>DETAILS</Text> 
                    </View> 
                    
                </View> 
              {/* TableContent */} 
                <View style={styles.tableRow}> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>Verification ID</Text> 
                    </View> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>{verificationID ? verificationID : ''} </Text> 
                    </View>                     
                </View> 
                
                <View style={styles.tableRow}> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>Verification Status</Text> 
                    </View> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>Unsuccessful </Text> 
                    </View>                     
                </View> 
                <View style={styles.tableRow}> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>Verification Result</Text> 
                    </View> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>{status ? status : ''} </Text> 
                    </View>                     
                </View> 
                <View style={styles.tableRow}> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>Verification Description</Text> 
                    </View> 
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{description ? description : ''}</Text>
                    </View>           
                </View> 
                <View style={styles.tableRow}> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>Date and Time of Verification</Text> 
                    </View> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>{verification_date} </Text> 
                    </View>                     
                </View> 
            </View>
            
           
            <Text style={styles.content}>
            The authorized verifier is hereby granted permission to download the verification report for their records.            
            </Text>
            
            <Text style={styles.content}>
            Should any discrepancies be identified, kindly reach out to the issuing institution promptly to invalidate the original document, and subsequent legal measures will be pursued.            </Text>
            <Text style={styles.content}>
            This report adheres to the stringent policies and procedures integral to our academic record validation system. For further inquiries or assistance, please reach out to our dedicated support team.            </Text>
            
            <Text style={styles.footerNote}>
            The immutability and transparency inherent in blockchain technology, coupled with the use of smart contracts, contribute to a robust and trustworthy academic record verification system. The entire process is designed to maintain the integrity of academic records, providing confidence in the authenticity of the validated information.            </Text>
            
            
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
export default BasicDocument;
