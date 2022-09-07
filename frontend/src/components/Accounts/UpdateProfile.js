import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import {
  // Autocomplete,
  // Avatar,
  // Button,
  // Box,
  // CircularProgress,
  // Divider,
  // Stack,
  // TextField,
  // Typography,
  // Chip,
  // Accordion,
  // AccordionSummary,
  // AccordionDetails,
} from '@mui/material'
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { styled } from '@material-ui/core/styles'
import { MdExpandMore } from 'react-icons/md'
import { upperCaseFirst, is } from '../../utils/str-utils'
// import { styled } from '@mui/system'
import constants from '../../constants'

const BASE_URL = new URL(constants.BASE_URL)
const FETCH_CONFIG = {
  method: 'GET',
  credentials: 'include',
  mode: 'cors'
}
const EXTERN_LINK_NAMES = constants.EXTERN_LINK_NAMES

/**
 * @typedef {import('@mui/material').Theme} MuiTheme
 */

/**
 * @typedef {import('@mui/system').SxProps} SxProps<T>
 * @template T
 */

/**
 * @typedef {import('@material-ui/lab').FilterOptionsState} FilterOptionsState<T>
 * @template T
 */

/**
 * @typedef {Object} BasicInfo
 * @prop {string} name
 * @prop {number} id
 *
 * @typedef {Record<'website'|'facebook'|'twitter'|'instagram'|'tiktok', string>} Links
 *
 * @typedef {Object} UserDetails
 * @prop {string} email
 * @prop {string} username
 * @prop {string} realName
 * @prop {string} biography
 * @prop {Links} links
 */

/**
 * @typedef {Object} MultiAutocompleteProps
 * @prop {boolean} freeSolo
 * @prop {import('react').CSSProperties} style
 * @prop {string} helperText
 * @prop {string} autocompleteId
 * @prop {string} textFieldLabel
 * @prop {Array<T>} selectedItems
 * @prop {() => Promise<Array<T>>} getAvailableItems
 * @prop {React.Dispatch<React.SetStateAction<Array<T>>} setSelectedItems
 * @template {BasicInfo} T
 */

/**
 * @typedef {Object} UpdateUserProfileProps
 * @prop {string} currentUserId
 *
 * @typedef {Object} UpdateProfileImgProps
 * @prop {string} profileImgObj
 * @prop {(img: File) => void} setProfileImg
 *
 * @typedef {Object} ProfileImgProps
 * @prop {string} profileImgObj
 *
 * @typedef {Object} UpdateProfileDetailsProps
 * @prop {boolean} saved
 * @prop {String} ErrorText
 * @prop {VoidFunction} saveProfile
 * @prop {Links} externLinks
 * @prop {UserDetails} userDetails
 * @prop {Array<BasicInfo>} selectedTags
 * @prop {Array<BasicInfo>} selectedInterests
 * @prop {React.Dispatch<React.SetStateAction<Links>>} setExternLinks
 * @prop {React.Dispatch<React.SetStateAction<UserDetails>} setUserDetails
 * @prop {React.Dispatch<React.SetStateAction<Array<BasicInfo>>} setSelectedTags
 * @prop {React.Dispatch<React.SetStateAction<Array<BasicInfo>>} setSelectedInterests
 *
 * @typedef {Object} BasicDetailsProps
 * @prop {UserDetails} userDetails
 * @prop {React.Dispatch<React.SetStateAction<UserDetails>} setUserDetails
 *
 * @typedef {Object} ExternLinksProps
 * @prop {Links} externLinks
 * @prop {React.Dispatch<React.SetStateAction<Links>>} setExternLinks
 *
 * @typedef {Object} InterestsAndTagsProps
 * @prop {Array<BasicInfo>} selectedTags
 * @prop {Array<BasicInfo>} selectedInterests
 * @prop {React.Dispatch<React.SetStateAction<Array<BasicInfo>>} setSelectedTags
 * @prop {React.Dispatch<React.SetStateAction<Array<BasicInfo>>} setSelectedInterests
 */

/**
 * @typedef {Object} StackProps
 * @prop {string} className
 * @prop {React.ReactNode} children
 * @prop {'column-reverse'|'column'|'row-reverse'|'row'} direction
 */

/**
 * Drop-in replacement for MUI stack component.
 * @param {StackProps} props Component props.
 * @returns {JSX.Element}
 */
function Stack (props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: props.direction,
      }}
      className={props.className}
    >
      {props.children}  
    </div>
  )
}

