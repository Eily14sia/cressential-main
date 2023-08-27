import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Icon from "@mui/material/Icon";
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from "@mui/material/Divider";

import MDTypography from "../../components/MDTypography";
import MDButton from '../../components/MDButton';
import MDBox from '../../components/MDBox';

import bg_link from "../../assets/images/homepage_main.png"

import DefaultInfoCard from "../../examples/Cards/InfoCards/DefaultInfoCard";
import Footer from '../Footer/index';

import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";


// function Copyright() {
//   return (
//     <MDTypography variant="body2" color="text.secondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </MDTypography>
//   );
// }

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Album() {
  return (
    <>  
    {/* Hero unit */}
        <Box mt={3} sx={{ pt: 8 }} >
          <Container maxWidth="sm" >
            <Grid container spacing={2}>
                <Grid item xs={12} md={5} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {/* <MDTypography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="text.primary"
                    gutterBottom
                    >
                    Album layout
                    </MDTypography> */}
                    <MDTypography variant="h1" gutterBottom>
                    Take verifier experience to the{' '}
                    <span style={{ color: '#1A73E8', display: 'inline', fontSize: 'inherit' }}>
                        next level
                    </span>
                    </MDTypography>

                    
                
                    {/* <MDTypography variant="h5" align="center" color="text.secondary" paragraph> */}
                    {/* <MDTypography variant="h5" align="center" color="text" paragraph> */}
                    <MDTypography
                        variant="h5"
                        fontWeight="regular"
                        color="text"
                    >
                    Something short and leading about the collection below—its contents,
                    the creator, etc. Make it short and sweet, but not too short so folks
                    don&apos;t simply skip over it entirely.
                    </MDTypography>
                    <Stack
                    sx={{ pt: 4 }}
                    direction="row"
                    >
                      <Link to="/verifier-portal" component={RouterLink}>
                        <MDButton variant="gradient" color="info" type="submit">
                        Verifier Portal&nbsp;
                        <Icon>arrow_right_alt</Icon>
                        </MDButton>
                      </Link>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'flex-end' }}>  
                    <MDBox p={5}>
                        <img
                        src={bg_link}
                        alt="Your Alt Text"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />  
                        </MDBox>      
                </Grid>
            </Grid>
          </Container>
        </Box>
        {/* <Container sx={{ py: 2 }} maxWidth="md">         
            <MDTypography gutterBottom variant="h5" component="h2">
            Type of Users
            <hr></hr>
            </MDTypography>
          <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image="https://source.unsplash.com/random?wallpapers"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <MDTypography gutterBottom variant="h5" component="h2">
                      Registrar
                    </MDTypography>
                    <MDTypography>
                      This is a media card. You can use this section to describe the
                      content.
                    </MDTypography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image="https://source.unsplash.com/random?wallpapers"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <MDTypography gutterBottom variant="h5" component="h2">
                      Student
                    </MDTypography>
                    <MDTypography>
                      This is a media card. You can use this section to describe the
                      content.
                    </MDTypography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image="https://source.unsplash.com/random?wallpapers"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <MDTypography gutterBottom variant="h5" component="h2">
                      Verifier
                    </MDTypography>
                    <MDTypography>
                      This is a media card. You can use this section to describe the
                      content.
                    </MDTypography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
          </Grid>
        </Container> */}

    <MDBox component="section" py={6} sx={{ backgroundColor: '#f8f9fa'}}>
      <Container>
        <Grid container item xs={12} lg={6} justifyContent="center" mx="auto" textAlign="center">
          <MDTypography variant="h2" mb={2}>
            Type of Users
          </MDTypography>
          <MDTypography variant="body2" color="text" mb={2}>
            That&apos;s the main thing people are controlled by! Thoughts - their perception of
            themselves!{" "}
          </MDTypography>
        </Grid>
        <Divider sx={{ my: 5 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={4} mb={{ xs: 3, lg: 0 }}>
            <DefaultInfoCard
              icon="person_3"
              title="Registrar"
              description="If you have the opportunity to play this game of life you need to appreciate every moment."
            />
          </Grid>
          <Grid item xs={12} md={8} lg={4} mb={{ xs: 3, lg: 0 }}>
            <DefaultInfoCard
              icon="person"
              color="info"
              title="Student"
              description="If you have the opportunity to play this game of life you need to appreciate every moment."
            />
          </Grid>
          <Grid item xs={12} md={8} lg={4} mb={{ xs: 3, lg: 0 }}>
            <DefaultInfoCard
              icon="verified"
              title="Verifier"
              description="If you have the opportunity to play this game of life you need to appreciate every moment."
            />
          </Grid>
        </Grid>
        
        
      </Container>
      
    </MDBox>
    <MDBox py={6} >
        <Footer/>
    </MDBox>
    
      {/* Footer */}
      {/* <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <MDTypography variant="h6" align="center" gutterBottom>
          Footer
        </MDTypography>
        <MDTypography
          variant="subtitle1"
          align="center"
          color="text"
          component="p"
        >
          Something here to give the footer a purpose!
        </MDTypography>
        
      </Box> */}
      {/* End footer */}
    </>
    
  );
}