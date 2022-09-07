import axios from 'axios';
import { register } from './Auth'
import { create_tags } from "./functions"
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Grid, Paper, Button, Typography, Link } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FaAssistiveListeningSystems } from 'react-icons/fa';
import FiveHundred from '../500';
import { render } from 'react-dom';
import constants from '../../constants';

const BASE_URL = new URL('/accounts/', constants.BASE_URL)

const useStyles = makeStyles((theme) => ({

      root: {
            marginLeft: '35%',
            marginTop: '5%',

      },

      title: {
            fontSize: '30px',
            marginLeft: '34%'
      },

      paper: {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            color: 'rgba(255, 255, 255, 1)',
            marginTop: '5%',
            width: '100%'
      },
      but: {
            background: 'violet',
            color: 'white',
            border: '0px',
            borderRadius: '5px',
            borderColor: 'grey',
            fontSize: '20px',
            height: '45px',
            marginLeft: '150%',
            marginTop: '5%'
      },
      outer: {
            padding: 50,
            height: 500,
            width: 400,
            marginLeft: '15%',
            marginTop: '5%',
      },
      loading:{
        marginLeft: '15%',
        marginTop:'20%',
        color: 'white'
      }
}))

export default function RegisterUser() {
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
            cpassword: "",
      }
      ]
      );
      const handleSubmit = (e) => {
            e.preventDefault();
            create_tags(tags,state.username, state.email, state.password, userInterests)

      }
            

      useEffect(() => {
            let active = true;
            let active2 = true;
            if (!loading) {
                  return undefined;
            }
            (async () => {

                  //gets the interests 
                  const response = axios.get(new URL('interest_list', BASE_URL));
                  const { data } = await response;
                  if (active) {
                        setInterests(data.interests)

                  }
                  const response2 = axios.get(new URL('tags_list/', BASE_URL));
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


      if (loading) {
            //note: if the backend is not working, this will be stuck like this forever
            return( <div className={classes.loading}>
                  <p>Data is loading...</p>
                  <p>If nothing is showing up, it means that the servers are currently down, please come back later!</p>
            </div>                  )
      }

      //https://material-ui.com/components/autocomplete/

      //axios.get...
      // get interest list, which is already created, and then send as a get request to onsubmit to create user
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
            <div className={classes.root}>
                  <Paper elevation={10} className={classes.outer}>
                        <form>
                              <h1 className={classes.title}>Register</h1>
                              <label>
                                    <Paper className={classes.paper}>
                                          <TextField id="standard-basic"
                                                label="Username"
                                                name='username'
                                                type="text"
                                                placeholder="Your username"
                                                value={state.username}
                                                onChange={e => handleChange(e)}
                                                fullWidth required
                                          />
                                    </Paper>
                              </label>
                              <label>
                                    <Paper className={classes.paper}>
                                          <TextField id="standard-basic"
                                                label="Email"
                                                name="email"
                                                type="text"
                                                placeholder="Your email to log in"
                                                value={state.email}
                                                onChange={handleChange}
                                                fullWidth required
                                          />
                                    </Paper>
                              </label>
                              <label>
                                    <Paper className={classes.paper}>
                                          <TextField id="standard-basic"
                                                label="Password"
                                                name="password"
                                                type="password"
                                                placeholder="Your password to log in"
                                                value={state.password}
                                                onChange={handleChange}
                                                fullWidth required
                                          />
                                    </Paper>
                              </label>

                              <label>
                                    <Paper className={classes.paper}>
                                          <Autocomplete
                                                multiple
                                                id="multiple-limit-tags"
                                                options={interests}
                                                getOptionLabel={(option) => option.interest_name}
                                                onChange={(event, value) => value.map(values => setUserInterests([...userInterests, values.id]))}
                                                renderInput={(params) => (
                                                      <TextField
                                                            {...params}
                                                            variant="outlined"
                                                            label="Interests"
                                                            placeholder="Your Interests"
                                                      />
                                                )}
                                          />
                                    </Paper>
                              </label>
                              <label>
                                    <Paper className={classes.paper}>
                                          <Autocomplete
                                                multiple
                                                id="multiple-limit-tags"
                                                options={tagslist}
                                                freeSolo
                                                getOptionLabel={(option) => option.interest_tag_name}
                                                onChange={(event, value) => onChange(value)}
                                                renderTags={(value, getTagProps) =>
                                                      value.map((option, index) => (
                                                            <Chip variant="outlined" label={option.interest_tag_name} {...getTagProps({ index })} />
                                                      ))
                                                }
                                                renderInput={(params) => (
                                                      <TextField {...params} variant="filled" label="Tags" placeholder="Favorites" />
                                                )}
                                          />
                                    </Paper>
                              </label>
                              <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    className={classes.complex}
                                    variant="contained"
                                    fullWidth
                              >
                                    Sign Up
                              </Button>
                        </form>
                  </Paper>
            </div>
      )
}
