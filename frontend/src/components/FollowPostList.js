//reminder to add route to this page
import React, { useState, useEffect } from "react";
import {
    Link,
    useRouteMatch,
} from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import axios from "axios";
import FiveHundred from './500';
import { render } from "react-dom";
import constants from '../constants';

const BASE_URL = new URL('/posts/', constants.BASE_URL)

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        //backgroundColor: 'rgba(100, 100, 100, 1)',
        marginTop: '4.1%'
    },
    gridList: {
        width: 1920,
        height: 'auto',
    },
    gridListTile: {
        marginBottom: theme.spacing(-100),
    },
    images: {
        height: '100%',
        width: '100%',
        objectFit: 'cover'
    },
}));

const customTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);

export default function FollowPostList(get_user_id) {
    const classes = useStyles();
    let match = useRouteMatch();
    const [fetched, setFetched] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState();
    const [userFollows, setUserFollows] = useState([]);

    let current_user = get_user_id.get_user_id
    const limit = 10;
    let hasMore = false;
    let offset = 0;
    const handleScroll = (e) => {
        const bottom = document.getElementById('asdfsdfsf').scrollHeight - document.getElementById('asdfsdfsf').scrollTop === document.getElementById('asdfsdfsf').clientHeight;
        if (bottom && hasMore) {
            const query = new URLSearchParams({ l: limit, o: offset, u: current_user })
            axios.get(new URL(`following_posts/?${query.toString()}`, BASE_URL))
                .then(res => {
                    setData(res.data.posts)
                    hasMore = res.data.more_data
                    offset += limit
                })
                .catch(err => {
                    //setError(err.message)
                });
        }

    }
    useEffect(() => {
        const query = new URLSearchParams({ l: limit, o: offset, u: current_user })
        let url = new URL(`following_posts/?${query.toString()}`, BASE_URL)

        if (category) {
            url = new URL(`post-view-set/${category}/cat_post_list`, BASE_URL)
        }

        if (!fetched) {
            fetch(url, {credentials: "include"})
                .then(response => {
                    if (response.status === 401) {
   
                            window.location = '/login';
                    
                    }
                    setFetched(true);
                    return response.json();
                })
                .then(data => {
                    offset += limit
                    hasMore = data.more_data
                    setData(data.posts);
                })
                .catch(err=>{
                      render((props)=>{return (<FiveHundred/>)})
                });
            document.getElementById('asdfsdfsf').addEventListener('scroll', handleScroll, {
                    passive: true
                });
            return () => { document.getElementById('asdfsdfsf').removeEventListener('scroll', handleScroll) }
        }
    }, []);
if(loading){
    return (
        <div className={classes.root}>
                    <GridList cellHeight={300} cols={3} className={classes.gridList}>
                        {data.map(post => ( //set userFollows to which users the user is following
                            <GridListTile key={post.id} cols={1} rows={1.18} className={classes.gridListTile}>
                                <customTooltip title={post.text} placement="bottom-end" interactive leaveDelay={500}>
                                    <Link to={`${match.url}/${post.id}`}>
                                        <img src={post.image} alt={post.title} className={classes.images} />
                                    </Link>
                                    <GridListTileBar
                                        title={post.title}
                                        subtitle={<span>Posted on {post.published_date} by: {post.author}</span>}
                                        actionIcon={
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        icon={
                                                            <FavoriteBorder style={{ color: '#FFF' }} />
                                                        }
                                                        checkedIcon={
                                                            <Favorite />
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                    />
                                </customTooltip>
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
    );
}
else{
    {/* change to "loading..." when the page is finished + ready to go*/}
    return(<h1 style={{color:'black', marginLeft: '2%', marginTop: '5%'}}>Coming soon...</h1>)
}
}