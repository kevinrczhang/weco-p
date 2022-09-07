import { makeStyles } from "@material-ui/core/styles";
import React from 'react';
import { CardActions, CardContent, CardMedia, CssBaseline, Grid, Toolbar, Container, Link, Typography, AppBar, Card, Palette } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
        icon: {
            marginRight: '20px',
        },
        buttons: {
            marginTop: '40px'
        },
        CardMedia: {
            height: 700,
            width: 1400,
        },
        card: {
            width: 1200,
            margin: 'auto',
        },
        cardGrid: {
            padding: '20px 0',
    },


}));

const FourZeroFour = () => {
    const classes = useStyles();
    return (
        <div>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">
                        WECO
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                <div className={classes.container}>
                    <Container maxWidth="sm">
                        <Typography variant="h2" align="center" color="Black" gutterBottom>
                            Error 404
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Uh Oh! There's nothing here...
                        </Typography>
                        <Typography variant="h10" align="center" color="textSecondary" paragraph>
                            The page you are looking for does not exist
                        </Typography>
                        <div className={classes.Button}>
                            <Grid container spacing={2} justify="center">
                                <Grid item >
                                    <Button variant="contained">
                                        <Button variant="contained" color="primary" disableElevation>
                                            Return to Home
                                            < ArrowRightAltIcon className={classes.ArrowRightAltIcon} />
                                        </Button>
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
                <container className={classes.cardgrid} maxWidth="md">
                    <Grid container spacing={4}>
                        <Grid item key={classes.card} xs={12}>
                            <Card className={classes.card}>
                                <CardMedia
                                    className={classes.CardMedia}
                                    image="https://source.unsplash.com/random"
                                    title="Image title"
                                />
                                <CardActions>
                                    <Button size="large" color="primary" >Settings</Button>
                                    <Button size="large" color="primary" >Support</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </container>
            </main>
        </div>
    );
}

export default FourZeroFour;
