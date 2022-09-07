import axios from 'axios';
import React, { useState, useEffect } from "react";
import {
      Link,
      useRouteMatch,
      useParams
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ImageList from '@material-ui/core/ImageLIst';
import Result from './UserResult'
import FiveHundred from '../500';
import { render } from "react-dom"
import constants from '../../constants';

axios.defaults.withCredentials = true;
const BASE_URL = new URL('/accounts/', constants.BASE_URL)

const useStyles = makeStyles((theme) => ({
      root: {
            overflow: 'hidden',
            position: 'absolute',
            marginLeft: '13%',
            marginTop: '3.1%',
      },
      noMatches:{
            fontSize: 20,
            color: '#838387',
            marginTop: "6%",
            marginLeft: '2%'
      }

}));
//create route for user profile to match homepage
//send user id in every url request to load the users posts
export default function MatchHomepage() {
      const limit = 100;
      const config = { withCredentials: true };
      const [data, setData] = useState([]);
      const[error, setError] = useState();
      let hasMore = false;
      let offset = 0;
      const classes = useStyles();
      const bull = <span className={classes.bullet}>•</span>;
      const onButton = event => {
            axios.get(new URL('details/', BASE_URL))

      }
      const handleScroll = (e) =>{
            const bottom = document.getElementById('asdfsdfsf').scrollHeight - document.getElementById('asdfsdfsf').scrollTop === document.getElementById('asdfsdfsf').clientHeight;
            if(bottom && hasMore){
              const query = new URLSearchParams({ l: limit, o: offset })
              axios.get(new URL(`match/?${query.toString()}`, BASE_URL))
              .then(res => {
                setData(res.data.matchedUsers)
                hasMore=res.data.has_more
                offset += limit
              })
              .catch(err=>{render((props)=>{return (<FiveHundred/>)})});
            }
              
          }
      useEffect(() => {
            
                  const query = new URLSearchParams({ l: limit, o: offset })
                  axios.get(new URL(`match/?${query.toString()}`, BASE_URL))
                        .catch(error => {
                              if (error.response.status === 401) {
                                    window.location = '/Login'
                              }

                        }).catch(err=>{;render((props)=>{return (<FiveHundred/>)})})
                        .then(response => {

                              hasMore = response.data.has_more
                              setData(response.data.matchedUsers)
                              offset += limit

                        })
                  document.getElementById('asdfsdfsf').addEventListener('scroll', handleScroll, {
                              passive: true
                            });
                  return () => {document.getElementById('asdfsdfsf').removeEventListener('scroll', handleScroll)}
            
      },[]);
      if(data.length !== 0){
      return (
            <div className={classes.root} id='body' >

            <ImageList gap={1} style={{marginLeft: 90, overflow: 'hidden'}} >
            {data.map(user => {
              return (
              <Result user={user} key={user.id} />
              )
            })}
            </ImageList>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            {error && <div>{error}</div>}
            {!hasMore && <div style={{marginLeft:'17%', marginTop:'10%', color: 'black'}}>No more results</div>}
            
          </div>

      );
      }
      else{
            return(
                  <Typography className={classes.noMatches}>hmmm... Nobody has matched with your interests and tags. You can update them on the update profile page.</Typography>
            )
      }
}