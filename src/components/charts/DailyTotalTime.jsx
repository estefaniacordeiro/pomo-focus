import React from 'react';
import echarts from 'echarts';
import moment from 'moment';

class DailyTotalTime extends React.Component {

  constructor(props) {
    super(props);
    this.barContainer = React.createRef();
   
    this.chart = null;
    this.totalTimeMap = {};
  }

  componentWillMount() {




  }

  componentDidMount() {
    const { stats } = this.props;
    this.chart = echarts.init(this.barContainer.current);
    this.chart.setOption(this.generateOption(stats));
  }

  generateOption(stats) {
    const { tasksIdMap } = this.props;

    stats.forEach( e => {
      if (this.totalTimeMap[e._id]) {
        this.totalTimeMap[e._id] += e.focusTime;
      } else {
        this.totalTimeMap[e._id] = e.focusTime;
      }
    });
    

    const data = Object.keys(this.totalTimeMap).map( id => {
      return (this.totalTimeMap[id]/60).toFixed(1);
    })

    const yAxixData = Object.keys(this.totalTimeMap).map( id => tasksIdMap[id]);

    const option = {
      title: {
        text: 'Total time focused on each task',
        left: 'center'
      },
      legend: {},
      grid: {
        left: 200
      },
      xAxis: {
        type: 'value',
        name: 'Hours',
        axisLabel: {

        }
      },
      yAxis: {
        type: 'category',
        data: yAxixData,
      },

      series: {
        name: '',
        type: 'bar',
        data,
        label: {
          normal: {
              show: true,
              textBorderColor: '#333',
              textBorderWidth: 2
          }
        },
        itemStyle: {
          color: '#e24446'
        }
      }
    };

    return option;

  }

  render() {

    return(
      <div>
        <div
          className='charts-container daily-total-time'
          style={{ height: '200px', width: '800px' }}
          ref={this.barContainer}
        >
        </div>
      </div>
    )
  }
}

export default DailyTotalTime;