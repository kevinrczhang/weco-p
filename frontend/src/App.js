import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Recommended from './components/Recommended';
import UserInterestList from './components/Accounts/UserInterestList'
import RegisterUser from "./components/Accounts/Register"
import PostList from "./components/PostList";
import Welcome from "./components/Welcome";
import LoginUser from './components/Accounts/LoginUser';
import Home from './components/Accounts/Home';
import PostDetail from './components/PostDetail';
import UserProfile from './components/Accounts/UserProfile';
import MatchHomepage from './components/Accounts/MatchHomepage';
import FollowPostList from './components/FollowPostList';
import SearchUserList from './components/Accounts/SearchUserList';
import Topbar from './components/Topbar.js';
import UpdateUserProfile from './components/Accounts/UpdateProfile';
import PrivacyPolicy from './legal/privacy';
import TOS from './legal/TOS';
import {
  Box,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system'
import { FaDelicious } from "react-icons/fa";
import constants from './constants';
import { useHistory } from 'react-router-dom';
const BASE_URL = new URL(constants.BASE_URL)

const CustomTypography = styled(Typography)({
  margin: '0.5rem 0 !important',
  padding: '0 1rem',

  // One of the reasons the newer CSS system is nice is that pseudo-classes
  // and -elements are supported.
  ':hover': {
    backgroundColor: '#e1e1e1',
    cursor: 'pointer',
  },
})
const CustomLink = styled(Link)({
  // MUI always wants underline. We don't.
  textDecoration: 'none !important',
  color: 'black',

  display: 'inline-block',
  width: '100%',
})

export default function App() {
  const [User, setUser] = useState() //stores the user id
  const [fetchedUserId, setFetchedUserId] = useState(false)
  const history = useHistory()
  useEffect(() => {
    axios.get(new URL('/accounts/user_id/', BASE_URL))
      .then(res => {
        setUser(res.data)
        setFetchedUserId(true)
      }
      ).catch(err => {
        // Placeholder error handling.
        console.error(err)

        // Just so that something shows.
        setFetchedUserId(true)

        /**
         * TODO: Do some actual error handling.
         * (01/19/2022) Take-Some-Bytes */
      })

  }, [])

  if (!fetchedUserId) {
    // Don't do anything.
    return <p>Loading...</p>
  }

  if (!User && !(window.location.pathname === "/register" || window.location.pathname === "/login"|| window.location.pathname === "/privacy"|| window.location.pathname === "/termsofuse")) {
    return <Router>
      <Route path="/">
        <Redirect to="/welcome" />
      </Route>
      <Route path="/welcome">
        <Welcome />
      </Route>
      <Route path="/login">
        <LoginUser />
      </Route>
      <Route path="/register">
        <RegisterUser />
      </Route>
    </Router>
  }
  else {
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          minHeight: '100vh'
        }}
        id='asdfsdf'
      >{/*don't know where color translates to*/}
        <Router>
          <Topbar id={User}/>
          <Stack
            sx={{ minHeight: '100vh' }}
            id='asdfsdfsf'
            direction='row'
          >
            <nav
              style={{
                minWidth: '11%',
                padding: '3.5rem 0',
                backgroundColor: '#f2f2f2',
                position: 'fixed',
                height: '100vh'
              }}
            >{/*(line 125) don't know where color translates to*/}
              <ul
                style={{
                  listStyleType: "none",
                  position: 'relative',
                  height: '100vh',
                  padding: 0,
                }}
              >
                {!User &&
                <div>
                  <CustomTypography variant='h5'>
                    <CustomLink href="/login" style={{marginTop: '5%'}}>Login</CustomLink>
                  </CustomTypography>
                  <CustomTypography variant='h5'>
                    <CustomLink href="/register" style={{marginTop: '5%'}}>Sign Up</CustomLink>
                  </CustomTypography>
                  </div>
                }
                {!!User &&
                  <div>
                    <CustomTypography variant='h5' >
                      <CustomLink href="/Home">
                        Home
                      </CustomLink>
                    </CustomTypography>
                    <CustomTypography variant='h5'>
                      <CustomLink href="/PostList">
                        Discover
                      </CustomLink>
                    </CustomTypography>
                    <CustomTypography variant='h5'>
                      <CustomLink href="/MatchHomepage">
                        Matches
                      </CustomLink>
                    </CustomTypography>
                    <CustomTypography variant='h5'>
                      {/*<CustomLink href="/following-posts">
                        For You
                      </CustomLink>
                */}
                
                    </CustomTypography>             
                    <CustomTypography variant='h5'>
                      {/*}
                      <CustomLink href="/following-posts">
                        Follows
                      </CustomLink>
              */}
                    </CustomTypography>
                  </div>
                }
                <div style={{ position: 'absolute', bottom: '100px' }}>
                  <Typography style={{marginLeft: '12px', fontSize:15, cursor: 'pointer'}} onClick={()=> history.push('/privacy')}>
                    Privacy Policy
                  </Typography>
                  <Typography style={{marginLeft: '12px', fontSize:15, cursor: 'pointer', position: 'relative'}} onClick={()=> history.push('/termsofuse')}>
                    Terms of use
                  </Typography>
                </div>
              </ul>
            </nav>
            <div style={{ flexGrow: '1', paddingLeft: '11%' }}>
              <Switch style={{ flex: 1, padding: "10px" }}>{/*p - params, o - offset, l - limit*/}
                <Route path='/search'>
                  <SearchUserList />
                </Route>
                {/*
                {User !== undefined ?
                  <Route path="/following-posts">
                    <FollowPostList get_user_id={User} />
                  </Route> : console.log('false')
                }
                 */}
                <Route path="/login">
                  <LoginUser />
                </Route>
                <Route path="/Home">
                  <Home />
                </Route>
                {/*
                <Route path="/PostList/:PostId">
                  <PostDetail UserID={User} />
                </Route>
                 */}
                <Route path="/PostList">
                  <PostList />
                </Route>
                <Route path="/profile/:profileId">
                  <UserProfile currentUserId={User} />
                </Route>
                <Route path="/register">
                  <RegisterUser />
                </Route>
                <Route path="/interest">
                  <UserInterestList />
                </Route>
                <Route path="/MatchHomepage">
                  <MatchHomepage />
                </Route>
                <Route path='/UpdateProfile/'>
                  <UpdateUserProfile currentUserId={User} />
                </Route>
                <Route path='/privacy/'>
                  <PrivacyPolicy />
                </Route>
                <Route path='/termsofuse/'>
                  <TOS />
                </Route>
              </Switch>
            </div>
          </Stack>
        </Router>
      </Box>
    )
  }
}
