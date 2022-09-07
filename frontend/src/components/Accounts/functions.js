import { isWidthUp } from '@material-ui/core';
import axios from 'axios';
import { FaPray } from 'react-icons/fa';
import { register } from './Auth';
import constants from '../../constants';

const BASE_URL = new URL('/accounts/', constants.BASE_URL)

axios.defaults.withCredentials = true

export function UpdateInterests(interest){
    return axios.patch(new URL('update_parent/', BASE_URL))
    .catch(error => Promise.reject('Update Failed! ' + error));
}

export function create_tags(tags, username, email, password, interests){

    return axios.post(new URL('create_gen/', BASE_URL),
    {interest_tag_name:tags}
    )
    .then(response => {
          register(username, email, password, interests, tags)

})
    .catch(error => Promise.reject(error))
}

export function matches(r, str){
      var match = str.match(r);
      return match && str === match[0];
}