const RootStack = styled(Stack)({
  backgroundColor: 'rgb(248, 248, 248)',
  // The same as the height of the toolbar.
  marginTop: '64px',
  flexGrow: '1',
  height: 'max-content',
  paddingBottom: '2.5rem',
  minHeight: 'calc(100vh - 64px - 2.5rem)',
})
const ColumnContainer = styled('div')({
  padding: '4rem',
  paddingBottom: '0',
})
const HiddenInput = styled('input')({
  display: 'none'
})
const CustomDivider = styled(Divider)({
  margin: '0.5rem 0 2rem'
})
const CustomTextField = styled(TextField)({
  margin: '0.5rem 0'
})

/**
 * Delays an async function for the specified amount of milliseconds.
 * @param {number} ms The number of milliseconds to delay.
 * @returns {Promise<void>}
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Renders a container that shows the user's current profile picture.
 * @param {ProfileImgProps} props Component props.
 * @returns {JSX.Element}
 */
function ProfileImg (props) {
  return (
    <Avatar
      alt='User Profile Image'
      src={props.profileImgObj}
      style={{
        borderRadius: '50%',
        border: '10px solid rgb(221, 196, 171)',
        width: '14rem',
        height: '14rem',
      }}

      imgProps={{
        // Unload object URL.
        onLoad: () => URL.revokeObjectURL(props.profileImgObj)
      }}
    />
  )
}

/**
 * Renders a container that allows the user to update their profile picture.
 * @param {UpdateProfileImgProps} props Component props.
 * @returns {JSX.Element}
 */
function UpdateProfileImg (props) {
  /**
   * @param {React.ChangeEvent<HTMLInputElement>} e The DOM event.
   */
  function onUploadImgChange (e) {
    props.setProfileImg(e.target.files.item(0))
  }

  return (
    <ColumnContainer
      // sx={{ paddingRight: '8rem' }}
      style={{ paddingRight: '8rem' }}
    >
      <ProfileImg profileImgObj={props.profileImgObj} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          paddingTop: '1.25rem',
        }}
      >
        <label htmlFor='upload-image-input'>
          <HiddenInput
            id='upload-image-input'
            accept='image/*'
            type='file'
            onChange={onUploadImgChange}
          />
          <Button
            variant='outlined'
            // sx={{
            //   // Sometimes MUI is so annoying.
            //   borderColor: 'rgb(140, 140, 140) !important',
            // }}
            style={{
              // Sometimes MUI is so annoying.
              borderColor: 'rgb(140, 140, 140) !important',
            }}
            color='inherit'
            component='span'
          >
            Change Image
          </Button>
        </label>
      </div>
    </ColumnContainer>
  )
}

const filter = createFilterOptions()

/**
 * TODO: Fix the MultiAutocomplete component.
 * It seems to be broken in a lot of places.
 * (04/01/2022) Take-Some-Bytes */

/**
 * Renders an autocomplete component with a customized display for
 * multiple chips.
 * @param {MultiAutocompleteProps<T>} props Component props.
 * @returns {JSX.Element}
 * @template {BasicInfo} T
 */
let newoptionlen = 0
function MultiAutocomplete (props) {
  const { selectedItems, setSelectedItems } = props
  const { getAvailableItems } = props
  const { freeSolo } = props
  const [open, setOpen] = useState(false)
  /** @type {[Array<T>, React.Dispatch<React.SetStateAction<Array<T>>]} */
  const [availableItems, setAvailableItems] = useState([])
  const loading = open && availableItems.length === 0

  /**
   * @param {Array<T>} options
   * @param {FilterOptionsState<T>} state
   * @returns {Array<T>}
   */
  function filterOptions (options, state) {
    const filtered = filter(options, state)
    const filteredLen = filtered.length
    if (state.inputValue !== '') {
      filtered.push({
        added: true,
        id: newoptionlen,
        name: state.inputValue,
        title: `Add "${state.inputValue}"`,
      })
    }
    return filtered
  }

  useEffect(() => {
    if (!loading) {
      return null
    }

    getAvailableItems()
      .then(items => {
        setAvailableItems(items)
      })
      .catch(err => {
        console.error(err)
      })
  }, [getAvailableItems, loading])

  return (
    <Autocomplete
      id={props.autocompleteId}
      style={props.style}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      // isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionSelected={(option, value) => option.id === value.id}
      getOptionLabel={(option) => {
        if (option.added) {
          // Option was just added by user.
          return option.title
        }

        return option.name
      }}
      options={availableItems}
      filterOptions={freeSolo ? filterOptions : undefined}
      renderInput={(params) => (
        <TextField
          {...params}
          onKeyDown={ e => {
            if (e.key === 'Enter') {
              e.stopPropagation();
            }
          }
        }
          label={props.textFieldLabel}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          helperText={props.helperText}
        />
      )}
      renderTags={(value, getTagProps) => (
        value.map((option, index) => (
          <Chip variant='outlined' label={option.name} {...getTagProps({ index })} />
        ))
      )}
      value={selectedItems}
      onChange={(_, vals) => {
        if (vals[vals.length - 1].added) {
          // Item was just added.
          const newVal = vals.pop()
          vals.push({
            name: newVal.name,
            id: newVal.id
          })
        }

        setSelectedItems(vals)
        newoptionlen +=1
      }}
      freeSolo={freeSolo}
      multiple
    />
  )
}

