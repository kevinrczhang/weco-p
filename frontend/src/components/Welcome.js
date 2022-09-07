import * as React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Stack from '@mui/material/Stack';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router";

import {
    Link,
    useRouteMatch,
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme(); //create theme using this

export default function Album() {
  let history = useHistory();
  function reload(path){
    history.push(`/${path}`) 
    window.location.reload(false);

  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 20,
            pb: 70,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              WECO <sup> beta</sup>
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Welcome to the beta version of WECO! If anything seems to stop working, try clearing your browser cache or cookies.
            More features are on the way!
            Please note that <b>none</b> of your data will be shared to anyone and your passwords cannot be seen by us.
            
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
                
                <Button variant="contained" onClick={()=> reload('register')}>Sign Up</Button>
              
                
                <Button variant="outlined" onClick={() => reload('login')}>Log In</Button>
                             
            </Stack>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}