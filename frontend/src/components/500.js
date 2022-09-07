import React from 'react';
import { CardActions, CardMedia, CssBaseline, Grid, Toolbar, Container, Typography, AppBar, Card, root } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: '20px',
    },
    buttons: {
        marginTop: '20px'

    },
    CardMedia: {
        textAlign: 'center',
        width: '100%',
        height: 700,
    },
    card: {
        marginTop: '30px',
        width: '85%',
        margin: 'auto',
    },
    root: {
        textAlign: 'center',
        marginTop: '20px'
    },
    cardgrid: {
        padding: '20px 0',
    },
    Grid: {
        textAlign: 'center',
        marginTop: '20px'
    }
    
}));

const FiveHundred = () => {
    const classes = useStyles();
    return (
        <div>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <Typography variant="h6">
                        WECO
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                <div className={classes.Grid}>
                    <Container>
                        <Typography align="center" variant="h3" color="Black" gutterBottom>
                            Something went wrong, try again...
                        </Typography>
                    </Container>
                </div>
                <div className={classes.Grid}>
                    <Button variant="contained">
                        <Button align="center">
                            Return to Home
                            < ArrowRightAltIcon className={classes.ArrowRightAltIcon} />
                        </Button>
                    </Button>
                </div>
                <container className={classes.cardgrid} maxWidth="md">
                    <Grid container spacing={4}>
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
                </container>
            </main>
        </div>
    );
}

export default FiveHundred;