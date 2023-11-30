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
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Icon from '@mui/material/Icon';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';

function DefaultNavbarLink({ icon, name, route, light }) {
  return (
   
    <MDTypography
      variant="button"
      fontWeight="regular"
      color={light ? 'white' : 'dark'}
      textTransform="capitalize"
      component={NavLink}
      to={route}
      mx={1}
      p={1}
      display="flex"
      alignItems="center"
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        textDecoration: 'underline', // Ensure no default text decoration
        '&.active': {        
          color:'#49a3f1',
          '& svg': {
            color: '#1A73E8', // Change the color of the Icon component for active links
          },
        },
      }}
     
    >
      <Icon
        fontSize="small"
        sx={{
          color: light ? 'white' : 'dark',
          verticalAlign: 'middle',
        }}
      >
        {icon}
      </Icon>
      &nbsp;{name}
    </MDTypography>

  );
}

DefaultNavbarLink.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  light: PropTypes.bool.isRequired,
};

export default DefaultNavbarLink;