/**
 * Renders a container that allows the user to edit basic profile details.
 * @param {BasicDetailsProps} props Component props.
 * @returns {JSX.Element}
 */
function BasicDetails (props) {
  /**
   * @param {React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>} e
   */
  function handleTextfieldChange (e) {
    props.setUserDetails(prev => ({
      ...prev,
      [e.target.name]: String(e.target.value)
    }))
  }

  return (
    <div id='basic-details'>
      <CustomTextField
        label='Username'
        name='username'
        variant='outlined'
        size='small'
        // sx={{
        //   width: '24rem'
        // }}
        style={{ width: '24rem' }}
        helperText='Your displayed username on WECO'
        value={props.userDetails.username}
        onChange={handleTextfieldChange}
      />
      <br />
      <CustomTextField
        label='Real Name'
        name='realName'
        variant='outlined'
        size='small'
        // sx={{
        //   width: '24rem',
        // }}
        style={{ width: '24rem' }}
        helperText='Your real name'
        value={props.userDetails.realName}
        onChange={handleTextfieldChange}
      />
      <br />
      <CustomTextField
        label='Biography'
        name='biography'
        variant='outlined'
        // sx={{
        //   width: '36rem'
        // }}
        style={{ width: '36rem' }}
        helperText='Tell us a bit about yourself'
        multiline
        minRows={3}
        maxRows={18}
        value={props.userDetails.biography}
        onChange={handleTextfieldChange}
      />
    </div>
  )
}

/**
 * Renders a container that allows the user to edit external links.
 * @param {ExternLinksProps} props Component props.
 * @returns {JSX.Element}
 */
function ExternLinks (props) {
  /**
   * @param {React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>} e
   */
  function handleTextfieldChange (e) {
    props.setExternLinks(prev => ({
      ...prev,
      [e.target.name]: String(e.target.value)
    }))
  }

  const getHelperText = name => {
    if (name === 'website') {
      return 'Your personal website'
    }
    if (name === 'linkedin') {
      return [
        'The last part of your LinkedIn profile address ',
        '(e.g. hello for linkedin.com/in/hello/)'
      ].join('')
    }
    if (name === 'youtube') {
      return 'Your YouTube channel URL'
    }
    if (name === 'twitch') {
      return 'Your Twitch channel name (all lowercase)'
    }
    return `Your ${name} account name`
  }

  return (
    <div id='extern-links'>
      {EXTERN_LINK_NAMES.map(name => (
        <React.Fragment key={name}>
          <CustomTextField
            label={upperCaseFirst(name)}
            name={name}
            variant='outlined'
            size='small'
            // sx={{
            //   width: '24rem',
            // }}
            style={{ width: '24rem' }}
            helperText={getHelperText(name)}
            value={props.externLinks[name]}
            onChange={handleTextfieldChange}
          />
          <br />
        </React.Fragment>
      ))}
    </div>
  )
}

/**
 * Renders a container that allows the user to edit their interests and tags.
 * @param {InterestsAndTagsProps} props Component props.
 * @returns {JSX.Element}
 */
function InterestsAndTags (props) {
  return (
    <div id='interests-and-tags'>
      <MultiAutocomplete
        // sx={{ width: '42rem' }}
        style={{ width: '42rem' }}
        autocompleteId='update-interests-autocomplete'
        helperText="What you're interested in"
        textFieldLabel='Interests'
        selectedItems={props.selectedInterests}
        setSelectedItems={props.setSelectedInterests}
        getAvailableItems={() => {
          return fetch(new URL('accounts/interest_list/', BASE_URL), FETCH_CONFIG)
            .then(res => res.json())
            .then(data => {
              return data.interests.map(interest => ({
                name: interest.interest_name,
                id: interest.id
                }))
            })
            .catch(err => console.error(err))
        }}
      />
      <br />
      <MultiAutocomplete
        // sx={{ width: '42rem' }}
        style={{ width: '42rem' }}
        autocompleteId='update-tags-autocomplete'
        helperText="User-generated interests that aren't listed above"
        textFieldLabel='Tags'
        selectedItems={props.selectedTags}
        setSelectedItems={props.setSelectedTags}
        getAvailableItems={() => {
          return fetch(new URL('accounts/tags_list/', BASE_URL), FETCH_CONFIG)
            .then(res => res.json())
            .then(data => data.tags.map(tag => ({
              name: tag.interest_tag_name,
              id: tag.id
              })))
            .catch(err => console.error(err))
        }}
        freeSolo
      />
    </div>
  )
}

