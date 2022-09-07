import React, {useState, useEffect, Component } from 'react'
import { UpdateTags } from './functions';


//pre-condition: tags must in within a JSON dictionary to be sent to django
export default function AddTag(){
    //request.user should be sent when using withCredentials
    const [state, setState] = useState([{
      interest_tag_name :"", //might have to change this into a list later
    }
  ]
  )

    const handleSubmit = (e) =>{
    e.preventDefault();
    UpdateTags( state.role, state.interest_tag_name )
    .then(response => window.location = '/')
    .catch(err => alert(err));
    } 

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
    //replacement for handlechange, should transition into tag when pressed enter
    function keyPress(e){
      const value = e.target.value
      if(e.key ==='Enter' && value){
        //prevent duplicates
        if(state.interest_tag_name.find(tag => tag.toLowerCase() === value.toLowerCase())){
          console.log("Already exists")
          return;
        }
          setState({
            ...state,
            [e.target.name]: value,
          })
        //clears the field so that the user can enter another tag 
        e.target.value = "";
      }
      //remove tag if backspaced
      else if (e.key === 'Backspace' && !value){
        removeTag(state.length - 1);
      }

    }
    removeTag = (i) =>{
      //https://daveceddia.com/why-not-modify-react-state-directly/
      const temp = [...state.interest_tag_name];
      temp.splice(i, 1);
      setState({
        interest_tag_name: temp
      })

    }

    return (
      <div>
        <form onSubmit={handleSubmit}>
        <label>
        Tag names
        <input
          name='tag_name'
          type="text"
          value={state.interest_tag_name}
          onKeyDown={e=> keyPress(e)}
          //onChange={e=> handleChange(e)}
        />

        </label>
      </form>
      {state.interest_tag_name.map((tag, i) => (
        <li key = {tag}>
          {tag}
          <button type="button" onClick={() => {removeTag(i);}}>Remove</button>
        </li>


      ))}
      </div>
    );

}