// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
// import CardActionArea from '@mui/material/CardActionArea';
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

function DefaultInfoCard({ color, icon, title, description, name, value, handleOptionClick,  selectedOption}) {
  const cardClasses = selectedOption  === name ? "selected-card" : "";
  const selectedCardStyle = {
    border: '2px solid #1A73E8'
  };
  return (
    <Card style={{ backgroundColor: '#f0f2f5', ...(selectedOption === name ? selectedCardStyle : {}) }} className={cardClasses}>
      <CardActionArea onClick={() => handleOptionClick(name)}>
        <CardContent>
          <MDBox py={2} mx={3} display="flex"  justifyContent="center">
            <MDBox
              display="grid"
              justifyContent="center"
              alignItems="center"
              bgColor={color}
              color="white"
              width="6rem"
              height="4rem"
              shadow="md"
              borderRadius="lg"
              variant="gradient"
            >
              <Icon fontSize="default">{icon}</Icon>
            </MDBox>
          </MDBox>
          <MDBox pb={1} px={2} textAlign="center" lineHeight={1.25}>
            <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
              {title}
            </MDTypography>
            {description && (
              <MDTypography variant="caption" color="text" fontWeight="regular">
                {description}
              </MDTypography>
            )}
            {value && (
              <MDTypography variant="h5" fontWeight="medium">
                {value}
              </MDTypography>
            )}
          </MDBox>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// Setting default values for the props of DefaultInfoCard
DefaultInfoCard.defaultProps = {
  color: "info",
  value: "",
  description: "",
};

// Typechecking props for the DefaultInfoCard
DefaultInfoCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DefaultInfoCard;
