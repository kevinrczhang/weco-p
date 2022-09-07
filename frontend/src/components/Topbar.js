import React from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useEffect, useState } from 'react';
import axios from 'axios';

import constants from '../constants';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PostForm from './PostForm';
import Plus from '@mui/icons-material/Add';
import { useHistory } from "react-router";
import { FaConnectdevelop } from 'react-icons/fa';

import { NotificationsButton, NotificationsList, useNotifs } from './topbar/Notifications'

const BASE_URL = new URL('/accounts/', constants.BASE_URL)

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  logoicon:{
    height: "40px"
  },
  AppBar:{
    backgroundColor: "#1c1b1b"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    margin: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const Topbar = (id) => {
  const [open, setOpen] = useState(false); //when the search bar is "opened"
  const [postOpen, setPostOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState();
  const loading = open && options.length === 0;
  const classes = useStyles();
  const [clicked, setClicked] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  let history = useHistory();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [notifs, notifsErr, markNotifsRead] = useNotifs()
  const [notifsAnchor, setNotifsAnchor] = useState(false)

  function onEnter(e) {
    const value = e.target.value
    if (e.key === 'Enter' && value) {

      history.push(`/search?q=${input}`)
      window.location.reload(false);

    }

  }

  function handleChange(e) {
    e.preventDefault()
    setInput(e.target.value)
  }
  
  function onClick(e) {
    axios.delete(new URL('login/', BASE_URL))
      .then(response => window.location = '/login')
  }

  const handleClickOpen = () => {
    setPostOpen(true);
  };

  const handleClose = () => {
    setPostOpen(false);
  };

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (input === undefined) {
        const response = await axios.get(new URL('search_users', BASE_URL),{credentials: 'include'} );
        const users = await response;
        if (active) {
          setOptions(users.data);
        }

      }
      else {
        const response = await axios.get(new URL(`search_users?p=${input}`,  {credentials: 'include'}));
        const users = await response;
        if (active) {
          setOptions(users.data);
        }
      }

    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      //setOptions([]);
    }
  }, [open]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    history.push('/profile/' + parseInt(id.id))
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={() => {
        setAnchorEl(null)
        handleMobileMenuClose()
      }}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={onClick}>Sign Out</MenuItem>

    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  if (notifsErr) {
    console.error(notifsErr)
  }

  return (
    <div className={classes.grow}>
      <AppBar position="fixed" className={classes.AppBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            
          >
            <img className= {classes.logoicon} src="https://weco-static.s3.us-west-2.amazonaws.com/weco-images/favicon-64x64.png" alt="" />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            WECO
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
              <InputBase
                  onKeyDown={onEnter}
                  placeholder="Search…"
                  onChange={handleChange}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
  
            />
          </div>
{/*
          <IconButton
              onClick={handleClickOpen}
              color="inherit"
            >
              <Plus />
          </IconButton>

          <Dialog open={postOpen} onClose={handleClose} maxWidth={800}>
            <DialogTitle>Create Post</DialogTitle>
            <DialogContent>
              <PostForm userID={id}/>
            </DialogContent>
          </Dialog>
                */}

          <div className={classes.grow} />
          <NotificationsButton
            numNotifs={notifs.filter(notif => !notif.isRead).length}
            onClick={e => setNotifsAnchor(e.currentTarget)}
          />
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <NotificationsList
        anchor={notifsAnchor}
        notifs={notifs}
        open={Boolean(notifsAnchor)}
        onClose={() => {
          markNotifsRead()
          setNotifsAnchor(null)
        }}
      />
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

export default Topbar;