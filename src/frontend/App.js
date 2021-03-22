import React, { useState, useEffect } from 'react';
import logo from './resources/teamo.png'
import ReactDOM from 'react-dom';


import {Container, Grid, Divider, Switch, Typography, ThemeProvider, TextField, Button, Tooltip} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";

import Profile from './Profile';
import Show from './Show';

import {useSelector} from 'react-redux';
import scoreReducer from './reducers/scoreCollection';
import teamReducer from './reducers/teamReducer';
import { LiveTvRounded } from '@material-ui/icons';


function App(){

  const [multi, setMulti] = useState([]);
  const [query, setQuery] = useState("");
  const [multiSub, setMultiSub] = useState(false);

  const lighttheme = createMuiTheme({
    palette: {
        primary: {
          main: "#6200EE",
        },
        secondary: {
          main: "#03DAC6",
        },
        background: {
          default: "#e6e7eb",
        },
        type: 'light',
      },
      overrides: {
        MuiPaper: {
          rounded: {
            backgroundColor:"#edeef2",
          }
        }
      }
      
  });

  const handleChange = (event) => {
    setQuery(event.target.value);
    event.preventDefault();
  }

  const handleSubmit = (event) => {
    setMulti(query.split(', '))
    setMultiSub(true);
    event.preventDefault();

    
  }

  const darktheme = createMuiTheme({
      palette: {
          type: 'dark',
          neutral: {
            main: '#5c6ac4',
          },
          background: {
            default: "#111214",
          },
        },
        overrides: {
          MuiPaper: {
            rounded: {
              backgroundColor:"#1d2126",
            }
          }
        }
    });
  
  const [night, setNight] = React.useState(false);
  const [theme, setTheme] = React.useState(lighttheme);
   
   const [showScores, setShowScores] = React.useState(false);
   const onClick = () => setShowScores(!showScores);
   const changeNight = () => {
     setNight(!night);
     if(night) {
       setTheme(lighttheme);
     }
     else {
       setTheme(darktheme)
     }
   }

    return (
      <div className="App">
        <ThemeProvider theme={theme}>
        <CssBaseline />
        
        
        <Container maxWidth="md"> 
          <Grid container item xs={12} justify="center">
            
            <img src={logo}></img>
            
            
          </Grid>
          <Grid container item xs={12} justify="center">
            <Tooltip title="Toggle Dark Mode" placement="bottom">
              <Switch onChange={changeNight}/>
            </Tooltip>

          </Grid>

          {!multiSub ? 
            <form className="multisearch" onSubmit={handleSubmit}>
                <TextField 
                  id="standard-basic" 
                  label="Multi Search (separate names with commas)" 
                  onChange={handleChange} 
                  fullWidth="true" 
                  defaultValue={query} 
                  InputProps={{endAdornment: <Button type="submit">Submit</Button>}}
                />
            </form>
            : <br/>
          } 


          {multiSub ? 
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Profile player={multi[0]}/>
            </Grid>
    
            <Grid item xs={12} sm={6}>
              <Profile player={multi[1]}/>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Profile player={multi[2]}/>
            </Grid>
    
            <Grid item xs={12} sm={6}>
              <Profile player={multi[3]}/>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Profile player={multi[4]}/>
            </Grid>
    
            <Grid item xs={12} sm={6}>
              <Profile player={multi[5]}/>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Profile player={multi[6]}/>
            </Grid>
    
            <Grid item xs={12} sm={6}>
              <Profile player={multi[7]}/>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Profile player={multi[8]}/>
            </Grid>
    
            <Grid item xs={12} sm={6}>
              <Profile player={multi[9]}/>
            </Grid>
          </Grid>
          :
          <br></br>
        }
         
        

        </Container>
        
        <Show theme={night}/>
        <br/>

        <Container maxWidth="md"> 
          <Grid container item xs={12} justify="left">
            <Typography variant="caption" color="textSecondary" component="p">You can find the github repository <a href="https://github.com/tianhaoyao/teamO">here</a>. This app was written by <a href="https://tianhaoyao.github.io/">this guy</a>.</Typography>
            <Typography variant="caption" color="textSecondary" component="p">© 2021 TeamO. TeamO isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
            </Typography>
          </Grid>
        </Container>

        </ThemeProvider>
      </div>
    );
  
  
};

export default App;
