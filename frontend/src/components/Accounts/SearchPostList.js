import React, { useState, useEffect } from "react";
import {
    Link,
    useRouteMatch,
} from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem  from '@material-ui/core/ImageListItem';
import ImageListItemBar  from '@material-ui/core/ImageListItemBar';
import Tooltip from '@material-ui/core/Tooltip';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Favorite from '@material-ui/icons/Favorite';
// import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { FaBars } from 'react-icons/fa';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import constants from '../../constants';

const BASE_URL = new URL('/posts/', constants.BASE_URL)

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: 'rgba(100, 100, 100, 1)',
        marginLeft: '13%',
        marginTop: '4%'
    },
    gridList: {
        width: 1920,
        height: 'auto',
    },
    gridListTile: {
        height: 200,
        width: 5,
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

export default function SearchPostList() {

    const classes = useStyles();

    let match = useRouteMatch();

    const [fetched, setFetched] = useState(false); // so site doesnt constantly fetch data from backend
    const [data, setData] = useState([]);
    const [category, setCategory] = useState();
    const [user, setUser] = useState(1); // should probs move this to store

    const [value, setValue] = useState(0); //for re-rendering

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [postId, setPostId] = React.useState();

    const handleClick = (e, pI) => {
        console.log("reached handleclick", pI);
        setPostId(pI);
        console.log("update postId", postId);
        setAnchorEl(e);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    async function deletePost(postId) {
        console.log("reached delete post", postId);
        if (postId) {
            const resp = await fetch(new URL(`post-view-set/${postId}`, BASE_URL), {
                method: 'DELETE',
            })
            setFetched(false);
            setValue(value => value + 1);
        }
        setAnchorEl(null);
    };

    useEffect(async () => {
        let url = new URL('post-view-set/', BASE_URL);

        if (category) {
            url = new URL(`post-view-set/${category}/cat_post_list/`);
        }

        if (!fetched) {
            setFetched(true);

            const resp = await fetch(url);

            const posts = await resp.json();

            setData(posts);
        }

    }, [value]);

    return (
        <div className={classes.root}>
            <ImageList cellHeight={300} cols={3} className={classes.gridList}>
                {data.map(post => {
                    return (
                        <ImageListItem  key={post.id} cols={1} rows={1.18} className={classes.gridListTile}>
                            <customTooltip title={post.text} placement="bottom-end" interactive leaveDelay={500}>
                                <Link to={`${match.url}/${post.id}`}>
                                    <img src={post.image} alt={post.title} className={classes.images} />
                                </Link>
                                <ImageListItemBar 
                                    title={post.title}
                                    subtitle={<span>Posted on {post.published_date} by: {post.author}</span>}
                                    actionIcon={
                                        <div>
                                            <IconButton
                                                aria-label="more"
                                                aria-controls="long-menu"
                                                aria-haspopup="true"
                                                onClick={e => handleClick(e.currentTarget, post.id)}
                                            >
                                                <FaBars style={{ color: '#FFF' }} />
                                            </IconButton>

                                            <Menu
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                PaperProps={{
                                                    style: {
                                                        width: '20ch',
                                                    },
                                                }}
                                            >
                                                <MenuItem onClick={e => deletePost(postId)}>
                                                    Delete {postId}
                                                </MenuItem>
                                            </Menu>
                                        </div>
                                    }
                                />
                            </customTooltip>
                        </ImageListItem >
                    )
                }
                )}
            </ImageList>
        </div>
    );

}