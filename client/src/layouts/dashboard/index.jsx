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

// @mui material components
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from 'react';

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ReportsBarChart from "../../examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "./data/reportsBarChartData";
import reportsLineChartData from "./data/reportsLineChartData";

// Dashboard components
import RecentRequest from "./components/recent_record_request";
import RecentIssuance from "./components/recent_issued_record";
import axios from 'axios';

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [data, setData] = useState([]);
  const [user_data, setUserData] = useState([]);
  const jwtToken = localStorage.getItem('token');

     /* ================= Emails ===================== */

  // ================ For the Data =======================
  const [request_data, setRequestData] = useState([]);
  const [issuance_data, setIssuanceData] = useState([]);
  const [student_data, setStudentData] = useState([]);
  const [type_of_record, setTypeOfRecord] = useState([]);

  useEffect(() => {
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/email/record-request", {
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
        setRequestData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/email/record-issuance", {
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
        setIssuanceData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/student-management", {
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
        setStudentData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/type-of-record", {
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
        setTypeOfRecord(data);
      })
      .catch((err) => console.log(err));
  }, []);

  function getStudentEmail(student_id) {  
    const email = student_data.find((item) => item.id == student_id).email;
    return email;
  }

  function getRecordType(type_id) {  
    const type = type_of_record.find((item) => item.id == type_id).type;
    return type;
  }
    
  const sendReminderEmail = async (toEmail, ctrlNumber, totalAmount) => {

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const formattedDate = tomorrow.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const emailData = {
      to: toEmail,
      subject: 'Urgent: Payment Deadline Tomorrow for Your Record Request',
      text: `
      Good day!
  
      This is to remind you that your pending record request payment is due by tomorrow at 12:00 AM.
  
      Failure to make the payment by the specified deadline will result in the automatic cancellation of your request.
  
        • Record Request: Ctrl-${ctrlNumber}
        • Payment Deadline: ${formattedDate}, 12:00 AM
        • Payment Amount: Php ${totalAmount}.00
        • Payment Method: GCash/Maya/Online Banking
  
      To complete your payment, please follow these steps:

        1. Log in to our system: https://cressential-5435c63fb5d8.herokuapp.com
        2. Navigate to the "Request Table" section.
        3. Select your record request and click the "Pay now" Button.
        4. Proceed with the payment process.
  
      If you have already made the payment, please disregard this message. For any questions or assistance with your payment, please contact our office.
  
      Thank you for your prompt attention to this matter.
  
      Sincerely,
      Registrar's Office
      `,
    };
  
    try {
      const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/emails/send-email', emailData);
      if (response.status === 200) {
        console.log('Email sent successfully.');

        try {
          const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/payment/update-record/notify/${ctrlNumber}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`,
            },   
          });
         
        
          if (response.status === 200) {
            console.log('Successfully updated the payment:', response.data);
            // Handle success here
          } else {
            console.error('Error:', response.statusText);
            // Handle error here
          }
        } catch (error) {
          console.error('An error occurred:', error);
          // Handle the error
        }

      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  const sendCancelationEmail = async (toEmail, ctrlNumber) => {

    const emailData = {
      to: toEmail,
      subject: 'Urgent: Cancellation of Your Record Request',
      text: `
      Good day!
  
      This is to inform you that your pending record request with control number Ctrl-${ctrlNumber} has been canceled due to the failure to make the required payment within the specified deadline.
  
      Failure to make the payment by the specified deadline will result in the automatic cancellation of your request.
  
      We understand that circumstances may have caused the delay in payment, and we regret that your request had to be canceled. If you still wish to obtain your academic record, please reinitiate the request through our system and complete the payment.

      If you have any questions or need assistance, please feel free to contact our office.

      Thank you for your understanding.
  
      Sincerely,
      Registrar's Office
      `,
    };

    try {
      const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/emails/send-email', emailData);
      if (response.status === 200) {
        console.log('Email sent successfully.');
      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }

  };


  const sendNotifEmail = async (toEmail, recordType, ipfs, dateIssued) => {

    const date_issued= new Date(dateIssued);
    date_issued.setDate(date_issued.getDate() + 365);
    const formattedDate = date_issued.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const emailData = {
      to: toEmail,
      subject: 'Important Reminder: Your Record is Expiring Next Month',
      text: `
      Good day!
  
      This is a friendly reminder that your record with the following information is set to expire on ${formattedDate}.

        • Record Type: ${recordType}
        • IPFS Link: https://cressential-5435c63fb5d8.herokuapp.com/ipfs/${ipfs}
        • Expiration Date: ${formattedDate}

      To maintain access to your records, you can submit a new record request. You can easily do this by following these steps:

        1. Visit our online portal: https://cressential-5435c63fb5d8.herokuapp.com
        2. Click on the "Record Request" tab.
        3. Fill out the required information.
        4. Review your request carefully and submit it.
        5. Proceed to payment process.

      For any questions or assistance with renewing your record, please don't hesitate to contact our office.

      Thank you for your cooperation.

      Sincerely,
      Registrar's Office
      `,
    };
  
    try {
      const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/emails/send-email', emailData);
      if (response.status === 200) {
        console.log('Email sent successfully.');

      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const sendExpirationEmail = async (toEmail, recordType, ipfs, dateIssued) => {

    const date_issued= new Date(dateIssued);
    date_issued.setDate(date_issued.getDate() + 365);
    const formattedDate = date_issued.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const emailData = {
      to: toEmail,
      subject: 'Important Notice: Your Record Has Expired',
      text: `
      Good day!
  
      We regret to inform you that your record with the following information has expired on ${formattedDate}.

        • Record Type: ${recordType}
        • IPFS Link: https://cressential-5435c63fb5d8.herokuapp.com/ipfs/${ipfs}
        • Expiration Date: ${formattedDate}

      Your record may no longer be valid for use. To regain access to your record, you will need to submit a new record request. Please note that the process of submitting a new request may take some time to complete.

      To submit a new record request, please follow these steps:

        1. Visit our online portal: https://cressential-5435c63fb5d8.herokuapp.com
        2. Click on the "Record Request" tab.
        3. Fill out the required information.
        4. Review your request carefully and submit it.
        5. Proceed to payment process.

      We apologize for any inconvenience this may cause. We appreciate your understanding and cooperation.

      Sincerely,
      Registrar's Office
      `,
    };
  
    try {
      const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/emails/send-email', emailData);
      if (response.status === 200) {
        console.log('Email sent successfully.');

      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };


  const unpaidDecline = async () => {
    // const jwtToken = localStorage.getItem("token");
    const currentDate = new Date();
    // Use map to iterate through the data array
    request_data.map(async (item) => {
      const requestedDate = new Date(item.date_requested);
      // Check if the request is more than or equal to 3 days old and the status is "Unpaid", 
      // if true, then automatically cancel its request
      if (
        currentDate.getTime() - requestedDate.getTime() >= 3 * 24 * 60 * 60 * 1000 && // 3 days in milliseconds
        item.payment_status === 'Unpaid' &&
        item.request_status !== 'Cancelled'
      ) {
        try {
          const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/cancel-record-request/${item.ctrl_number}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
               Authorization: `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const to_email = getStudentEmail(item.student_id);
            if (to_email && item.ctrl_number) {
              sendCancelationEmail(to_email, item.ctrl_number);
              console.log('sendCancelationEmail');
            }
            // Fetch updated data and update the state
            fetch('https://cressential-5435c63fb5d8.herokuapp.com/mysql/email/record-request', {
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
              setRequestData(data); // Set the fetched data into the state
            })
            .catch((err) => console.log(err));
          } else {
            // Handle the case where the update request is not successful
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }

      // Check if the request is more than or equal to 2 days old and the status is "Unpaid", 
      // if true, then inonotify sya na due na tomo yung payment
      if (
        currentDate.getTime() - requestedDate.getTime() >= 2 * 24 * 60 * 60 * 1000 && // 2 days in milliseconds
        item.payment_status === 'Unpaid' &&
        item.request_status !== 'Cancelled' &&
        !item.is_payment_notified
      ) {
        const to_email = getStudentEmail(item.student_id);
        if (to_email && item.ctrl_number && item.total_amount) {
          sendReminderEmail(to_email, item.ctrl_number, item.total_amount);
          console.log('sendReminderEmail');
        }
      }
    });
  };

  const recordValidity = async () => {
    const currentDate = new Date();
      // Use map to iterate through the data array
      
      issuance_data.map(async (item) => {
      const date_issued = new Date(item.date_issued);    
      const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
      const lessOneYearInMilliseconds = 355 * 24 * 60 * 60 * 1000;
      const date_difference = currentDate - date_issued;
      
      // Check if the record is more than a year from the date_issued, 
      // if true, then send email then set is_expired to true
      if (date_difference >= oneYearInMilliseconds && !item.is_expired) {
  
          try {
          const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/update-record-per-request/is_expired/${item.rpr_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`,
            },   
                  
          });
    
          if (response.status === 200) {
            const to_email = getStudentEmail(item.student_id);
            const record_type = getRecordType(item.request_record_type_id);
  
              if (to_email && record_type){
                // sendExpirationEmail(to_email, record_type, item.ipfs, item.date_issued);      
                console.log('sendExpirationEmail');        
              }
            
          } else {
            setAlertMessage('Failed to update record');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
      
      // Check if the record is less than a month before its expiration, 
      // if true, then send email notification
      if (date_difference >= lessOneYearInMilliseconds && !item.is_notified) {
  
          try {
          const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/update-record-per-request/is_notified/${item.rpr_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`,
            },   
                  
          });
    
          if (response.status === 200) {
            const to_email = getStudentEmail(item.student_id);
            const record_type = getRecordType(item.request_record_type_id);
  
            if (to_email && record_type){
              sendNotifEmail(to_email, record_type, item.ipfs, item.date_issued);  
              console.log('sendNotifEmail');            
            }
          } else {
            setAlertMessage('Failed to update record');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
  
        
      
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      await unpaidDecline();
      await recordValidity();
    };
    fetchData();
  }, []);
 

    useEffect(() => {
      fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/record-request", {
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

    useEffect(() => {
      fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/users", {
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
          setUserData(data);
        })
        .catch((err) => console.log(err));
    }, []);
  

  const today = new Date();

  const pending_data = data.filter((record) => record.request_status === "Pending");
  const pending_data_today = data.filter((record) => record.request_status === "Pending" && record.date_requested === today);
  const receieved_data = data.filter((record) => record.request_status === "Received" );
  const receieved_data_today = data.filter((record) => record.request_status === "Received" && record.date_requested === today);
  const completed_data = data.filter((record) => record.request_status === "Completed");
  const completed_data_today = data.filter((record) => record.request_status === "Completed" && record.date_requested === today);
  const active_users = user_data ? user_data.filter((record) => record.status === "active") : null;


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="secondary"
                icon="pending"
                title="Pending Requests"
                count={pending_data.length}
                percentage={{
                  color: "success",
                  amount: "+"+pending_data_today.length,
                  label: "pending request today",
                }}
              />
            </MDBox>
          </Grid>         
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="paypal"
                title="Received Requests"
                count={receieved_data.length}
                percentage={{
                  color: "success",
                  amount: "+"+receieved_data_today.length,
                  label: "received request today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="assignment_turned_in"
                title="Completed Requests"
                count={completed_data.length}
                percentage={{
                  color: "success",
                  amount: "+"+completed_data_today.length,
                  label: "completed request today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Active Users"
                count={active_users.length}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        
        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <RecentRequest />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <RecentIssuance />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
