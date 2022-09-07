import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router";

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
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
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
              About Us
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>

            </Typography>

          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}