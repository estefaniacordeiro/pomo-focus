import React from 'react';
import echarts from 'echarts';

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
      // If the task have been deleted, then you can't get the name by id anymore, so use the name pre-stored in stats then.
      const name = tasksIdMap[e._id] ? tasksIdMap[e._id] : e.name;
      if (totalTimeMap[name]) {
        totalTimeMap[name] += e.focusTime;
      } else {
        totalTimeMap[name] = e.focusTime;
      }
    });
    

    const data = Object.keys(totalTimeMap).map( name => {
      return (totalTimeMap[name]/60).toFixed(1);
    })

    const yAxixData = Object.keys(totalTimeMap);

    const option = {
      legend: {},
      grid: {
        left: 150,
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