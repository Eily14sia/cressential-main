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
import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ProfileInfoCard from "../../examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "../../examples/Lists/ProfilesList";
import DefaultProjectCard from "../../examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "./components/Header";
import PlatformSettings from "./components/PlatformSettings";

// Data
import profilesListData from "./data/profilesListData";

function Overview() {

  const [registrar_data, setRegistrarData] = useState([]);
  const [student_data, setStudentData] = useState([]);
  const jwtToken = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');
  const user_role = localStorage.getItem('user_role');

  useEffect(() => {
    fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/registrar-management`, {
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
        if (data.length > 0) {
        const fetchedData = data.find((item) => item.user_id === parseInt(user_id));
        setRegistrarData(fetchedData);
        }
      })
      .catch((err) => console.log(err));
  }, []);

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
        if (data.length > 0) {
        const fetchedData = data.find((item) => item.user_id === parseInt(user_id));
        setStudentData(fetchedData);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            {/* <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid> */}
            <Grid item xs={12} xl={6} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              {parseInt(user_role) === 1 && user_role ? (

                <ProfileInfoCard
                title="profile information"
                description="This section displays essential details about an individual, such as their name and other personal information. It serves as a concise overview of the user's identity and role."
                info={{
                  fullName: registrar_data.first_name + " " + registrar_data.last_name,
                  mobile: "registrar_data.contact_number",
                  email: "alecthompson@mail.com",
                  location: "USA",
                }}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
              ) : (
                <ProfileInfoCard
                title="profile information"
                description="This section displays essential details about an individual, such as their name and other personal information. It serves as a concise overview of the user's identity and role."
                info={{
                  fullName: student_data.first_name + " " + student_data.middle_name + " " + student_data.last_name,
                  studentNumber: student_data.student_number,
                  college: student_data.college,
                  course: student_data.course,
                }}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
              )}
              
              
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={6} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              {parseInt(user_role) === 1 && user_role ? (

                <ProfileInfoCard
                title="Contact information"
                description="This section presents means of communication allowing users to easily get in touch or connect with the person or entity. It facilitates efficient and direct communication"
                info={{
                  fullName: registrar_data.first_name + " " + registrar_data.last_name,
                  mobile: "registrar_data.contact_number",
                  email: "alecthompson@mail.com",
                }}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
                />
                ) : (
                <ProfileInfoCard
                title="contact information"
                description="This section displays essential details about an individual, such as their name and other personal information. It serves as a concise overview of the user's identity and role."
                info={{
                  walletAddress: student_data.wallet_address,
                  contactNumber: student_data.mobile_number,
                  email: student_data.email,
                  address: student_data.permanent_address,
                }}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
                />
                )}
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            {/* <Grid item xs={12} xl={4}>
              <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />
            </Grid> */}
            
          </Grid>
        </MDBox>
        {/* <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Projects
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Architects design houses
            </MDTypography>
          </MDBox>
        </MDBox> */}
        {/* <MDBox p={2}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor1}
                label="project #2"
                title="modern"
                description="As Uber works through a huge amount of internal management turmoil."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor2}
                label="project #1"
                title="scandinavian"
                description="Music is something that everyone has their own specific opinion about."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor3}
                label="project #3"
                title="minimalist"
                description="Different people have different taste, and various types of music."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor4}
                label="project #4"
                title="gothic"
                description="Why would anyone pick blue over pink? Pink is obviously a better color."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
          </Grid>
        </MDBox> */}
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
