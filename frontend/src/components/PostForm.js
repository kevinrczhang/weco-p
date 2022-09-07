import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  Redirect,
  useHistory,
} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Editor from "./Editor";
import FiveHundred from './500';
import { render } from "react-dom";
import constants from '../constants';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    textAlign: 'left',
    width: 800,
  },
  paper: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    margin: theme.spacing(2),
  },
  tField: {
    width: '100%',
  },
  upload: {
    color: 'rgba(0, 0, 0, 1)',
    height: '100%',
    display: "flex",
  },
  submit: {
    textAlign: 'right'
  },
}));

const BASE_URL = new URL('/posts/', constants.BASE_URL)

export default function PostForm(user) {
  let history = useHistory();

  const classes = useStyles();

  const [fetched, setFetched] = useState(false);  // so site doesnt constantly fetch data from backend
  // const [submitted, setSubmitted] = useState(false);

  // const [user, setUser] = useState([]); // for identifying author
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [image, setImage] = useState();
  const [category, setCategory] = useState([]);
  const [tags, setTags] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  let userID = user.userID.id
  const [inputCatValue, setInputCatValue] = React.useState('');
  const [inputTagValue, setInputTagValue] = React.useState('');

  useEffect(() => {
    if (!fetched) {
      fetch(new URL('tags-view-set/', BASE_URL), { credentials: 'include' })
        .then(response => { return response.json() })
        .then(data => { setTagsList(data) })
        .catch(err => { render((props) => { return (<FiveHundred />) }) });
      fetch(new URL('cat-view-set/', BASE_URL), { credentials: 'include' })
        .then(response => {
          if (response.status > 400) {
            return this.setState(() => {
              window.location = '/login'
            });
          }
          return response.json();
        })
        .then(data => { setCategoryList(data) })
        .catch(err => { render((props) => { return (<FiveHundred />) }) })
        .finally(data => {
          setFetched(true)
          setLoaded(true)
        })
    }
  }, []);

  const handleSubmitPost = async (event) => {
    event.preventDefault();

    const data = new FormData();

    const imageInput = document.querySelector('#image');
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = 'T' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + 'Z';

    setPublishedDate(date + time);

    //most bs thing ive ever done for a fix, but it works for now
    function appendCategory(e) {
      data.append("category", e.id)
    }
    async function appendTags(e) {
      if (e.id) {
        data.append("tags", e.id);
      }
      else {
        const newTag = new FormData();

        //console.log("newTag e: ", e);

        newTag.append("tag_name", e);

        const resp = await fetch(new URL('tags-view-set/', BASE_URL), {
          method: 'POST',
          body:
            newTag,
        })

        const tag = await resp.json();

        data.append("tags", JSON.stringify(tag.id));

        //console.log('response: ', tag);
      }
    }

    data.append("title", title);
    data.append("text", text);
    //data.append("created_date", createdDate);
    data.append("published_date", date + time);
    // Only add image if user uploaded one.
    if (imageInput.files[0]) {
      data.append("image", imageInput.files[0]);
    }
    data.append("author", userID); 
    category.forEach(appendCategory);

    await Promise.all(
      tags.map(async (e) => {
        await appendTags(e);
      }
      ))



    await fetch(new URL('post-view-set/', BASE_URL), {
      method: 'POST',
      body:
        data,
    })


  }

  const handleChange = (e) => {
    setText(e);
  }

  if (loaded) {
    return (
      < Grid className={classes.root} >

        <Paper component="form" className={classes.paper}>
          <TextField
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="TITLE"
            variant="outlined"
            className={classes.tField} />
        </Paper>

        <Paper component="form" className={classes.paper}>
          <Editor
            id="text"
            value={text}
            onChange={handleChange}
            label="DESCRIPTION"
            height={150} />
          {/* <TextField
                id="text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="DESCRIPTION"
                variant="outlined"
                multiline
                minRows="3"
                className={classes.tField} /> */}
        </Paper>

        <Button
          variant="contained"
          component="label"
          className={classes.upload}
        >
          IMAGE
          <input
            id="image"
            value={image}
            onChange={e => setImage(e.target.value)}
            type="file"
            multiple
            hidden
          />
        </Button>

        <Grid container>
          <Grid item xs={false} sm={8} md={7}>
            <Paper component="form" className={classes.paper}>
              <Autocomplete
                multiple
                id="category"
                value={category}
                onChange={(e, newValue) => setCategory(newValue)}
                inputValue={inputCatValue}
                onInputChange={(event, newInputValue) => {
                  setInputCatValue(newInputValue);
                }}
                options={categoryList}
                getOptionLabel={(cat) => cat.category_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="CATEGORIES"
                  />
                )}
              />
            </Paper>
          </Grid>

          <Grid item xs={false} sm={4} md={5}>
            <Paper component="form" className={classes.paper}>
              <Autocomplete
                freeSolo
                multiple
                id="tags"
                value={tags}
                inputValue={inputTagValue}
                onChange={(e, newValue) => {
                  setTags(newValue)
                }}
                onInputChange={(event, newInputValue) => {
                  (newInputValue != null) ? setInputTagValue(newInputValue) : setInputTagValue("Add Tags"); //todo: grab textfield value later
                }}
                options={tagsList}
                getOptionLabel={(tag) => tag.tag_name} //missing action??
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="TAGS"
                  />
                )}
              />
            </Paper>
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end">
          <Button onClick={handleSubmitPost}>Submit</Button>
        </Grid>

      </Grid >
    );
  }
  else {
    return (<h1>Loading...</h1>)
  }
}