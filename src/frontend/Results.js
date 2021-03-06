import React from 'react';

import {Grid, Card, Typography, CardActionArea, CardContent} from '@material-ui/core'


import {useSelector} from 'react-redux';
import Icons from './Icons';

import top from './resources/TOP.png';
import jungle from './resources/JUNGLE.png';
import mid from './resources/MID.png';
import bottom from './resources/BOTTOM.png';
import support from './resources/SUPPORT.png';

function Results(props) {
   const teams = useSelector(state => state.teamReducer);
   let position = "";
   switch(props.pos) {
      case "0":
        position = top;
        break;
      case "1":
        position = jungle;
        break;
      case "2":
        position = mid;
        break;
      case "3":
        position = bottom;
        break;
      case "4":
        position = support;
        break;
      default:
        position = support;
   }

   let color;
   if(props.team === "1") {
      if((typeof teams[props.team] !== "undefined" && teams[props.team][props.pos] !== "-")) {
        if(props.theme) {
          //red team, dark, picked
          color = "#700629";
        }
        else {
          //red team, light, picked
          color = "#E55B89";
        }
        
      }
      else {
        if(props.theme) {
          //red team, dark, empty
          color = "#960938";
        }
        else {
          //red team, light, empty
          color = "#FF6699";
        }
        
      }
   }
   else {
    if((typeof teams[props.team] !== "undefined" && teams[props.team][props.pos] !== "-")) {
      if(props.theme) {
        //blue team, dark, picked 
        color = "#04265c";
      }
      else{
        //blue team, light, picked
        color = "#5BA1E5"
      }
      
    }
    else {
      if(props.theme) {
        //blue team, dark, empty
        color = "#013280";
      }
      else{
        //blue team, light, empty
        color = "#66B3FF";
      }
      
    }
   }  

    return (
      <div>
        <Card className="profile" style={{backgroundColor: color}}>
          <CardActionArea>
            <CardContent>
              <div>
                <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={3}>
                  {(teams[props.team][props.pos][4] != null && teams[props.team][props.pos][5] != null)? 
                  <Icons 
                    tier={teams[props.team][props.pos][4]}
                    division={teams[props.team][props.pos][5]}>
                  </Icons>
                  //<br></br>
                  :
                  <br/>
                }
                  </Grid>
                  <Grid item xs={12} sm={7}>
                  {(typeof teams[props.team] !== "undefined" && teams[props.team][props.pos] !== "-") ? 
                  <div>
                      <Typography gutterBottom variant="h5" component="h2">
                        {teams[props.team][props.pos][0]}
                      </Typography> 
    
                      {(teams[props.team][props.pos][4] !== "UNRANKED") ?
                      <Typography variant="body2" color="textSecondary" component="p">
                         {teams[props.team][props.pos][4]} {teams[props.team][props.pos][5]}
                      </Typography>
                      :
                      <Typography variant="body2" color="textSecondary" component="p">
                         {teams[props.team][props.pos][4]}
                      </Typography>
                      }
                      <div>
                        <Typography variant="body2" color="textSecondary" component="p">
                           Score: {teams[props.team][props.pos][1]}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                        Pref: {teams[props.team][props.pos][2]}, {teams[props.team][props.pos][3]}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                           "{teams[props.team][props.pos][6]}"
                         </Typography>
                      
                      </div>
                  </div>
                  :
                  <br/>
                  } 

                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <img src={position} style={{width:50}} alt="Position"/>
                  </Grid>
 
                </Grid>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    );
  
  
};

export default Results;
