import React, { useState, useEffect } from 'react'
import { useParams, Redirect, NavLink } from 'react-router-dom'
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import { HiDotsVertical, HiCog } from 'react-icons/hi'
import {
  FiUsers,
  FiUser,
  FiLink,
  FiTwitter,
  FiInstagram
} from 'react-icons/fi'
import {
  FaFacebookSquare,
  FaLinkedinIn,
  FaYoutube,
  FaTwitch
} from 'react-icons/fa'
import constants from '../../constants'
import { useHistory } from "react-router";
import Linkify from 'react-linkify';
const BASE_URL = new URL(constants.BASE_URL)
const FETCH_CONFIG = {
  method: 'GET',
  credentials: 'include',
  mode: 'cors'
}
const EXTERN_LINK_NAMES = constants.EXTERN_LINK_NAMES
const EXTERN_LINK_ICONS = {
  website: FiLink,
  twitter: FiTwitter,
  facebook: FaFacebookSquare,
  instagram: FiInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  twitch: FaTwitch
}

const useRootStyles = makeStyles({
  root: {
    backgroundColor: 'rgb(248, 248, 248)',
    // The same as the height of the toolbar.
    marginTop: '64px',
    flexGrow: '1',
    height: 'max-content',
    paddingBottom: '2.5rem',
    minHeight: 'calc(100vh - 64px - 2.5rem)'
  },
  profileMain: {
    display: 'flex'
  },
})
const useSettingsStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'end',
    width: 'calc(100% - 1rem)',

    paddingTop: '0.8rem',
    paddingRight: '1rem',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit'
  }
})
const useTitleStyles = makeStyles({
  root: {
    padding: '0 4rem',
    display: 'flex',
    flexDirection: 'row',
    fontFamily: '"Barlow Condensed", Arial, sans-serif',
    color: 'rgb(70, 70, 70)'
  },
  image: {
    borderRadius: '50%',
    backgroundColor: 'rgb(221, 196, 171)',
    width: '18rem',
    height: '18rem',
    padding: '10px',
    objectFit: 'cover'
  },
  title: {
    flexGrow: '1',
    paddingLeft: '1.5rem',
    fontSize: '2.5rem',
  },
  titleUsername: {
    margin: '0.6rem 0',
  },
  titleBio: {
    margin: '0.6rem 0',
    fontSize: '1.3rem'
  },
})
const useSidebarStyles = makeStyles({
  root: {
    width: '14rem',
    // Set min-width to avoid shrinking under flexbox.
    minWidth: '14rem',
    height: 'max-content',
    margin: '2.25rem 2.5rem 0 5.5rem',
    padding: '1rem',
    border: '1px solid rgb(100, 100, 100)',
    borderRadius: '5px',

    fontSize: '0.875rem',
  },
  usersIcon: {
    color: 'black',
    height: '1.1rem',
    width: '1.1rem',
  },
  followUserButtonContainer: {
    display: 'block',
    margin: '0.8rem 1rem',
  },
  followUserButton: {
    padding: '0.5rem',
    width: '12rem',

    borderRadius: '6px',

    fontSize: '1rem',
    fontFamily: '"Barlow Condensed", Arial, sans-serif'
  },
  followersInfoButton: {
    textTransform: 'none',
    fontFamily: 'inherit',
    letterSpacing: 'inherit'
  },
  followersInfoDialog: {
    minWidth: '12rem'
  }
})
const usePostListItemStyles = makeStyles({
  root: {
    width: '18rem',
    height: '18rem',
    margin: '0.75rem',
    color: 'rgb(250, 250, 250)',
    borderRadius: '20px',
    backgroundColor: 'rgb(84, 83, 82)',

    boxShadow: '-10px 6px rgba(134, 134, 133, 0.75)',
  },
  image: {
    maxWidth: '16rem',
    maxHeight: '16rem',
    width: 'auto',
    height: 'auto',

    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  itemBar: {
    borderRadius: '0 0 20px 20px',
    height: '4.5rem'
  },
  itemBarTitle: {
    fontSize: '1.4rem',
    padding: '2px',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  itemBarSubtitle: {
    fontSize: '0.8rem',
    padding: '2px',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  postLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
})

// A bunch of JSDoc typedefs for intellisense.

/**
 * @typedef {Object} Post
 * @prop {string} publishedDate
 * @prop {string} author
 * @prop {string} title
 * @prop {string} image
 * @prop {string} text
 * @prop {string} id
 *
 * @typedef {Object} InterestOrTag
 * @prop {string} name
 * @prop {number} id
 */

/**
 * @typedef {Object} ProfileSettingsClasses
 * @prop {string} link
 */

/**
 * @typedef {Object} User
 * @prop {string} username
 * @prop {string} id
 * @prop {string} profileImage
 *
 * @typedef {Object} UserListProps
 * @prop {Array<User>} users
 *
 * @typedef {Object} LimitedListProps
 * @prop {number} max
 * @prop {Array<React.ReactNode>} items
 *
 * @typedef {Object} InterestOrTagListProps
 * @prop {'Interests'|'Interest Tags'} listType
 * @prop {Array<InterestOrTag>} interestsOrTags
 *
 * @typedef {Record<'website'|'facebook'|'twitter'|'instagram'|'tiktok', string>} Links
 */

/**
 * @typedef {Object} ProfileDetails
 * @prop {string} username
 * @prop {string} biography
 * @prop {string} profileImage
 * @prop {string} backgroundImage
 * @prop {Array<InterestOrTag>} tags
 * @prop {Array<InterestOrTag>} interests
 * @prop {Array<Post>} posts
 * @prop {Array<string>} following
 * @prop {Array<string>} followers
 * @prop {boolean} isFollowing
 * @prop {Links} links
 *
 * @typedef {Object} UserProfileProps
 * @prop {string} currentUserId The ID of the current user.
 *
 * @typedef {Object} ProfileSettingsProps
 * @prop {boolean} isOwnProfile
 *
 * @typedef {Object} ProfileTitleProps
 * @prop {ProfileDetails} profileDetails
 *
 * @typedef {Object} ProfileSidebarProps
 * @prop {() => void} follow
 * @prop {() => void} unfollow
 * @prop {boolean} isOwnProfile
 * @prop {ProfileDetails} profileDetails
 *
 * @typedef {Object} ProfilePostListProps
 * @prop {boolean} isOwnProfile
 * @prop {Array<Post>} fetchedPosts
 * @prop {(id: string) => void} deletePost
 *
 * @typedef {Object} ProfilePostListItemProps
 * @prop {Post} post
 * @prop {boolean} isOwnProfile
 * @prop {(id: string) => void} deletePost
 *
 * @typedef {Object} ExternLinksProps
 * @prop {Links} links
 */

/**
 * Get the current profile's biography or return a default.
 * @param {ProfileDetails} profile The profile of the user.
 * @returns {string}
 */
function bioOrDefault (profile) {
  if (profile.biography) { return <Linkify> {profile.biography} </Linkify> }

  return 'This user likes to keep an air of mystery around them...'
}

/**
 * Fetches all the posts of the specified profile.
 * @param {string} profileId The profile to fetch the posts from.
 * @returns {Promise<Response>}
 */
function fetchPosts (profileId) {
  return fetch(new URL(`/accounts/your_posts/${profileId}`, BASE_URL), FETCH_CONFIG)
}

/**
 * Is the current user following the current profile?
 * @param {string} profileId The profile to check.
 * @returns {Promise<Response>}
 */
function fetchIsFollowing (profileId) {
  return fetch(new URL(`/accounts/is_following?u=${profileId}`, BASE_URL), FETCH_CONFIG)
}

/**
 * Fetch all the followers of the current profile.
 * @param {string} profileId The profile to fetch the followers from.
 * @returns {Promise<Response>}
 */
function fetchFollowers (profileId) {
  return fetch(new URL(`/accounts/followers?u=${profileId}`, BASE_URL), FETCH_CONFIG)
}

/**
 * Gets the menu items for a user's profile.
 * @param {ProfileSettingsClasses} classes CSS class names.
 * @param {boolean} isOwnProfile Is the profile the user's own profile?
 * @returns {Array<JSX.Element>}
 */
function getSettingsMenuItems (classes, isOwnProfile) {
  const elems = []

  // This function is designed like this so if we every need to add anything
  // else, it's easy and straightforward.

  if (isOwnProfile) {
    elems.push((
      <MenuItem key='update-profile-link'>
        <NavLink
          to='/UpdateProfile'
          className={classes.link}
        >
          Update Profile
        </NavLink>
      </MenuItem>
    ))
  }

  if (!isOwnProfile) {
    elems.push((
      <MenuItem key='other-action' disabled>
        Other action...
      </MenuItem>
    ))
  }

  return elems
}

/**
 * Transform the parsed JSON array of posts into the format expected
 * by this component.
 * @param {Array<any>} posts The parsed JSON array from the server.
 * @returns {Array<Post>}
 */
function transformPosts (posts) {
  return posts.map(post => ({
    publishedDate: new Date(post.published_date).toLocaleString(),
    author: post.author,
    title: post.title,
    image: post.image,
    text: post.text,
    id: post.id
  }))
}

/**
 * Transform the parsed JSON array of interests into the format
 * expected by this component.
 * @param {Array<any>} interests The list of interests received from the server.
 * @returns {Array<InterestOrTag>}
 */
function transformInterests (interests) {
  return interests.map(val => ({ name: val.interest_name, id: val.id }))
}

/**
 * Transform the parsed JSON array of tags into the format
 * expected by this component.
 * @param {Array<any>} tags The list of tags received from the server.
 * @returns {Array<InterestOrTag>}
 */
function transformInterestTags (tags) {
  return tags.map(val => ({ name: val.interest_tag_name, id: val.id }))
}

/**
 * Creates a HTML link element (<a>) for the specified external location.
 * @param {string} link The link contents.
 * @param {string} externName The external location to link to.
 * @returns {JSX.Element}
 */
function toExternLink (link, externName) {
  switch (externName) {
    case 'website': {
      // Validation
      new URL(link)
      return (<Link href={link}>&nbsp;{link}</Link>)
    }
    case 'twitter': {
      const url = new URL(link, 'https://twitter.com')
      return (<Link href={url}>@{link}</Link>)
    }
    case 'facebook': {
      const url = new URL(link, 'https://facebook.com')
      return (<Link href={url}>@{link}</Link>)
    }
    case 'instagram': {
      const url = new URL(`${link}/`, 'https://instagram.com')
      return (<Link href={url}>@{link}</Link>)
    }
    case 'linkedin': {
      const url = new URL(`${link}/`, 'https://linkedin.com/in/')
      return (<Link href={url}>@{link}</Link>)
    }
    case 'youtube': {
      // Validation
      new URL(link)
      return (<Link href={link}>&nbsp;Youtube Channel</Link>)
    }
    case 'twitch': {
      const url = new URL(link, 'https://twitch.tv')
      return (<Link href={url}>&nbsp;{link}</Link>)
    }
    default: {
      throw new TypeError('Unrecognized external location!')
    }
  }
}

/**
 * Renders a list of users.
 * @param {UserListProps} props Component props.
 * @returns {JSX.Element}
 */
function UserList (props) {
  const users = props.users
  let ProfileUrl = 'profile'

  return (
    <List>
      {users.map(user => (
        <ListItem key={user.username}>
          <ListItemAvatar>
            <Avatar>
              {/* Placeholder icon */}
              <FiUser />
            </Avatar>
          </ListItemAvatar>
          <Typography>
            <NavLink to={`/${ProfileUrl}/${user.id}`} style={{ textDecoration: 'none', color: '#000000' }}>
              <ListItemText>{user.username}</ListItemText>
            </NavLink>
          </Typography>
        </ListItem>
      ))}
    </List>
  )
}

/**
 * A limited list limits items to a specified max.
 * @param {LimitedListProps} props Component props.
 */
function LimitedList (props) {
  const thereIsMore = (
    <ListItem style={{ padding: '0.1rem 0.8rem' }}>
      <Typography variant='caption'>{props.items.length - props.max} more...</Typography>
    </ListItem>
  )

  return (
    <List>
      {props.items.slice(0, props.max).map((item, i) => (
        <ListItem
          key={i}
          style={{ padding: '0.1rem' }}
        >
          {item}
        </ListItem>
      ))}
      {props.items.length - props.max > 0
        ? thereIsMore
        : null
      }
    </List>
  )
}

/**
 * Renders a list of interests or interest tags.
 * @param {InterestOrTagListProps} props Component props.
 * @returns {JSX.Element}
 */
function InterestOrTagList (props) {
  const { interestsOrTags, listType } = props
  const dialogTitleId = `${listType.toLowerCase()}-list-dialog-title`

  const [fullListOpen, setFullListOpen] = useState(false)

  const list = (
    <LimitedList
      max={2}
      items={interestsOrTags.map(interestOrTag => (
        <Chip
          variant='outlined'
          label={interestOrTag.name}
          style={{ padding: '0.15rem' }}
        />
      ))}
    />
  )
  const noInterestsOrTags = (
    <Typography
      variant='caption'
      style={{ padding: '0.1rem 0.8rem', fontWeight: 'bold' }}
    >
      No {listType}
    </Typography>
  )

  return (
    <>
      <div style={{ marginTop: '0.5rem' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='subtitle1' style={{ fontWeight: 'bold' }}>
            {listType}
          </Typography>
          <Button
            variant='text'
            style={{ height: '1.8rem' }}
            onClick={() => setFullListOpen(true)}
            disabled={interestsOrTags.length < 1}
          >
            View all
          </Button>
        </div>
        {interestsOrTags.length > 0
          ? list
          : noInterestsOrTags
        }
      </div>
      <div>
        <Dialog
          open={fullListOpen}
          aria-labelledby={dialogTitleId}
          onClose={() => setFullListOpen(false)}
          PaperProps={{ style: { minWidth: '12rem' } }}
        >
          <DialogTitle id={dialogTitleId}>{listType}</DialogTitle>
          <List>
            {interestsOrTags.map(interestOrTag => (
              <ListItem key={interestOrTag.id} style={{ padding: '0.2rem 0.8rem' }}>
                <Chip variant='outlined' label={interestOrTag.name} />
              </ListItem>
            ))}
          </List>
        </Dialog>
      </div>
    </>
  )
}

/**
 * A component to render a small settings cog for managing the profile's
 * settings, be it updating the profile, or reporting a user (?).
 * @param {ProfileSettingsProps} props Component props.
 * @returns {JSX.Element}
 */
function ProfileSettings (props) {
  const classes = useSettingsStyles()
  const { isOwnProfile } = props

  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const menuOpen = Boolean(menuAnchorEl)

  function closeMenu () {
    setMenuAnchorEl(null)
  }

  const items = getSettingsMenuItems(classes, isOwnProfile)

  return (
    <div className={classes.root}>
      <IconButton
        aria-label='settings'
        aria-controls='settings-menu'
        aria-haspopup='menu'
        onClick={e => setMenuAnchorEl(e.currentTarget)}
      >
        <HiCog style={{ height: '3rem', width: '3rem' }} />
      </IconButton>
      <Menu
        id='settings-menu'
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={closeMenu}
        PaperProps={{ style: { width: '20ch' } }}
      >
        {items}
      </Menu>
    </div>
  )
}

/**
 * The profile title container.
 * @param {ProfileTitleProps} props Component props.
 * @returns {JSX.Element}
 */
function ProfileTitle (props) {
  const classes = useTitleStyles()
  const profile = props.profileDetails

  return (
    <header id='user-profile-header' className={classes.root}>
      <img
        alt='User Profile'
        className={classes.image}
        src={new URL(profile.profileImage, BASE_URL).href}
      />
      <div className={classes.title}>
        <h1 className={classes.titleUsername}>{profile.username}</h1>
        <p className={classes.titleBio}>
          {bioOrDefault(profile)}
        </p>
      </div>
    </header>
  )
}

/**
 * Renders a list of external links.
 * @param {ExternLinksProps} props Component props.
 * @returns {JSX.Element}
 */
function ExternLinks (props) {
  const { links } = props
  const linkNames = EXTERN_LINK_NAMES
    .filter(linkName => (linkName in links) && (!!links[linkName]))

  return (
    <List>
      {linkNames.map(linkName => {
        const Icon = EXTERN_LINK_ICONS[linkName]
        return (
          <ListItem key={linkName}>
            <Icon />
            &nbsp;
            {toExternLink(links[linkName], linkName)}
          </ListItem>
        )
      })}
    </List>
  )
}

/**
 * The profile sidebar, for displaying miscellaneous stats.
 * @param {ProfileSidebarProps} props Component props.
 * @returns {JSX.Element}
 */
function ProfileSidebar (props) {
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false)
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false)

  const classes = useSidebarStyles()
  const profile = props.profileDetails

  const tooltipTitle = props.isOwnProfile
    ? 'You cannot follow yourself'
    : profile.isFollowing
      ? 'Unfollow this user'
      : 'Follow this user'

  function onClick () {
    if (profile.isFollowing) {
      props.unfollow()
    } else {
      props.follow()
    }
  }

  return (
    <aside id='user-profile-sidebar' className={classes.root}>
      <div className={classes.followersInfo}>
        <Button
          onClick={() => setFollowersDialogOpen(true)}
          classes={{ root: classes.followersInfoButton }}
          variant='text'
        >
          <FiUsers className={classes.usersIcon} />
          &nbsp;&nbsp;
          {profile.followers.length} followers
        </Button>
        -
        <Button
          onClick={() => setFollowingDialogOpen(true)}
          classes={{ root: classes.followersInfoButton }}
          variant='text'
        >
          {profile.following.length} following
        </Button>
      </div>

      <div>
        <Dialog
          open={followersDialogOpen}
          aria-labelledby='followers-dialog-title'
          onClose={() => setFollowersDialogOpen(false)}
          classes={{ paper: classes.followersInfoDialog }}
        >
          <DialogTitle id='followers-dialog-title'>Followers</DialogTitle>
          {/**
                     * TODO: Show more data than just follower's username.
                     * Maybe also show their profile picture and a bit of their bio?
                     * (02/11/2022) Take-Some-Bytes */}
          {profile.followers.length > 0
            ? <UserList
              users={profile.followers.map(follower => ({
                username: follower.username,
                id: follower.id
              }))}
            />
            : <DialogContent>
              <DialogContentText>No followers</DialogContentText>
            </DialogContent>
          }
        </Dialog>
        <Dialog
          open={followingDialogOpen}
          aria-labelledby='following-dialog-title'
          onClose={() => setFollowingDialogOpen(false)}
          classes={{ paper: classes.followersInfoDialog }}
        >
          <DialogTitle id='following-dialog-title'>Following</DialogTitle>
          {/**
                     * TODO: See above.
                     * (02/11/2022) Take-Some-Bytes */}
          {profile.following.length > 0
            ? <UserList
              users={profile.following.map(following => ({
                username: following.username,
                id: following.id
              }))}
            />
            : <DialogContent>
              <DialogContentText>Following no one</DialogContentText>
            </DialogContent>
          }
        </Dialog>
      </div>

      <Tooltip
        title={tooltipTitle}
        placement='bottom'
        leavedelay={500}
        interactive
        arrow
      >
        {/* <span> so tooltip will show even if button is disabled */}
        <span className={classes.followUserButtonContainer}>
          <Button
            classes={{ root: classes.followUserButton }}
            disabled={props.isOwnProfile}
            variant='outlined'
            onClick={onClick}
            size='small'
          >
            {profile.isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        </span>
      </Tooltip>

      <Divider />
      <InterestOrTagList interestsOrTags={profile.interests} listType='Interests' />
      <Divider />
      <InterestOrTagList interestsOrTags={profile.tags} listType='Interest Tags' />

      {Object.values(profile.links).some(link => !!link) ? <Divider /> : null}
      <ExternLinks links={profile.links} />
    </aside>
  )
}

/**
 * An item in the profile post list.
 * @param {ProfilePostListItemProps} props Component props.
 * @returns {JSX.Element}
 */
function ProfilePostListItem (props) {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const menuOpen = Boolean(menuAnchorEl)
  const history = useHistory()

  // Redirects user to post detail page 
  function PostDetailRedirect (id) {
    history.push('/PostList/' + id)
  }
  function closeMenu () {
    setMenuAnchorEl(null)
  }

  const post = props.post
  const classes = usePostListItemStyles()

  return (
    /**
     * TODO: Make tooltip show only *some* post text.
     * Right now it tries to show the entire post.
     * (01/05/2022) Take-Some-Bytes */
    <Tooltip key={post.id} title={post.text} placement='bottom' leavedelay={500} interactive arrow>
      <ImageListItem
        onClick={e => PostDetailRedirect(post.id)}
        className={classes.root}
      >
        <img src={new URL(post.image, BASE_URL).href} alt={post.title} className={classes.image} />
        <ImageListItemBar
          classes={{
            root: classes.itemBar,
            title: classes.itemBarTitle,
            subtitle: classes.itemBarSubtitle,
          }}
          title={(
            post.title
          )}
          /**
           * TODO: Show author's name, not ID.
           * (01/05/2022) Take-Some-Bytes */
          subtitle={<span>Posted {post.publishedDate} by {post.author}</span>}
          actionIcon={
            <div onClick={e => e.stopPropagation()}>
              <IconButton
                aria-label='more'
                aria-controls='long-menu'
                aria-haspopup='true'
                onClick={e => setMenuAnchorEl(e.currentTarget)}
              >
                <HiDotsVertical style={{ color: '#FFF' }} />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={closeMenu}
                PaperProps={{ style: { width: '20ch' } }}
              >
                <MenuItem
                  onClick={() => {
                    setMenuAnchorEl(null)
                    props.deletePost(post.id)
                  }}
                  disabled={!props.isOwnProfile}
                >
                  Delete {post.id}
                </MenuItem>
              </Menu>
            </div>
          }
        />
      </ImageListItem>
    </Tooltip>
  )
}

/**
 * The profile post list. Displays the posts made by the current user.
 * @param {ProfilePostListProps} props Component props.
 * @returns {JSX.Element}
 */
function ProfilePostList (props) {
  const posts = props.posts

  return (
    <ImageList cols={0}>
      {posts.map(post => (
        <ProfilePostListItem
          key={post.id}
          post={post}
          isOwnProfile={props.isOwnProfile}
          deletePost={props.deletePost}
        />
      ))}
    </ImageList>
  )
}

/**
 * Renders a User's profile page.
 *
 * The view will differ slightly if the user is viewing their own profile.
 * @param {UserProfileProps} props Component props.
 * @returns {JSX.Element}
 */
export default function UserProfile (props) {
  /**
   * @type {{ profileId: string }}
   */
  const { profileId } = useParams()
  const [profileFetched, setProfileFetched] = useState(false)
  const [profileDetails, setProfileDetails] = useState({
    username: '',
    biography: '',
    profileImage: '',
    backgroundImage: '',
    tags: [],
    interests: [],
    posts: [],
    following: [],
    followers: [],
    isFollowing: false,
    links: {
      website: '',
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: '',
    }
  })
  const classes = useRootStyles()

  const isOwnProfile = Number(profileId) === Number(props.currentUserId)

  /**
   * Deletes the post with the specified ID.
   * @param {string} id The post ID.
   */
  function deletePost (id) {
    const fetchDeleteConfig = {
      ...FETCH_CONFIG,
      method: 'DELETE'
    }

    // First delete the post.
    fetch(new URL(`/posts/post-view-set/${id}`, BASE_URL), fetchDeleteConfig)
      // Then fetch all posts again.
      .then(() => fetchPosts(profileId))
      .then(res => res.json())
      .then(posts => {
        setProfileDetails(prev => ({
          ...prev,
          posts: transformPosts(posts)
        }))
      })
      .catch(err => {
        console.error(err)
      })
  }

  /**
   * Makes the current user follow the profile they are currently using.
   */
  function followThisProfile () {
    const fetchFollowProfileConfig = {
      ...FETCH_CONFIG,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        follow: profileDetails.username
      })
    }

    fetch(new URL('/accounts/follow/', BASE_URL), fetchFollowProfileConfig)
      // Get following status again.
      .then(() => Promise.all([fetchFollowers(profileId), fetchIsFollowing(profileId)]))
      .then(arr => Promise.all(arr.map(res => res.json())))
      .then(([followers, isFollowing]) => {
        setProfileDetails(prev => ({
          ...prev,
          followers: followers.users,
          isFollowing: Boolean(isFollowing)
        }))
      })
      .catch(err => {
        console.error(err)
      })
  }

  /**
   * Makes the current user unfollow the profile they are currently using.
   */
  function unfollowThisProfile () {
    const fetchUnfollowProfileConfig = {
      ...FETCH_CONFIG,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unfollow: profileDetails.username
      })
    }

    fetch(new URL('/accounts/unfollow/', BASE_URL), fetchUnfollowProfileConfig)
      // Get following status again.
      .then(() => Promise.all([fetchFollowers(profileId), fetchIsFollowing(profileId)]))
      .then(arr => Promise.all(arr.map(res => res.json())))
      .then(([followers, isFollowing]) => {
        setProfileDetails(prev => ({
          ...prev,
          followers: followers.users,
          isFollowing: Boolean(isFollowing)
        }))
      })
      .catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
    /**
     * XXX: DO NOT CHANGE THE ORDER OF THIS ARRAY.
     * The order matters for subsequent processing
     * (02/08/2022) Take-Some-Bytes */
    const requests = [
      fetch(new URL(`/accounts/details/${profileId}`, BASE_URL), FETCH_CONFIG),
      fetchPosts(profileId),
      fetch(new URL(`/accounts/following?u=${profileId}`, BASE_URL), FETCH_CONFIG),
      fetchFollowers(profileId),
      fetchIsFollowing(profileId),
    ]

    Promise.all(requests)
      // Parse all JSON.
      .then(arr => Promise.all(arr.map(res => res.json())))
      .then(arr => {
        // Order is preserved.
        return {
          profile: arr[0],
          posts: arr[1],
          following: arr[2],
          followers: arr[3],
          isFollowing: arr[4]
        }
      })
      .then(data => {
        setProfileDetails(prev => ({
          username: data.profile.username,
          biography: data.profile.biography,
          profileImage: data.profile.profile_image,
          backgroundImage: data.profile.background_image,
          tags: transformInterestTags(data.profile.tags),
          interests: transformInterests(data.profile.interests),
          posts: transformPosts(data.posts),
          following: data.following.users,
          followers: data.followers.users,
          isFollowing: Boolean(data.isFollowing),
          links: {
            ...prev.links,
            ...data.profile.links_json
          }
        }))
        setProfileFetched(true)
      })
      .catch(err => {
        console.error(err)
        /**
         * CONSIDER: Adding some top-level error handling and displaying?
         * We'll need it sooner or later.
         * (02/05/2022) Take-Some-Bytes */
      })
  }, [profileId])
  if (!props.currentUserId) {
    // Nope :)
    return <Redirect to='/login' />
  }

  if (!profileFetched) {
    return (
      <div className={classes.root} id='user-profile-container'>
        {/**
                 * TODO: Get a proper loading widget
                 * (02/05/2022) Take-Some-Bytes */}
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <section className={classes.root} id='user-profile-container'>
      <ProfileSettings isOwnProfile={isOwnProfile} />
      <ProfileTitle profileDetails={profileDetails} />
      <div className={classes.profileMain} id='user-profile-main'>
        <ProfileSidebar
          profileDetails={profileDetails}
          isOwnProfile={isOwnProfile}
          unfollow={unfollowThisProfile}
          follow={followThisProfile}
        />
        <ProfilePostList
          isOwnProfile={isOwnProfile}
          posts={profileDetails.posts} deletePost={deletePost}
        />
      </div>
    </section>
  )
}
