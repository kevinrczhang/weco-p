import React, { useEffect, useState, useRef } from 'react'
// import {
//   ImageList,
//   Typography
// } from '@mui/material'
// import { styled } from '@mui/system'
import {
  ImageList,
  Typography
} from '@material-ui/core'
import { styled } from '@material-ui/core/styles'

import UserResult from "./UserResult"
import constants from '../../constants'

const USERS_LIMIT = 15
const BASE_URL = new URL(constants.BASE_URL)
const FETCH_CONFIG = {
  method: 'GET',
  credentials: 'include',
  mode: 'cors'
}

/**
 * @typedef {Object} User
 * @prop {number} id
 * @prop {string} username
 * @prop {string} real_name
 * @prop {string} biography
 * @prop {string} profile_image
 * @prop {Array<string>} tags
 * @prop {Array<string>} interests
 */

/**
 * @typedef {Object} FetchUsersConfig
 * @prop {number} offset
 * @prop {number} limit
 * @prop {string} userQuery
 *
 * @typedef {Object} FetchUsersResult
 * @prop {Array<User>} users
 * @prop {boolean} hasMore
 */

/**
 * @typedef {Object} UserListItemProps
 * @prop {User} user
 */

/**
 * Transform the parsed JSON array of posts into the format expected
 * by this component.
 * @param {Array<any>} users The parsed JSON array from the server.
 * @returns {Array<User>}
 */
function transformUsers (users) {
  return users.map(user => ({
    id: user.id,
    username: user.username,
    real_name: user.real_name,
    biography: user.biography,
    profile_image: user.profile_image,
    tags: user.tags.map(tag => ({
      name: tag.interest_tag_name,
      id: tag.id,
    })),
    interests: user.interests.map(int => ({
      name: int.interest_name,
      id: int.id
    }))
  }))
}

/**
 * Fetches users, with the specified offset and limit.
 * @param {FetchUsersConfig} config Configurations.
 * @returns {Promise<FetchUsersResult>}
 */
function fetchUsers (config) {
  const { userQuery, limit, offset } = config
  const query = new URLSearchParams({ p: userQuery, l: limit, o: offset })
  const url = new URL(`/accounts/search_users?${query.toString()}`, BASE_URL)

  return fetch(url, FETCH_CONFIG)
    .then(res => res.json())
    .then(data => ({
      users: transformUsers(data.users),
      hasMore: Boolean(data.more_data)
    }))
}

const RootSection = styled('section')({
  // The same as the height of the toolbar.
  backgroundColor: 'rgb(248, 248, 248)',
  marginTop: '64px',
  flexGrow: '1',
  height: 'max-content',
  paddingBottom: '2.5rem',
  padding: '2rem',
  minHeight: 'calc(100vh - 64px - 2.5rem)',
})

/**
 * Renders a list showing the results of a user search.
 * @returns {JSX.Element}
 */
export default function SearchUserList () {
  /**
   * @type {string}
   */
  const userQuery = new URLSearchParams(window.location.search).get('q')

  const [users, setUsers] = useState([])
  const [error, setError] = useState({
    message: null,
    details: null,
    occurred: false,
  })
  const [hasMore, setHasMore] = useState(true)
  const [atBottom, setAtBottom] = useState(true)

  const offset = useRef(0)

  const noMoreResults = (
    <div style={{ padding: '0.2rem' }}>
      <Typography>No more results.</Typography>
    </div>
  )

  function handleScroll () {
    const root = document.getElementById('asdfsdfsf')
    const scrollHeight = root.scrollHeight
    const clientHeight = root.clientHeight
    const scrollTop = root.scrollTop

    setAtBottom(scrollHeight - scrollTop === clientHeight)
  }

  useEffect(() => {
    if (atBottom && hasMore) {
      fetchUsers({ userQuery: userQuery, limit: USERS_LIMIT, offset: offset.current })
        .then(results => {
          // We don't need to append to the end of the users list for some reason.
          setUsers(results.users)
          setAtBottom(false)
          setHasMore(results.hasMore)
          offset.current += USERS_LIMIT
        })
        .catch(err => {
          console.error(err)
          setError({
            message: 'Failed to fetch search results',
            details: `Details: ${err.message}`,
            occurred: true
          })
        })
    }

    // Infinite scroll handling.
    document.getElementById('asdfsdfsf').addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      document.getElementById('asdfsdfsf').removeEventListener('scroll', handleScroll)
    }
  }, [userQuery, atBottom, hasMore])

  if (error.occurred) {
    return (
      <RootSection>
        <Typography variant='h3'>An error occurred</Typography>
        <div style={{ padding: '0.2rem' }}>
          <Typography variant='subtitle1'>{error.message}</Typography>
          <Typography variant='caption'>{error.details}</Typography>
        </div>
      </RootSection>
    )
  }

  if (users.length === 0) {
    return (
      <RootSection>
        <Typography variant='h3'>Loading...</Typography>
      </RootSection>
    )
  }

  return (
    <RootSection>
      <ImageList cols={0}>
        {users.map(user => (
          <UserResult user={user} key={user.id} />
        ))}
      </ImageList>
      {!hasMore ? noMoreResults : null}
    </RootSection>
  )
}
