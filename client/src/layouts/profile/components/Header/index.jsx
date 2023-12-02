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

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import MDAlert from "../../../../components/MDAlert";

// Material Dashboard 2 React base styles
import breakpoints from "../../../../assets/theme/base/breakpoints";
import ChangePassword from "../add_record";
import { useAuth } from '../../../../context2';

// Images
import burceMars from "../../../../assets/images/avatar_profile.png";
import backgroundImage from "../../../../assets/images/university.jpg";

function Header({ children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

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

  // =========== For the MDAlert =================
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [initialPassword, setInitialPassword] = useState('');
  const [password, setPassword] = useState('');  
  const [passwordHash, setPasswordHash] = useState('');

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setPassword('');
    setInitialPassword('');
    setCurrentPassword('');
    setPasswordHash('');
  };

  const { logout } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Create a new record object to send to the server
    const newRecord = {
      password: password,
    };

    try {
      const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/change-password/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(newRecord),
      });

      if (response.ok) {
        handleCloseDialog();
        setIsSuccess(true);
        setAlertMessage('Password updated successfully.');

        // Fetch updated data and update the state
        logout();
      } else {
        setIsError(true);
        setAlertMessage('Failed to change password.');
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    }
  };
  

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      {isSuccess && (
          <MDAlert color="success" dismissible 
          sx={{marginBottom: '40px', position: "relative",  mt: -10, mb: 10,  mx: 3, py: 2, px: 2,}} 
          onClose={() => setIsSuccess(false)}
          >
                {alertContent("success", alertMessage)}
          </MDAlert>
        )}
        {isError && (
          <MDAlert color="error" dismissible
          sx={{marginBottom: '40px', position: "relative",  mt: -10, mb: 10,  mx: 3, py: 2, px: 2,}} 
          onClose={() => {setIsError(false); setEmail('');}}
          >
            {alertContent("error", alertMessage)}
          </MDAlert>
        )}

      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        
        <Grid container spacing={3} alignItems="center">
          
          <Grid item xs={8 } md={4} lg={8}>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {parseInt(user_role) === 1 && (registrar_data || student_data) ? (
                  registrar_data.first_name+" "+registrar_data.last_name
                ) : (
                  student_data.first_name+" "+student_data.last_name
                )}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {parseInt(user_role) == 1 ? "Registrar" : "Student"}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox display="flex" justifyContent="flex-end">
              <MDButton color="dark" variant="gradient" onClick={handleOpenDialog}>
                Change Password
              </MDButton>
            </MDBox>
          </Grid>
          <ChangePassword open={isDialogOpen} onClose={handleCloseDialog} 
          onSubmit={handleSubmit}
          accountPassword={(user_role == 1) ? registrar_data.password : student_data.password}
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          initialPassword={initialPassword}
          setInitialPassword={setInitialPassword}          
          password={password}
          setPassword={setPassword}
          passwordHash={passwordHash}
          setPasswordHash={setPasswordHash}/>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
