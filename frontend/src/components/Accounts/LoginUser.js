import React, { Component } from 'react'
import { login } from './Auth';
import { withStyles } from '@material-ui/styles';
import { spacing } from '@mui/system';
import { Grid, Paper, Button, Typography, Link } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import { FiVolumeX } from 'react-icons/fi';

const styles = theme => ({
    root:{        
        padding : 50,
        height: 450,
        width: 400, 
        marginTop: '10%'
    },

    title:{
        
        fontSize: '30px',
        
    },

    paper:{
        marginTop: '15px',
    },

    log:{
        background: '#3f51b5',
        color: 'white',
        border: '0px',
        borderRadius: '5px',
        borderColor:'grey',
        fontSize: '20px',
        height: '45px',
        marginTop:'90px'
        
    },

    fp:{
        marginTop: '80px', 
        marginLeft:'65px'
    },

    pf:{
        marginTop: '8px'
    }

    


});
class LoginUser extends React.Component {
    
    constructor() {
        super();
        this.state = { name: '', password: '', text: ''};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        
    }
    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });

    }

    submitLogin(event) {
        event.preventDefault();
        login(this.state)
        .then(res =>{
            this.setState({text: res});
        })
        
    }

    render() {
        const { classes } = this.props;
        
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                // Change the size depending on the parent element, there's no need if you apply the style to the parent element
                width: '80%',
                height: '100%',}}>
              
                <Paper elevation= {10} className={classes.root}>
                
                    <Grid align='center'>
                        <h2 className={classes.title}>Log in </h2>
                    </Grid>
                    <form onSubmit={this.submitLogin}>
                        
                        
                        <Paper className={classes.paper}>
                        <TextField id="standard-basic" 
                        label="Email" 
                        name='name'
                        type="text"
                        value={this.state.name}
                        onChange={this.handleInputChange}
                        fullWidth required
                        />
                        </Paper>
                    
                        <Paper className={classes.paper}>
                        <TextField id="standard-basic" 
                        label="Password" 
                        name='password'
                        type="password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        fullWidth required
                        />
                        </Paper>
                        <Typography className={classes.pf}>
                            {/*  <Link href = "" >Forgot Password?</Link>*/}
                        </Typography>
                        <Typography className={classes.pf}>
                            {this.state.text}
                        </Typography>
                        {/*}
                        <Tooltip title="Will Remember You When You Come Back" >
                            <FormControlLabel
                                control={
                                  <Checkbox
                                    name="checkedB"
                                    color="primary"
                                  />
                                }
                                label="Remember Me"
                            />
                        </Tooltip>
                            */}
                        <Button type="submit" className={classes.log} 
                        onClick={this.submitLogin}
                        variant="contained" fullWidth>LOG IN</Button>
                    </form>
                    
                    <Typography className={classes.fp}>Haven't created an account?
                        <Tooltip title="Go to the Sign Up page" >
                            <Link href = "./register"> Sign Up</Link>
                        </Tooltip>
                    </Typography>
                </Paper>
                
            </div>
        );
    }
}

LoginUser.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles) (LoginUser);