/**
 * Renders a container that allows the user to edit their profile details.
 * @param {UpdateProfileDetailsProps} props Component props.
 * @returns {JSX.Element}
 */
function UpdateProfileDetails (props) {
  /**
   * @param {React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>} e
   */
  function handleTextfieldChange (e) {
    props.setUserDetails(prev => ({
      ...prev,
      [e.target.name]: String(e.target.value)
    }))
  }

  return (
    <ColumnContainer
      style={{ flexGrow: '1', paddingTop: '4rem' }}
      // sx={{
      //   flexGrow: '1',
      //   paddingTop: '4rem'
      // }}
    >
      <Typography
        variant='h3'
        style={{ fontFamily: '"Barlow Condensed", Arial, sans-serif' }}
        // sx={{
        //   fontFamily: '"Barlow Condensed", Arial, sans-serif',
        // }}
      >
        Public Profile
      </Typography>
      <CustomDivider />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={(<MdExpandMore />)}>
          Basic Details
        </AccordionSummary>
        <AccordionDetails>
          <BasicDetails
            userDetails={props.userDetails}
            setUserDetails={props.setUserDetails}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={(<MdExpandMore />)}>
          External Links
        </AccordionSummary>
        <AccordionDetails>
          <ExternLinks
            externLinks={props.externLinks}
            setExternLinks={props.setExternLinks}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={(<MdExpandMore />)}>
          Interests and Tags
        </AccordionSummary>
        <AccordionDetails>
          <InterestsAndTags
            selectedTags={props.selectedTags}
            selectedInterests={props.selectedInterests}
            setSelectedTags={props.setSelectedTags}
            setSelectedInterests={props.setSelectedInterests}
          />
        </AccordionDetails>
      </Accordion>
      <br />

      <Button
        variant='contained'
        onClick={props.saveProfile}
        color='primary'
      >
        Save
      </Button>
      {props.saved ? (
        <Typography style={{marginTop:'5px'}}>Changes saved</Typography>
      ) : <Typography style={{marginTop:'5px'}}>{props.ErrorText}</Typography>}
    </ColumnContainer>
  )
}
/**
 * Renders a page where the user could update their profile.
 *
 * Updating password & email is not supported.
 * @param {UpdateUserProfileProps} props Component props.
 * @returns {JSX.Element}
 */
