import React, { useState, useEffect }  from 'react';

import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';

function Matchup() {



    const scoresArray = useSelector(state => state.teamReducer);

    const [top0, setTop0] = useState(0);
    const [top1, setTop1] = useState(0);
    const [jg0, setJg0] = useState(0);
    const [jg1, setJg1] = useState(0);
    const [mid0, setMid0] = useState(0);
    const [mid1, setMid1] = useState(0);
    const [bot0, setBot0] = useState(0);
    const [bot1, setBot1] = useState(0);
    const [sup0, setSup0] = useState(0);
    const [sup1, setSup1] = useState(0);

    const [show, setShow] = useState(false);

    useEffect(() => {
      // setShow(hasScore(scoresArray));
     

      setTop0(cleanse(scoresArray[0][0]));
      setTop1(cleanse(scoresArray[1][0]));
      setJg0(cleanse(scoresArray[0][1]));
      setJg1(cleanse(scoresArray[1][1]));
      setMid0(cleanse(scoresArray[0][2]));
      setMid1(cleanse(scoresArray[1][2]));
      setBot0(cleanse(scoresArray[0][3]));
      setBot1(cleanse(scoresArray[1][3]));
      setSup0(cleanse(scoresArray[0][4]));
      setSup1(cleanse(scoresArray[1][4]));
      //updateSeries(series)

    }, [scoresArray]);

    function cleanse(score) {
      if(score !== '-') {
        setShow(true)
        return score[1]
      }
      return 0
    }

    let options = {
        
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            stackType: '100%'
        },
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        xaxis: {
            categories: ['TOP', 'JG', 'MID', 'BOT', 'SUPP'],
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val + " skill points"
                }
            }
        },
        fill: {
            opacity: 1

        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        },
        colors: ['#5BA1E5', '#E55B89']
    };

    let series = [{
          name: 'Team 1',
          data: [top0, jg0, mid0, bot0, sup0]
      }, {
          name: 'Team 2',
          data: [top1, jg1, mid1, bot1, sup1]
      }];

    
    return ( 
      <div>
        {show ?
        <div>
          <Chart options={options} series={series}  type='bar' />
        </div>
        :
        
        <br/>
        
        }
      </div>
    );


};

export default Matchup;