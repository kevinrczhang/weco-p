import React, {useState, useEffect, Component } from 'react'
import constants from '../../constants';

const BASE_URL = new URL(constants.BASE_URL)

//will contain tags and interests for update
export default function AddInterest(){

    const [interests, setInterest] = useState([]);
    const handleSubmit = (e) =>{
    e.preventDefault();
    register( state.username,state.password, state.email, state.interests)
    .then(response => window.location = '/')
    .catch(err => alert(err));
    } 
    useEffect(() => {
    if(!fetched){
    axios.get(new URL('/interest_list', BASE_URL))
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
      setFetched(true);
      setInterest(data)
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      setLoading(false);
    });
  
  
    }}, [])
    if (loading) {
      return <p>Data is loading...</p>;
    }
    if (error || !Array.isArray(interests)) {
      return <p>There was an error loading your data!</p>;
    }
  

    function handleChange(e) {
      const value = e.target.value;
      setState({
        ...state,
        [e.target.name]: value
      });
    }  
    return (
        <form onSubmit={handleSubmit}>
        <label>
          Interests :
          <select name="interest" value={state.interests} onChange={handleChange}>
              {state.interests.map((data) => (
              <option 
              key={data.interests}
              value={data.interests}> 
              {
                data.interest_name
              }
  
              </option>
              )
              
              )}
              </select>
        </label>
        <button type="submit" className="btn btn-default">Submit</button>
      </form>
  
    );

}