import React, { useState, useEffect } from "react";
import {
    Link,
    useRouteMatch,
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import constants from '../constants';

const BASE_URL = new URL(constants.BASE_URL)

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
}));

export default function RecommendedPostList() {

    const classes = useStyles();

    let match = useRouteMatch();

    const [fetched, setFetched] = useState(false); // so site doesnt constantly fetch data from backend
    const [data, setData] = useState([]);
    const [userInterest, setInterest] = useState([]);
    const [tag, setTag] = useState();

    useEffect(() => {
        let url = new URL('/posts/post-view-set/', BASE_URL);

        // precondition: tag names for posts and tag names for users share the same names
        let accountsUrl = new URL(`/accounts/${tag}/get_general/`, BASE_URL); // whichever url to get users interests .json

        fetch(accountsUrl)
            .then(response => {
                if (response.status > 400) {
                    return this.setState(() => {
                        return { placeholder: "Something went wrong!" };
                    });
                }
                setFetched(true);
                return response.json();
            })
            .then(userInterest => {
                setInterest(userInterest);
            });

        setTag(userInterest[Math.floor(Math.random() * userInterest.length)]); // gets a random interest from userInterest

        if (tag) {
            url = new URL(`${tag}/tags_post_list/`, url); // gets posts from the randomly selected userInterest
        }

        if (!fetched) {
            fetch(url)
                .then(response => {
                    if (response.status > 400) {
                        return this.setState(() => {
                            return { placeholder: "Something went wrong!" };
                        });
                    }
                    setFetched(true);
                    return response.json();
                })
                .then(data => {
                    setData(data);
                });
        }
    }, []);

        return (
            <div className={classes.root}>
                <GridList cellHeight={300} cols={3} className={classes.gridList}>
                    <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                        <ListSubheader component="div">Recommended because you have shown interest in </ListSubheader> {tag}
                    </GridListTile>
                    {data.filter(p => p.tag.includes(tag)).map(post => ( //set userFollows to which users the user is following
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