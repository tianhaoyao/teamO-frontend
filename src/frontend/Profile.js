import React from 'react';
import Button from '@material-ui/core/Button';

import {Grid, Card, CardActionArea, CardContent, TextField, CircularProgress} from '@material-ui/core'

import Score from './Score';
import Icons from './Icons';

const NUM_RECENT_MATCH = 7;
const BACKEND_URL = 'https://team-sort.herokuapp.com/';

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.getRank = this.getRank.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getCache = this.getCache.bind(this);
    this.setUsingCache = this.setUsingCache.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getRole = this.getRole.bind(this);
    if(!this.props.player) {
      this.state = {profile: {}, query: '', submitted: false, score: 0, prefRole: '', prefRole2: '', stats: {}}
    }
    else {
      this.state = {profile: {}, query: this.props.player, submitted: true, score: 0, prefRole: '', prefRole2: '', stats: {}}
    }
  }

  componentDidMount() {
    if(this.props.player) {
      this.setState({query: this.props.player});
      this.setState({submitted: true});
      this.getCache();
      
    }
  }

  getCache = async () => {
    const url = BACKEND_URL + `cache/${this.state.query}/`;
    try{
      const response = await fetch(url);
      const data = await response.json();
      if(Object.keys(data).length !== 0) {
        this.setState({ cached: true })
        this.setUsingCache(data);
        return data;
      }
      else {
        this.setState({ cached: false })
        this.getRank();
        this.getRole();
      }
      
    }
    catch(err){
      console.log(err)
    }
  }

  insertCache = (name, tier, rank, lp, cs, kda, dmg, gold, kp, pref1, pref2) => {
    const url = BACKEND_URL + `insertcache/`;
    const simplename = name.replace(/\s+/g, '').toLowerCase();
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        simplename: simplename,
        tier: tier,
        rank: rank,
        lp: lp,
        cs: cs,
        kda: kda,
        dmg: dmg,
        gold: gold,
        kp: kp,
        pref1: pref1,
        pref2: pref2
      })
    });

  }

  setUsingCache = async(data) => {
    this.setState({
      profile: {
        summonerName: data.name,
        tier: data.tier,
        rank: data.rank,
        leaguePoints: data.lp
      }, 
      query: this.props.player, 
      prefRole: data.pref1, 
      prefRole2: data.pref2, 
      role: {
        dummydata: 0
      },
      stats: {
        cspm: data.cs,
        dmgS: data.dmg,
        goldS: data.gold,
        kda: data.kda,
        kpS: data.kp
      }})
  }

  getProfile = async () => {
    const url = BACKEND_URL + `summonerName/${this.state.query}/`;
    try{
      const response = await fetch(url);
    
      const data = await response.json();
      let profile = {...this.state.profile}
      
      profile.summonerName = data.name
      profile.accountId = data.accountId
      this.setState({profile})
      return data;
    }
    catch(err){
      alert("Player not found");
    }
    

  }

  getRank = async () => {
    try{
      let id = await this.getProfile();

      const url = BACKEND_URL + `summonerId/${id.id}`;
    
      const response = await fetch(url);
      const data = await response.json();
  
      let data3;
      let i;
      for(i = 0; i < data.length; i++) {
        if (data[i].queueType.localeCompare('RANKED_SOLO_5x5') === 0) {
          data3 = data[i];
  
        }
      }
  
      // UNRANKED
      if(data3 == null) {
        this.setState(prevState => ({
          profile: {
              ...prevState.profile,
              tier: 'UNRANKED', 
              rank: 'IV', 
              leaguePoints: 0, 
              summonerId: id.id
          }
        }));
      }
      else {
        this.setState({profile: data3});
      }
    }
    catch(err){
        console.log(err)
        this.setState({submitted: false})
    }
    
    
  }

  getRole = async () => {
    try{
      let id = await this.getProfile();
      let url = BACKEND_URL + `games/${id.accountId}`;
    
      let response = await fetch(url);
      let data = await response.json();
  
      let i;
      let matchdata = [];
      let kills = 0;
      let deaths = 0;
      let assists = 0;
      let cs = 0;
      let matchtime = 0;
      let kpS = 0;
      let dmgS = 0;
      let goldS = 0;
      let currentmatch;
      let rankedCount = {"MID":0, "TOP":0, "SUPP":0, "BOT":0, "JG":0};

      let selectMatch = {"MID":[], "TOP":[], "SUPP":[], "BOT":[], "JG":[]};

      if(data.matches != null && data.matches !== undefined){
        for(i = 0; i < data.matches.length; i++) {
          if (data.matches[i].lane.localeCompare('MID') === 0) {
            rankedCount["MID"] += 1;
            selectMatch["MID"].push(i);
          }
          else if (data.matches[i].lane.localeCompare('JUNGLE') === 0) {
            rankedCount["JG"] += 1;
            selectMatch["JG"].push(i);
          }
          else if (data.matches[i].lane.localeCompare('BOTTOM') === 0 && data.matches[i].role.localeCompare("DUO_CARRY") === 0) {
            rankedCount["BOT"] += 1;
            selectMatch["BOT"].push(i);
          }
          else if (data.matches[i].lane.localeCompare('BOTTOM') === 0 && data.matches[i].role.localeCompare("DUO_SUPPORT") === 0) {
            rankedCount["SUPP"] += 1;
            selectMatch["SUPP"].push(i);
          }
          else if (data.matches[i].lane.localeCompare('TOP') === 0) {
            rankedCount["TOP"] += 1;
            selectMatch["TOP"].push(i);
          }
        }

        let firstPref = Object.keys(rankedCount).reduce((a, b) => rankedCount[a] > rankedCount[b] ? a : b)
        this.setState({prefRole: firstPref});

        let dataset = []
        switch(firstPref) {
          case "MID":
            dataset = selectMatch["MID"];
            break;
          case "JG":
            dataset = selectMatch["JG"];
            break;
          case "BOT":
            dataset = selectMatch["BOT"];
            break;
          case "SUPP":
            dataset = selectMatch["SUPP"];
            break;
          case "TOP":
            dataset = selectMatch["TOP"];
            break;
          default: 
            dataset = selectMatch["MID"];
        }
        
        if(dataset.length > NUM_RECENT_MATCH){
          dataset = dataset.slice(0, NUM_RECENT_MATCH);
        }

        for(let i = 0; i < dataset.length; i++) {
          currentmatch = await this.getMatchStats(data.matches[dataset[i]]);
          kills += currentmatch.kills;
          deaths += currentmatch.deaths;
          assists += currentmatch.assists;
          cs += currentmatch.cs;
          matchtime += currentmatch.matchtime;
          kpS += currentmatch.compareKP;
          dmgS += currentmatch.damageShare;
          goldS += currentmatch.goldShare;
          matchdata.push(currentmatch);
  
        }

        kpS /= NUM_RECENT_MATCH;
        goldS /= NUM_RECENT_MATCH;
        dmgS /= NUM_RECENT_MATCH;
    
    
        let kda = (kills + assists) / deaths;
        let cspm = cs/matchtime*60;

        this.setState({stats: {kda: kda, cspm: cspm, kpS: kpS, goldS: goldS, dmgS: dmgS}});
        
        


        let temp = rankedCount;
        delete temp[firstPref];
        let secondPref = Object.keys(temp).reduce((a, b) => temp[a] > temp[b] ? a : b)
        this.setState({prefRole2: secondPref});
        this.setState({role: rankedCount});
  
      }
      else {
        this.setState({stats: {kda: 2, cspm: 5, kpS: 0.2, goldS: 0.2, dmgS: 0.2}});
        this.setState({prefRole: "SUPP"});
        this.setState({prefRole2: "MID"});
        this.setState({role: "dummydata"});
      }
  
      
    }
    catch(err) {
      console.log(err);
      this.setState({submitted: false});
    }

  }

  getMatchStats = async (match) => {
    const url = BACKEND_URL + `match/${match.gameId}`;
    const response = await fetch(url);
    const matchdata = await response.json();

    let matchtime = matchdata.gameDuration;
    let participantid = -1;
    let teamid = -1;
    let team100 = [];
    let team200 = [];
    let friendlyteam = []
    await this.getProfile();
    for(let i = 0; i < 10; i++) {
      try{
        if(matchdata.participantIdentities[i].player.accountId === this.state.profile.accountId){
          
          participantid = i;
          teamid = matchdata.participants[i].teamId;
        }
        if(matchdata.participants[i].teamId === 100) {
          team100.push(matchdata.participants[i].stats);
        }
        else if(matchdata.participants[i].teamId === 200) {
          team200.push(matchdata.participants[i].stats);
        }

      }
      catch(err) {
        console.log(err);
      }
    }

    if(teamid === 100) {
      friendlyteam = team100;
    }
    else {
      friendlyteam = team200;
    }

  
    let stats = {}
    try {
      stats = matchdata.participants[participantid].stats;
      let teamstats = this.getTeamStats(stats, friendlyteam);

      let kills = stats.kills;
      let deaths = stats.deaths;
      let assists = stats.assists;
      let cs = stats.totalMinionsKilled;

      return Object.assign({kills: kills, deaths: deaths, assists: assists, cs: cs, matchtime: matchtime}, teamstats);
    }
    catch(err) {
      console.log(err)
    }

    
  }

  cleanName = (name) => {
    return name.replace(/\s+/g, '').toLowerCase();
  }

  

  getTeamStats = (stats, friendlyteam) => {
    let totalkills = 0;
    let totalDamage = 0;
    //let totalDamageTurrets = 0;
    let totalGold = 0;

    for(let i = 0; i < friendlyteam.length; i++) {
      totalkills += friendlyteam[i].kills;
      totalDamage += friendlyteam[i].magicDamageDealtToChampions + friendlyteam[i].physicalDamageDealtToChampions + friendlyteam[i].trueDamageDealtToChampions;
      //totalDamageTurrets += friendlyteam[i].damageDealtToTurrets;
      totalGold += friendlyteam[i].goldEarned;
    }

    let goldShare = stats.goldEarned / totalGold;
    let damageShare = (stats.magicDamageDealtToChampions + stats.physicalDamageDealtToChampions + stats.trueDamageDealtToChampions)/totalDamage;
    let compareKP = 0;
    let totalKP = 0;

    for(let i = 0; i < friendlyteam.length; i++) {
      totalKP += (friendlyteam[i].kills + friendlyteam[i].assists)/totalkills;
    }
    
    compareKP = ((stats.kills + stats.assists)/totalkills)/totalKP;
    
    return {goldShare: goldShare, compareKP: compareKP, damageShare: damageShare};
    
  }

  handleChange(event) {
    this.setState({query: event.target.value});
  }

  handleSubmit(event) {

    this.setState({submitted: true});
    this.getCache();
    event.preventDefault();

    
  }

  setScore(score) {
    alert("got", score);
  }

  render(){
    const summonerName = this.state.profile.summonerName;
    const tier = this.state.profile.tier;
    const division = this.state.profile.rank;
    const lp = this.state.profile.leaguePoints;
    const prefRole = this.state.prefRole;
    const prefRole2 = this.state.prefRole2;
    const cspm = this.state.stats.cspm;
    const kda = this.state.stats.kda;
    const goldS = this.state.stats.goldS;
    const kpS = this.state.stats.kpS;
    const dmgS = this.state.stats.dmgS;
    const role = this.state.role;

    if(!this.state.cached) {
      if(summonerName != null && tier != null && lp != null && cspm != null && kda != null && prefRole != null && prefRole2 != null && role != null) {
        this.setState({cached: true})
        this.insertCache(summonerName, tier, division, lp, cspm, kda, dmgS, goldS, kpS, prefRole, prefRole2)
      }
      
    }
    

    return (
      <div className="Profile">
        <Card className="profile">
          <CardActionArea>
            <CardContent>
              {(this.state.submitted) ? 
              <div>
                <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={3}>
                    {(tier != null && division != null)?
                    <Icons 
                      tier={tier}
                      division={division}>
                    </Icons>
                    :
                    <br></br>
                    }
                </Grid>
                <Grid item xs={12} sm={9}>
                  
                  {(summonerName != null && tier != null && lp != null && cspm != null && kda != null && prefRole != null && prefRole2 != null && role != null)?
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
                    kda={kda}
                    cspm={cspm}
                    kpS={kpS}
                    goldS={goldS}
                    dmgS={dmgS}
                  />
                  
                  
                  </div>
                  
                  : 
                      <CircularProgress />
                      
                  }
                  
                  </Grid>
                  
                  {/* <Grid item xs={12} sm={2}>
                    
                  </Grid> */}
                </Grid>
              </div>
              
              : 
              <div>
                <form className="summonersearch" onSubmit={this.handleSubmit}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={9}>
                      <TextField id={this.props.id} label="Summoner Name" onChange={this.handleChange} fullWidth="true" defaultValue={this.state.query}/>
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
