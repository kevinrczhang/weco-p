/**
 * @fileoverview React component for displaying user notifications.
 */

import React, { useEffect, useState } from 'react'

import {
  Badge,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Popover,
  styled,
  Typography
} from '@material-ui/core'
import { Notifications as NotificationsIcon } from '@material-ui/icons'

import constants from '../../constants'

const BASE_URL = new URL(constants.BASE_URL)
const FETCH_CONFIG = {
  method: 'GET',
  credentials: 'include',
  mode: 'cors'
}

export const MENU_ID = 'notifications_list'

/**
 * @callback MarkAsRead
 * @returns {Promise<void>}
 */
/**
 * @typedef {Object} NotificationsButtonProps
 * @prop {number} numNotifs
 * @prop {(e: React.SyntheticEvent) => void} onClick
 *
 * @typedef {Object} NotificationsListProps
 * @prop {boolean} open
 * @prop {VoidFunction} onClose
 * @prop {Array<Notification>} notifs
 * @prop {EventTarget & HTMLElement} anchor
 *
 * @typedef {Object} Notification
 * @prop {string} id
 * @prop {string} text
 * @prop {string} title
 * @prop {string} sender
 * @prop {boolean} isRead
 * @prop {Date} creationDate
 */

const TopbarItemContainer = styled('div')(({ theme }) => ({
  display: 'none',
  margin: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}))

/**
 * Transform a parsed array of notifications into the expected structure.
 * @param {Array<any>} notifs The array of notifications, as sent by the server.
 * @returns {Array<Notification>}
 */
function transformNotifs (notifs) {
  return notifs.map(notif => ({
    id: notif.id,
    text: notif.text,
    title: notif.title,
    sender: notif.sender,
    isRead: Boolean(notif.read),
    creationDate: new Date(notif.created_date)
  }))
}

/**
 * Hook to get notifications and mark them as read.
 * @returns {[Array<Notification>, Error, MarkAsRead]}
 */
export function useNotifs () {
  const [error, setError] = useState(null)
  const [notifs, setNotifs] = useState([])

  useEffect(() => {
    fetch(new URL('notifications/notifications', BASE_URL), FETCH_CONFIG)
      .then(res => res.json())
      .then(transformNotifs)
      .then(data => setNotifs(data))
      .catch(err => {
        setError(err)
      })
  }, [])

  function markAsRead () {
    const MARK_AS_READ_CONFIG = {
      ...FETCH_CONFIG,
      method: 'POST'
    }
    return fetch(new URL('notifications/read/', BASE_URL), MARK_AS_READ_CONFIG)
      .then(res => res.json())
      .then(transformNotifs)
      .then(data => setNotifs(data))
      .catch(err => setError(err))
  }

  return [notifs, error, markAsRead]
}

/**
 * Render a single notification as a list item.
 * @param {{ notification: Notification }} props Component props.
 * @returns {JSX.Element}
 */
function NotificationListItem (props) {
  const notif = props.notification
  const notifDetail = (
    <>
      <Typography variant='caption' component='span' style={{ display: 'inline-block' }}>
        From {notif.sender}
      </Typography>
      <br />
      <Typography variant='body2' component='span' style={{ display: 'inline-block' }}>
        {notif.text}
      </Typography>
      <br />
      <Typography variant='caption' component='span' style={{ display: 'inline-block' }}>
        On {notif.creationDate.toLocaleString()}
      </Typography>
    </>
  )
  const notifNewBadge = (
    <ListItemSecondaryAction>
      <Chip label='New!' color='primary' size='small' />
    </ListItemSecondaryAction>
  )

  return (
    <ListItem>
      <ListItemText secondary={notifDetail}>
        <Typography>
          {notif.title}
        </Typography>
      </ListItemText>
      {notif.isRead ? null : notifNewBadge}
    </ListItem>
  )
}

/**
 * Renders a list of notifications.
 * @param {NotificationsListProps} props Component props.
 * @returns {JSX.Element}
 */
export function NotificationsList (props) {
  return (
    <Popover
      open={props.open}
      anchorEl={props.anchor}
      onClose={props.onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <List style={{ width: 360, bgcolor: 'background.paper' }}>
        {props.notifs.map(notif => (<NotificationListItem key={notif.id} notification={notif} />))}
      </List>
    </Popover>
  )
}

/**
 * Component that renders a button to show a list of notifications.
 * @param {NotificationsButtonProps} props Component props.
 * @returns {JSX.Element}
 */
export function NotificationsButton (props) {
  return (
    <TopbarItemContainer>
      <IconButton
        edge='end'
        aria-label='notifications'
        aria-controls={MENU_ID}
        aria-haspopup='true'
        color='inherit'
        onClick={props.onClick}
      >
        <Badge badgeContent={props.numNotifs || null} color='error'>
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </TopbarItemContainer>
  )
}
