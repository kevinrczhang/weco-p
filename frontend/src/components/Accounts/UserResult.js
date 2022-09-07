import React from "react";
import {
  Link,
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { ImageListItem } from '@material-ui/core';

//single card/grid container for a separate user. Should consider using this for match homepage instead of mapping
const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    backgroundColor: 'rgba(100, 100, 100, 1)',
    marginLeft: '13%',
    marginTop: '4.1%'
  },
  title: {
    fontSize: 14,
    align: 'justify'
  },
  pos: {
    marginBottom: 1,
    marginTop: '10%',
  },
  grid: {
    flexGrow: 1,
  },
  avatar: {},
  card: {
    height: 250,
    width: 250,
    flexWrap: 'wrap',
    backgroundColor: 'white',
  },
  button: {
    textAlign: 'center'
  }
}));

const Result = ({ user }) => {
  const classes = useStyles();
  let ProfileUrl = 'profile'

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <ImageListItem
      style={{
        height: '16rem',
        width: '16rem'
      }}
    >
      <Card className={classes.card} variant="outlined">
        <CardContent >
          <Avatar alt="profile image" src={user.profile_image} className={classes.avatar} />
          <Typography className={classes.title} color="textSecondary">
            {user.username}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">
            <Typography>
              <Link to={`${ProfileUrl}/${user.id}`} className={classes.button} >
                View Profile
              </Link>
            </Typography>
          </Button>
        </CardActions>
      </Card>
    </ImageListItem>
  );
};

export default Result;