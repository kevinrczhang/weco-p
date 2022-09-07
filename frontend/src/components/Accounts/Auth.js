import axios from 'axios';
import constants from '../../constants';

const BASE_URL = new URL('/accounts/', constants.BASE_URL)

axios.defaults.withCredentials = true
let UserID = null;
export function login (data) {
    return axios.post(new URL('login/', BASE_URL), 
    { username: data.name, password: data.password }, 
    {//note: you need to include withCredentials: true to send the cookie to django
      withCredentials: true
    }//you also need to change the react url form localhost to http://127.0.0.1:3000/
    )//then enable ALL cookies in chrome settings for this to work
    .then(response =>{
    axios.get(new URL('user_id/', BASE_URL))
    .then(response =>{
        UserID = response.data
        window.location = '/profile/' + UserID
    })
})
.catch(function (error) {
    if (error.response.status == 404) {
        Promise.reject('Authentication failed!')
        return 'Invalid email or password'
    } 
    else {
        return 'If nothing happens when you try to login, it means the servers are down, please come again later'     
    }

  });
    }

export function register(username, email, password){
    return axios.post(new URL('register', BASE_URL), 
    {username: username, email: email, password: password}
    )
    .then(response =>{
      if(response.status !== 201){
      return response
      }
      {window.location = '/login'}
    }
    )
}
