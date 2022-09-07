import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { render } from 'react-dom';
import FiveHundred from '../500';
import constants from '../../constants';

const BASE_URL = new URL(constants.BASE_URL)

axios.defaults.withCredentials = true;

export default function UserInterestList() {
      const {UserID} = useParams();
      const [user, setUser] = useState([]);
      const [fetched, setFetched] = useState(false);
      const config = {withCredentials : true};

      useEffect(()=> {
            if(!fetched){
                  axios.get(new URL('/accounts/getuser/2/get_user', BASE_URL), {config}) 
                  .then(response => {
                        setFetched(true);
                        console.log(response.data);
                        return response.data;
                  })
                  .then(response => {
                        setUser(response);
                        setFetched(true);
                        console.log(response);
                  }) .catch(err=>{console.log(err);render((props)=>{return (<FiveHundred/>)})});
            }
      });

      return ( 
            <div>
                  <ul>
                  {
                        user.map(contact => {
                              return (
                                    <li key={contact.username}>
                                          {contact.username}
                                    </li>
                              );
                        })
                  }
                  </ul> 
            </div> 
      );
}