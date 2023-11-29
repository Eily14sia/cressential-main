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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import { Link } from 'react-router-dom';
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

// Material Dashboard 2 React base styles
import typography from "../../../../assets/theme/base/typography";

function Footer({ light }) {
  const { size } = typography;

  return (
    <MDBox width="100%" mt={5} bottom={0} py={4}>
      <Container>
        <MDBox
          width="100%"
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems="center"
          px={1.5}
        >
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            color={light ? "white" : "text"}
            fontSize={size.sm}
          >
            &copy; {new Date().getFullYear()} | Developed by 
              <MDTypography variant="button" fontWeight="medium" color={light ? "white" : "dark"}>
                &nbsp;Stonecap&nbsp;
              </MDTypography>
          </MDBox>
          <MDBox
            component="ul"
            sx={({ breakpoints }) => ({
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              listStyle: "none",
              mt: 3,
              mb: 0,
              p: 0,

              [breakpoints.up("lg")]: {
                mt: 0,
              },
            })}
          >
            
            <MDBox px={2}
              component={Link}
              to="/" >    
              <MDTypography variant="button" fontWeight="regular" color={light ? "white" : "dark"}>
                  Cressential
              </MDTypography>
            </MDBox>
            <MDBox px={2}
              component={Link}
              to="/about-us" >    
              <MDTypography variant="button" fontWeight="regular" color={light ? "white" : "dark"}>
                About us
              </MDTypography>
            </MDBox>
            <MDBox px={2}
              component={Link}
              to="/contact-us" >    
              <MDTypography variant="button" fontWeight="regular" color={light ? "white" : "dark"}>
                Contact
              </MDTypography>
            </MDBox>

            
          </MDBox>
        </MDBox>
      </Container>
    </MDBox>
  );
}

// Setting default props for the Footer
Footer.defaultProps = {
  light: false,
};

// Typechecking props for the Footer
Footer.propTypes = {
  light: PropTypes.bool,
};

export default Footer;
