import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

import { Worker } from '@react-pdf-viewer/core';

// Material Dashboard 2 React components
import MDBox from "./components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "./examples/Sidenav";
import Configurator from "./examples/Configurator";

// Material Dashboard 2 React themes
import theme from "./assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "./assets/theme-dark";

// Material Dashboard 2 React routes
import routes from "./routes";
import Home from "./layouts/authentication/home"
// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "./context";
import { useAuth } from './context2';

// Images
import brandWhite from "./assets/images/cressential-logo-light.png";
import brandDark from "./assets/images/cressential-logo-dark.png";
import RouteGuard  from "./route_guard";
import LogIn from "./layouts/authentication/log_in";
import Verifier_Portal from "./layouts/authentication/verification_portal";
import AboutUs from "./layouts/authentication/about_us";
import ContactUs from "./layouts/authentication/contact_us";

export default function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  const user_role = parseInt(localStorage.getItem('user_role'));


  let inactivityTimeout;
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    navigate('/'); // Use history to navigate to the login page
  };

  function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(logout, 20 * 60 * 1000); // 20 minutes
  }

  useEffect(() => {
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keydown', resetInactivityTimer);

    return () => {
      document.removeEventListener('mousemove', resetInactivityTimer);
      document.removeEventListener('keydown', resetInactivityTimer);
    };
  }, []);

  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes, userRole) =>
  allRoutes.map((route) => {
    if (route.collapse) {
      return getRoutes(route.collapse, userRole);
    }
    
    if (route.route && (!route.role || route.role.includes(userRole))) {
      return (
        <Route
          path={route.route}
          element={
            isAuthenticated ? (
              route.component
            ) : (
              <Navigate to="/" />
            )
          }
          key={route.key}
        />
      );
    }

    return null;
  });


  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );
    const [userID, set_user_id] = useState('');
   
  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <CssBaseline />      
        <Routes>
          {getRoutes(routes, user_role)}
          {console.log("isAuthenticated:"+isAuthenticated)}
          <Route path="/" element={<Home userID={userID} set_user_id={set_user_id}/>} />   
          <Route path="/authentication/log-in" element={<LogIn/>} />   
          <Route path="/verifier-portal" element={<Verifier_Portal/>} key="verifier-portal"/>   
          <Route path="/about-us" element={<AboutUs/>} key="about-us"/>   
          <Route path="/contact-us" element={<ContactUs/>} key="contact-us"/>   

          {isAuthenticated ? (
            <Route path="/*" element={<Navigate to="/unauthorized" />} />
          ) : (
            <Route path="/*" element={<Navigate to="/" />} />
          )}
        </Routes>      
      {layout === "dashboard" && (
        <>
          <Sidenav 
            userID={userID}
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Cressential"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      </Worker>
    </ThemeProvider>
  );
}
