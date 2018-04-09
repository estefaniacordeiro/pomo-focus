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

  componentDidMount() {
    const { stats } = this.props;

    this.chart = echarts.init(this.barContainer.current);
    if (stats) {
      this.chart.setOption(this.generateOption(stats));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { stats } = nextProps;

    if (stats) {
      this.chart.setOption(this.generateOption(stats));
    } else {
      this.chart.clear();
    }
  }

  generateOption(stats) {
    const { tasksIdMap } = this.props;
    const totalTimeMap = {};
    stats.forEach( e => {
      if (totalTimeMap[e._id]) {
        totalTimeMap[e._id] += e.focusTime;
      } else {
        totalTimeMap[e._id] = e.focusTime;
      }
    });
    

    const data = Object.keys(totalTimeMap).map( id => {
      return (totalTimeMap[id]/60).toFixed(1);
    })

    const yAxixData = Object.keys(totalTimeMap).map( id => tasksIdMap[id]);

    const option = {
      legend: {},
      grid: {
        left: 200,
        top: 20,
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
    const { stats } = this.props;

    return(
      <div className="charts-container">
        <h3>Time focused on each task</h3>
        { !!stats ? null : 
        <div>
          No data
        </div> }
        <div
          className='daily-total-time'
          style={{ height: '200px', width: '800px' }}
          ref={this.barContainer}
        >
        </div>
      </div>
    )
  }
}

export default DailyTotalTime;