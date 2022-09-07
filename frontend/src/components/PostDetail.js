import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
    useParams,
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FiveHundred from './500';
import { render } from "react-dom";
import { useHistory } from "react-router";
import constants from '../constants';

const BASE_URL = new URL(constants.BASE_URL)

const useStyles = makeStyles((theme) => ({
    paper: {
        paddingTop: theme.spacing(20),
        paddingLeft: theme.spacing(50),
        paddingRight: theme.spacing(50),
        textAlign: 'left',
        width: 1920,
        height: 'auto',
    },
    formPaper: {
        color: 'rgba(255, 255, 255, 1)',
    },
    tField: {
        width: '100%',
    },
    button: {
        color: 'rgba(0, 0, 0, 1)',
        marginLeft: "90%",
        margin: theme.spacing(1),
    },

    comments: {
        color: 'black',
        marginBottom:'2%',
        fontSize: 20

    },
    commentAuthor:{
        fontWeight: 'bold',
        fontSize: 20,
        display: 'inline',
        cursor: 'pointer'
    },
    commentDate:{
        fontSize: 17,
        display: 'inline',
        color: '#6d706d'
    }
}));

export default function PostDetail(UserID) {

    const classes = useStyles();

    const { PostId } = useParams();

    const [fetched, setFetched] = useState(false); // so site doesnt constantly fetch data from backend
    const [commentsFetched, setCommentsFetched] = useState(false);
    const [post, setPost] = useState([]);
    const [category, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [author, setAuthor] = useState();
    let history = useHistory();
    const [comments, setComments] = useState([]);
    const loading = post.length === 0
    const [text, setText] = useState();
    let user = UserID.UserID
    const [value, setValue] = useState(0); //for re-rendering
    const [userLikes, setUserLikes] = useState([]);
    const [postLikes, setPostLikes] = useState([]);
    useEffect(async() => {

        //have to wait til the state mutates first, and then fetch for author id
        let url = new URL(`/posts/post-view-set/${PostId}`, BASE_URL);

        let commentUrl = new URL(`/posts/comment-view-set/?p=${PostId}`, BASE_URL);

        fetch(url)
            .then(response => {
                if (response.status > 400) {
                    return this.setState(() => {
                        return { placeholder: "Something went wrong!" };
                    });
                }
                setFetched(true)
                return response.json();
            })
            .then(post => {
                setPost(post);
                setCategories(post.category);
                setTags(post.tags);

            })
            .catch(err=>{
                  render((props)=>{return (<FiveHundred/>)})
            });

        if (!commentsFetched) {
            fetch(commentUrl, { credentials: 'include' })
                .then(response => {
                    if (response.status > 400) {
                        return { placeholder: "Something went wrong!" };
                    }
                    setCommentsFetched(true)
                    return response.json();
                })
                .then(comment => {
                    setComments(comment);
                })
                .catch(err=>{
                  render((props)=>{return (<FiveHundred/>)})
            });

        }

        const resp2 = await fetch(new URL('/posts/likes-view-set/', BASE_URL), { credentials: 'include' });

        const likes = await resp2.json();

        setPostLikes(likes.filter(l => l.post == post));

        setUserLikes(likes.filter(l => l.user == user));

    }, [value]);

    useEffect(() => {
        if (!post.author) {
            return undefined;
        }
        axios.get(new URL(`/accounts/details/${post.author}`, BASE_URL), { credentials: 'include' })
            .then(response => {
                setAuthor(response.data);

            })
            .catch(error => {
                if (error.response.status === 404) {
                    //window.location = '/Login'
                }
            })
    }, [post])
    function CommentList(){
        return (
        comments.filter(c => c.post == PostId).map(c => (
            <div> 
            <Typography className={classes.commentAuthor} onClick={()=> history.push('/profile/' + c.author)} inline>
                {c.username + " "} 
            </Typography>
            
            <Typography className={classes.commentDate} inline>
                 on {c.created_date}
                </Typography>
                
            <Typography  className={classes.comments}>
                {c.text}
            </Typography>
            </div>
        ))
        )

    }
    useEffect(() => {
        if (author === undefined) {
            return undefined;
        }

    }, [author])

    async function handleSubmitPost(event){
        event.preventDefault();

        const data = new FormData();

        data.append("text", text);
        data.append("author", user);
        data.append("post", PostId);
        data.append("approved_comment", true);
        const response = await fetch(new URL('/posts/comment-view-set/', BASE_URL), {
            method: 'POST',
            body: data,
            credentials: 'include'
        })
        const result = await response.json()
        setComments(result)
        setValue(value => value + 1);
        setText("");
    };

    function checkLiked(post) {
        for (let i = 0; i < userLikes.length; i++) {
            if (userLikes[i].post == post.id) {
                return true;
            }
        }
        return false;
    }

    async function updateLiked(e, isLiked, post) {
        //console.log("updateLiked: ", e, isLiked);
        if (isLiked) {
            for (let i = 0; i < userLikes.length; i++) {
                if (userLikes[i].post == post.id) {
                    const resp = await fetch(new URL(`/posts/likes-view-set/${userLikes[i].id}`, BASE_URL), {
                        method: 'DELETE',
                    })
                    break;
                }
            }
        }
        else {
            const likesForm = new FormData();
            likesForm.append("user", user);
            likesForm.append("post", post.id);
            likesForm.append("liked", true);
            fetch(new URL('/posts/likes-view-set/', BASE_URL), {
                method: 'POST',
                body:
                    likesForm,
            })
        }
        setValue(value => value + 1);
    }

    return (author !== undefined ?
        <Grid item xs={12} className={classes.paper}>
            <Typography variant="h4">
                {post.title}
            </Typography>
            
            <FormControlLabel
                control={
                    <Checkbox
                        icon={
                            <FavoriteBorder />
                        }
                        checkedIcon={
                            <Favorite />
                        }
                    />
                }
                onChange={e => updateLiked(e.target.value, checkLiked(post), post)}
                checked={checkLiked(post)}
            />
            <Typography variant="h6" gutterBottom>
                Likes: {postLikes.length}
            </Typography>

            <Typography variant="h6" gutterBottom >
                <Avatar src={new URL(author.profile_image, BASE_URL).href} onClick={()=> history.push('/profile/' + post.author)}/> 
                
                Posted by {author.username}
            </Typography>
            <Typography variant="h6">
                {post.published_date}
            </Typography>

            <Typography variant="h6">
                Categories:
                {category.map(cat => (
                    <b>{cat}, </b>
                ))}
            </Typography>

            <Typography variant="h6">
                Tags:
                {tags.map(tag => (
                    <b>{tag}, </b>
                ))}
            </Typography>

            <img src={new URL(post.image, BASE_URL).href} alt={post.title} />

            <Typography dangerouslySetInnerHTML={{ __html: post.text }} />

            <Typography variant="h5" style={{marginTop:"10%"}}>
                Comments
            </Typography>

            <Paper component="form" className={classes.formPaper}>
                <TextField
                    id="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Write something"
                    multiline rows={4}
                    variant="outlined"
                    className={classes.tField} />
            </Paper>

            <Button
                
                onClick={handleSubmitPost}
                variant="contained"
                component="label"
                className={classes.button}
            >
                Submit
            </Button>
            <div>
                {CommentList()}
            </div>

        </Grid>
        : (<h1>loading.. {console.log(author)}.</h1>)

    );

}