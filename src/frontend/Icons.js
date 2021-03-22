import React from "react";

function Icons(props){


    let divisionLookup = {"IV": 4,
                         "III": 3,
                          "II": 2,
                           "I": 1
        }

    const style = {
        height: 100
    }

    return(
        <div>
            {props.tier === "UNRANKED" ?
                <img style={style} src={require(`./resources/ranks/default.png`)}></img>
            :
                <img style={style} src={require(`./resources/ranks/${props.tier}_${divisionLookup[props.division]}.png`)}></img>
            }
        </div>
    );
        
        
    
    
    
}

export default Icons;