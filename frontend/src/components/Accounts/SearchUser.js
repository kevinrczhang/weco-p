    import axios from 'axios';
    import React from 'react';
    import { useEffect, useState } from 'react';
    import TextField from '@material-ui/core/TextField';
    import Autocomplete from '@material-ui/lab/Autocomplete';
    import CircularProgress from '@material-ui/core/CircularProgress';
    import SearchUserList from './SearchUserList'
    import constants from '../../constants';

    const BASE_URL = new URL('/accounts/', constants.BASE_URL)

    function sleep(delay = 0) {
      return new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    }
    
    export default function SearchUser() {
    const [open, setOpen] = useState(false); //when the search bar is "opened"
    const [options, setOptions] = useState([]);
    const [input, setInput] = useState();
    const loading = open && options.length === 0;

      function handleChange(e){
        setInput(e.target.value)
      }
      function onEnter(e){
        const value = e.target.value
        if(e.key ==='Enter' && value){
          history.push(`/search/${input}`) 
        }
  
      }
       useEffect(() => {
        let active = true;
    
        if (!loading) {
          return undefined;
        }
    
        (async () => {
          if(input === undefined){
            const response = await axios.get(new URL('search_users', BASE_URL));
            await sleep(1); 
            const users = await response;
            console.log(loading)
            if (active) {
              setOptions(users.data);
            }

          }
          else{
            const response = await axios.get(new URL(`search_users?p=${input}`, BASE_URL));
            await sleep(1); 
            const users = await response;
            console.log('sd')
            if (active) {
              setOptions(users.data);
            }
          }

        })();
    
        return () => {
          active = false;
        };
      }, [loading]);
    
      useEffect(() => {
        if (!open) {
          setOptions([]);
          console.log(options)
        }
      }, [open]);
    
      return (
        <Autocomplete
          id="asynchronous-demo"
          style={{ width: '50%', marginLeft:'15%', marginTop:'2%' }}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          options={options}
          getOptionSelected={(option, value) => option.username === value.name}
          getOptionLabel={(option) => option.username}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={handleChange}
              onKeyDown={onEnter}
              label="Asynchronous"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      );
            
}