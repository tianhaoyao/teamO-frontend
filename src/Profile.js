import React from 'react';
import logo from './teamo.png'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

import {Grid, Card, CardActionArea, CardContent, Typography, TextField, CircularProgress} from '@material-ui/core'
import {Edit} from '@material-ui/icons';

import Score from './Score';
import Icons from './Icons';



const API_KEY = process.env.REACT_APP_TEAMO_API_KEY;
const proxyurl = "https://cors-anywhere.herokuapp.com/";

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {profile: {}, query: '', submitted: false, score: 0, prefRole: '', prefRole2: ''}
    this.getRank = this.getRank.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.getRole = this.getRole.bind(this);
  }


  getProfile = async () => {
    const url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${this.state.query}?api_key=${API_KEY}`;
    const response = await fetch(proxyurl + url);

    const data = await response.json();
    return data;

  }

  getRank = async () => {

    let id = await this.getProfile();
    const url = `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id.id}?api_key=${API_KEY}`;
    const response = await fetch(proxyurl + url);
    const data = await response.json();
    let data3;
    let i;
    for(i = 0; i < data.length; i++) {
      if (data[i].queueType.localeCompare('RANKED_SOLO_5x5') == 0) {
        data3 = data[i];

      }
    }

    // UNRANKED
    if(data3 == null) {
      this.setState({profile: {summonerName: this.state.query, tier: 'UNRANKED', rank: 'IV', leaguePoints: 0}});
    }
    else {
      this.setState({profile: data3});
    }
    
  }

  getRole = async () => {

    let id = await this.getProfile();
    const url = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${id.accountId}?queue=420&api_key=${API_KEY}`;
    const response = await fetch(proxyurl + url);
    const data = await response.json();

    let i;
    let rankedCount = {"MID":0, "TOP":0, "SUPPORT":0, "BOTTOM":0, "JUNGLE":0};
    if(data.matches != null){
      for(i = 0; i < data.matches.length; i++) {
        if (data.matches[i].lane.localeCompare('MID') == 0) {
          rankedCount["MID"] += 1;
        }
        else if (data.matches[i].lane.localeCompare('JUNGLE') == 0) {
          rankedCount["JUNGLE"] += 1;
        }
        else if (data.matches[i].lane.localeCompare('BOTTOM') == 0 && data.matches[i].role.localeCompare("DUO_CARRY") == 0) {
          rankedCount["BOTTOM"] += 1;
        }
        else if (data.matches[i].lane.localeCompare('BOTTOM') == 0 && data.matches[i].role.localeCompare("DUO_SUPPORT") == 0) {
          rankedCount["SUPPORT"] += 1;
        }
        else if (data.matches[i].lane.localeCompare('TOP') == 0) {
          rankedCount["TOP"] += 1;
        }
      }
      console.log(rankedCount);
    }
    let firstPref = Object.keys(rankedCount).reduce((a, b) => rankedCount[a] > rankedCount[b] ? a : b)
    this.setState({prefRole: firstPref});
    let temp = rankedCount;
    delete temp[firstPref];
    let secondPref = Object.keys(temp).reduce((a, b) => temp[a] > temp[b] ? a : b)
    this.setState({prefRole2: secondPref});
    console.log("set role", rankedCount)
    this.setState({role: rankedCount});

  }

  handleChange(event) {
    console.log("change", event.target.value)
    this.setState({query: event.target.value});
  }

  handleSubmit(event) {
    this.setState({submitted: true});
    this.getRank();
    this.getRole();
    event.preventDefault();
  }

  handleEdit(event) {
    this.setState({profile: {}, submitted: false});
  }

  setScore(score) {
    alert("got", score);
  }

  render(){
    const summonerName = this.state.profile.summonerName;
    const tier = this.state.profile.tier;
    const division = this.state.profile.rank;
    const role = this.state.role;
    const lp = this.state.profile.leaguePoints;
    const prefRole = this.state.prefRole;
    const prefRole2 = this.state.prefRole2;
    const closeStyle = {
      height: "100%",

    };
    return (
      <div className="Profile">
        <Card className="profile" style={{backgroundColor: "#F5F5F5"}}>
          <CardActionArea>
            <CardContent>
              {(this.state.submitted) ? 
              <div>
                <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={3}>
                    {(tier != null && role != null)?
                    <Icons 
                      tier={tier}
                      division={division}>
                    </Icons>
                    :
                    <br></br>
                    }
                  </Grid>
                  <Grid item xs={12} sm={7}>
                  <Typography gutterBottom variant="h5" component="h2">
                  {summonerName}
                  </Typography> 

                  {(tier!="UNRANKED") ?
                  <Typography variant="body2" color="textSecondary" component="p">
                     {tier} {division}
                  </Typography>
                  :
                  <Typography variant="body2" color="textSecondary" component="p">
                     {tier}
                  </Typography>
                  }
                  {(tier != null && role != null && lp != null)?
                  <div>
                    <Score
                    name={summonerName}
                    tier={tier}
                    division={division}
                    lp={lp}
                    wins="0"
                    losses="0"
                    pref={prefRole}
                    pref2={prefRole2}
                  />
                  <Typography variant="body2" color="textSecondary" component="p">
                   {/* mid: {role.MID} bot: {role.BOTTOM} supp: {role.SUPPORT} top: {role.TOP} jg: {role.JUNGLE} */}
                   Pref: {prefRole}, {prefRole2}
                  </Typography>
                  
                  {/* <Button onClick={console.log(this.state.score)}>yo</Button>
                  {console.log('z',this.state.score)} */}
                  </div>
                  
                  : <CircularProgress />
                  }
                  
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <div style={closeStyle}>
                    <Button style={{ "minHeight": "100px", "maxWidth": "50px"}} color="primary" onClick={this.handleEdit}>
                      <Edit/>
                    </Button>
                    </div>
                  </Grid>
                </Grid>
              </div>
              
              : 
              <div>
                <form className="summonersearch" onSubmit={this.handleSubmit}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={9}>
                      <TextField id="standard-basic" label="Summoner Name" onChange={this.handleChange} fullWidth="true" defaultValue={this.state.query}/>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Button type="submit">Submit</Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
              
              }
            
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    );
  }
  
}

export default Profile;
