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

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [data, setData] = useState([]);
  const [user_data, setUserData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/mysql/record-request")
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the fetched data into the state
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8081/mysql/users")
      .then((res) => res.json())
      .then((data) => {
        setUserData(data); // Set the fetched data into the state
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
  const active_users = user_data.filter((record) => record.status === "active");


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
                  label: "request today",
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
                  label: "request today",
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
                  label: "request today",
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
