import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { register } from "./Auth"
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FiveHundred from '../500';
import { render } from 'react-dom';
import constants from '../../constants';

const BASE_URL = new URL('/accounts/', constants.BASE_URL)

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        marginLeft: '-8%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        display: 'flex',
        marginLeft: "auto",
        backgroundColor: "grey",
    },
    text: {
        margin: theme.spacing(1),
        display: 'flex',
        textAlign: 'center',
        height: '100%',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function LoginSide() {
    const classes = useStyles();

    const [tags, setTags] = useState([]);
    const [tagslist, setTagslist] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [interests, setInterests] = useState([]);
    const [userInterests, setUserInterests] = useState([]);
    const loading = tagslist.length === 0;
    const [error, setError] = useState();
    const [autoCompleteValue, setAutoCompleteValue] = useState([""]);
    const [state, setState] = useState([{
          username: "",
          password: "",
          email: "",
          cpassword: "", //this is for confirm password
    }
    ]
    );
    const handleSubmit = (e) => {
          e.preventDefault();
          register(state.username, state.email, state.password)
          .then(res =>{
              console.log(res)
              alert(res.data)
          })

    }
          
/*
    useEffect(() => {
          let active = true;
          let active2 = true;
          if (!loading) {
                return undefined;
          }
          (async () => {

                //gets the interests 
                const response = axios.get(new URL('interest_list', BASE_URL)).catch(err=>{console.log(err);render((props)=>{return (<FiveHundred/>)})});
                const { data } = await response;
                if (active) {
                      setInterests(data.interests)

                }
                const response2 = axios.get(new URL('tags_list/', BASE_URL)).catch(err=>{console.log(err);render((props)=>{return (<FiveHundred/>)})});
                const data2 = await response2;
                if (active2) {
                      setTagslist(data2.data.tags)

                }
          })();
          return () => {
                active = false;
                active2 = false;
          };
    }, [loading])
*/
    function handleChange(e) {
          const value = e.target.value;
          setState({
                ...state,
                [e.target.name]: value
          });
    }
    function onChange(value){
        let name = "" 
        value.map(values => name = values.interest_tag_name)
        if(name !== undefined){
              setTags([...tags, name])
        }
        else{
              setTags([value])
        }
    }

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={4} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Grid container>
                        <Grid item md={3}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                        </Grid>
                        <Grid item md={8}>
                            <Typography component="h1" variant="h5" className={classes.text}>
                                Create An Account
                            </Typography>
                        </Grid>
                    </Grid>

                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={state.email}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="username"
                            label="Username"
                            type="username"
                            id="username"
                            autoComplete="current-username"
                            value={state.username}
                            onChange={e => handleChange(e)}
                        />                      
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={state.password}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            className={classes.submit}
                        >
                            Sign Up
                        </Button>
                    </form>
                </div>
            </Grid>
            <Grid item xs={false} sm={4} md={3} className={classes.image} />
        </Grid>
    );
}