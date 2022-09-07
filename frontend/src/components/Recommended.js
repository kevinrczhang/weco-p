import React, { useState, useEffect, useRef } from "react"
import {
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Tooltip
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import constants from '../constants';
import { useHistory } from "react-router";
const POST_LIMIT = 30
const BASE_URL = new URL(constants.BASE_URL)
const FETCH_CONFIG = {
    method: 'GET',
    credentials: 'include',
    mode: 'cors'
}

const useStyles = makeStyles({
    root: {
        // The same as the height of the toolbar.
        marginTop: '64px',
        paddingBottom: '2.5rem',

        height: 'max-content',
        minHeight: 'calc(100vh - 64px - 2.5rem)',

        backgroundColor: 'rgb(248, 248, 248)',
        flexGrow: '1',
    },
    postList: {
        padding: '2rem'
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
    },
    itemBar: {
        borderRadius: '0 0 20px 20px',
        height: '4.5rem'
    },
    itemBarTitle: {
        fontSize: '1.4rem',
        padding: '2px'
    },
    itemBarSubtitle: {
        fontSize: '0.8rem',
        padding: '2px'
    },
    postLink: {
        textDecoration: 'none',
        color: 'inherit',
    },
})

// More intellisense

/**
 * @typedef {Object} Post
 * @prop {string} publishedDate
 * @prop {string} author
 * @prop {string} title
 * @prop {string} image
 * @prop {string} text
 * @prop {string} id
 */

/**
 * @typedef {Object} FetchPostsConfig
 * @prop {number} offset
 * @prop {number} limit
 *
 * @typedef {Object} FetchPostsResult
 * @prop {Array<Post>} posts
 * @prop {boolean} hasMore
 */

/**
 * @typedef {Object} PostListItemProps
 * @prop {Post} post
 */

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
 * Fetches posts, with the specified offset and limit.
 * @param {FetchPostsConfig} config Configurations.
 * @returns {Promise<FetchPostsResult>}
 */
function fetchPosts (config) {
    const { limit, offset } = config
    const query = new URLSearchParams({ l: limit, o: offset })
    const url = new URL(`/posts/post-view-set/?${query.toString()}`, BASE_URL)

    return fetch(url, FETCH_CONFIG)
        .then(res => res.json())
        .then(data => ({
            posts: transformPosts(data.posts),
            hasMore: Boolean(data.more_data)
        }))
}

/**
 * TODO: See if we could refactor the post list into one place.
 * The post list is currently used in both the user profile page
 * and this page.
 * (02/14/2022) Take-Some-Bytes */

/**
 * An item in the post list.
 * @param {PostListItemProps} props Component props.
 * @returns {JSX.Element}
 */


function PostListItem (props) {
    const post = props.post
    let history = useHistory();
    const classes = usePostListItemStyles()
    
    function PostDetailRedirect(id){

        history.push('/Postlist/' + id)
    
    }
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
                />
            </ImageListItem>
        </Tooltip>
    )
}

/**
 * Renders a somewhat infinitely scrolling list of posts.
 * @returns {JSX.Element}
 */
export default function Recommended () {
    const [posts, setPosts] = useState([])
    // Default is true so we would try to fetch some posts at the very start
    const [hasMore, setHasMore] = useState(true)
    const [atBottom, setAtBottom] = useState(true)

    const classes = useStyles()

    // We just want to keep these values through renders.
    const offset = useRef(0)

    /**
     * Handles when the user scrolls.
     */
    function handleScroll () {
        const root = document.getElementById('asdfsdfsf')
        const scrollHeight = root.scrollHeight
        const clientHeight = root.clientHeight
        const scrollTop = root.scrollTop

        setAtBottom(scrollHeight - scrollTop === clientHeight)
    }

    useEffect(() => {
        if (atBottom && hasMore) {
            fetchPosts({ limit: POST_LIMIT, offset: offset.current })
                .then(results => {
                    // We don't need to append to the end of the post list for some reason.
                    setPosts(results.posts)
                    setAtBottom(false)
                    setHasMore(results.hasMore)
                    offset.current += POST_LIMIT
                })
                .catch(err => {
                    console.error(err)
                    /**
                     * CONSIDER: Adding some top-level error handling?
                     * Right now I'm not really sure what to do with errors.
                     * (02/14/2022) Take-Some-Bytes */
                })
        }

        // Infinite scroll handling.
        document.getElementById('asdfsdfsf').addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            document.getElementById('asdfsdfsf').removeEventListener('scroll', handleScroll)
        }
    }, [atBottom, hasMore])

    if(posts.length !== 0){
        return (
            <section className={classes.root} id='post-list'>
                <ImageList cols={0} className={classes.postList}>
                    {posts.map(post => (
                        <PostListItem
                            key={post.id}
                            post={post}
                        />
                    ))}
                </ImageList>
            </section>
        )
    }
    else{
        return(
            <h1 style={{marginTop: '4%', marginLeft: '2%'}}>Coming Soon...</h1>
        )
    }

}
