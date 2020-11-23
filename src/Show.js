import React from 'react';
import logo from './teamo.png'
import ReactDOM from 'react-dom';

import {Container, Grid, Divider, Button, Card, Typography} from '@material-ui/core'

import Profile from './Profile';
import Sort from './Sort';
import Results from './Results';
import TotalScore from './TotalScore';

import {useSelector} from 'react-redux';
import scoreReducer from './reducers/scoreCollection';
import teamReducer from './reducers/teamReducer';

import { findAllByDisplayValue } from '@testing-library/react';


function Show(){
  


    return (
      <div className="Show">
        <Container maxWidth="md">
        
           <Sort></Sort>
           {/* <Button>Show me the teams</Button> */}

           

           <Grid container spacing={3}>

             
           
             <Grid item xs={12} sm={6}>
               <Results
                 team="0"
                 pos="0"
               />
             </Grid>

             <Grid item xs={12} sm={6}>
               <Results
                 team="1"
                 pos="0"
               />
             </Grid>

             <Grid item xs={12} sm={6}>
               <Results
                 team="0"
                 pos="1"
               />
             </Grid>

             <Grid item xs={12} sm={6}>
               <Results
                 team="1"
                 pos="1"
               />
             </Grid>


             <Grid item xs={12} sm={6}>
               <Results
                 team="0"
                 pos="2"
               />
             </Grid>

             <Grid item xs={12} sm={6}>
               <Results
                 team="1"
                 pos="2"
               />
             </Grid>

             <Grid item xs={12} sm={6}>
               <Results
                 team="0"
                 pos="3"
               />
             </Grid>

             <Grid item xs={12} sm={6}>
               <Results
                 team="1"
                 pos="3"
               />
             </Grid>

             <Grid item xs={12} sm={6}>
               <Results
                 team="0"
                 pos="4"
               />
             </Grid>

             <Grid item xs={12} sm={6}>
               <Results
                 team="1"
                 pos="4"
               />
             </Grid>

           </Grid>

           <TotalScore/>

         
       </Container>
        
  
        
  
        
        
      </div>
    );
  
  
};

export default Show;