export default function UpdateUserProfile (props) {
  const userId = props.currentUserId

  const [profileFetched, setProfileFetched] = useState(false)
  const [userDetails, setUserDetails] = useState({
    email: '',
    username: '',
    realName: '',
    biography: '',
    links: {
      website: '',
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: '',
    }
  })
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedInterests, setSelectedInterests] = useState([])
  const [userImgs, setUserImgs] = useState({
    profileImg: null,
    backgroundImg: null,
  })
  const [changed, setChanged] = useState({
    details: false,
    interests: false,
    tags: false,
    profileImg: false,
    backgroundImg: false,
    links: false,
  })

  const [saved, setSaved] = useState(false)
  const[ErrorText, setErrorText] = useState("")
  const history = useHistory()

  // Create an object URL for profile image and background image
  // so we could preview them.
  const profileImgObj = useMemo(() => {
    if (!userImgs.profileImg) {
      return null
    }

    return URL.createObjectURL(userImgs.profileImg)
  }, [userImgs.profileImg])
  const backgroundImgObj = useMemo(() => {
    if (!userImgs.backgroundImg) {
      return null
    }

    return URL.createObjectURL(userImgs.backgroundImg)
  }, [userImgs.backgroundImg])

  function saveProfile () {
    // Go go saving user profile!
    /**
     * TODO: Possibly more input validation?
     * Especially for external links, as their values aren't validated
     * by the AccountSerializer in the backend.
     * (04/03/2022) Take-Some-Bytes */

    const formData = new FormData()
    if (changed.details) {
      formData.append('username', String(userDetails.username))
      formData.append('real_name', String(userDetails.realName))
      formData.append('biography', String(userDetails.biography))
      // No email for you >:)
    }
    if (changed.links) {
      if (userDetails.links.website && !is.absUrl(userDetails.links.website)) {
        setErrorText('Invalid website URL!')
        return
      }
      if (userDetails.links.youtube && !is.absUrl(userDetails.links.youtube)) {
        setErrorText('Invalid YouTube URL!')
        return
      }
      formData.append('links_json', JSON.stringify(userDetails.links))
    }
    if (changed.tags) {
      formData.append('tags', JSON.stringify(selectedTags.map(tag => tag.name)))
    }
    if (changed.interests) {
      formData.append('interests', JSON.stringify(selectedInterests.map(interest => interest.name)))
    }
    if (changed.profileImg) {
      formData.append('profile_image', userImgs.profileImg)
    }
    if (changed.backgroundImg) {
      formData.append('background_image', userImgs.backgroundImg)
    }

    (async () => {
      // First, ensure tags have been created.
      await fetch(new URL(`accounts/create_gen/`, BASE_URL), {
        ...FETCH_CONFIG,
        method: 'POST',
        body: JSON.stringify({ interest_tag_name: selectedTags.map(tag => tag.name) }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const res = await fetch(new URL(`accounts/details/${userId}/`, BASE_URL), {
        ...FETCH_CONFIG,
        method: 'PATCH',
        body: formData,
        credentials: 'include'
      })
      console.debug(await res.text())
      if(res.status === 413){
        await delay(2000)
        setErrorText('The image you uploaded was too large, please choose another')
      }
      else{
      setSaved(true)
      await delay(2000)
      history.push(`/profile/${userId}/`)
      }
    })().catch(err => console.error(err))
  }

  useEffect(() => {
    fetch(new URL(`accounts/self/`, BASE_URL), FETCH_CONFIG)
      .then(res => res.json())
      .then(data => {
        setUserDetails(prev => ({
          id: data.id,
          email: data.email,
          links: {
            ...prev.links,
            ...data.links_json
          },
          username: data.username,
          realName: data.real_name,
          biography: data.biography,
        }))


        setSelectedTags(data.tags.map(tag => ({
          name: tag.interest_tag_name,
          id: tag.id
        })))
        setSelectedInterests(data.interests.map(interest => ({
          name: interest.interest_name,
          id: interest.id
        })))

        // Process images.
        return Promise.all([                  //this is the FUCKING line that you're supposed to put so that stupid FUCKING chrome won't bug out
          fetch(new URL(data.profile_image+ `?cacheblock=true`), { mode: 'cors'}),
         // fetch(new URL(data.background_image), { mode: 'cors' }),
        ])
      })
      .then(arr => Promise.all(arr.map(res => res.blob())))
      .then(([ profileImage, backgroundImage ]) => {
        // Store the images so we could preview them later.
        setUserImgs({ profileImg: profileImage, backgroundImg: backgroundImage })

        setProfileFetched(true)
      })
      .catch(err => {
        console.error(err)
        /**
         * TODO: Add proper error handling.
         * (02/25/2022) Take-Some-Bytes */
      })
  }, [userId])

  if (!profileFetched) {
    return (
      <RootStack direction='row'>
        {/**
         * TODO: Get a proper loading widget
         * (02/05/2022) Take-Some-Bytes */}
        <h1>Loading...</h1>
      </RootStack>
    )
  }

  return (
    <RootStack direction='row'>
      <UpdateProfileDetails
        saved={saved}
        ErrorText={ErrorText}
        saveProfile={saveProfile}
        userDetails={userDetails}
        setUserDetails={(...args) => {
          setChanged(prev => ({ ...prev, details: true }))
          setUserDetails(...args)
        }}
        externLinks={userDetails.links}
        setExternLinks={val => {
          if (typeof val === 'function') {
            setUserDetails(prev => ({
              ...prev,
              links: val(prev.links)
            }))
          } else {
            setUserDetails(prev => ({
              ...prev,
              links: val
            }))
          }

          setChanged(prev => ({ ...prev, links: true }))
        }}
        selectedTags={selectedTags}
        setSelectedTags={(...args) => {
          setChanged(prev => ({ ...prev, tags: true }))
          setSelectedTags(...args)
        }}
        selectedInterests={selectedInterests}
        setSelectedInterests={(...args) => {
          setChanged(prev => ({ ...prev, interests: true }))
          setSelectedInterests(...args)
        }}
      />
      <UpdateProfileImg
        profileImgObj={profileImgObj}
        setProfileImg={file => {
          setChanged(prev => ({ ...prev, profileImg: true }))
          setUserImgs(prev => ({
            ...prev,
            profileImg: file
          }))
        }}
      />
    </RootStack>
  )
}
