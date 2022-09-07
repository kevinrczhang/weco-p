import axios from 'axios';
import React, { useState, Component, useEffect } from "react";
import {
    Link,
    useRouteMatch,
  } from "react-router-dom";
import constants from '../constants';

const BASE_URL = new URL('/accounts/', constants.BASE_URL)

export default function UserList() {
  const [fetched, setFetched] = useState(false);
  const [user, setUser] = useState([]);
    let route = useRouteMatch();
  useEffect(() => {
    if(!fetched){
    axios.get(new URL('profile/', BASE_URL))
      .then(response => {
        setFetched(true);
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" }; 
          }
          );
        }
        return response.data;
      })
      .then(data => {
        setUser(data);
      }); }
    }
  )
    return (
      <ul>
        {user.map(contact => {
          return (
            <li key={contact.username}>
              <Link to={`${route}/${contact.id}`}>
              {contact.username}
               </Link>
            </li>
          );
        })}
      </ul> 
    );
  }

