import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";

// Material Dashboard 2 React example components
import DefaultNavbar from "../../../../examples/Navbars/DefaultNavbar";
import PageLayout from "../../../../examples/LayoutContainers/PageLayout";

// Authentication pages components
import Footer from "../Footer";

function BasicLayout({ image, children }) {
    return (
      <PageLayout>
        <DefaultNavbar 
        action={{
          type: "external",
          route: "/verifier-portal",
          label: "Verifier Portal",
          color: "dark",
        }}
      />
        <MDBox
          position="absolute" /* Change position from absolute to relative */
          width="100%"
          minHeight="100vh" /* Adjust to full viewport height */
          sx={{
            backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
              image &&
              `${linearGradient(
                rgba(gradients.dark.main, 0.6),
                rgba(gradients.dark.state, 0.6)
              )}, url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Content within the MDBox */}
          <MDBox px={1} width="100%" height="auto" mt={20} mb={6} mx="auto">
            <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
              <Grid item xs={11} sm={12} xl={10}>
                {children}
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </PageLayout>
    );
  }

// Typechecking props for the BasicLayout
BasicLayout.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default BasicLayout;
