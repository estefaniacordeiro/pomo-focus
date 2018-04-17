import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
import '../../css/charts.css';

function renderItem(params, api) {
  const categoryIndex = api.value(0);
  const start = api.coord([api.value(1), categoryIndex]); // 返回坐标 [x, y]
  const end = api.coord([api.value(2), categoryIndex]);
  const height = api.size([0, 1])[1] * 0.6;

  return {
    type: 'rect',
    // 用后面的矩形截取前面的矩形
    shape: echarts.graphic.clipRectByRect({
      x: start[0],
      y: start[1] - height / 2, // start[1] 是矩阵左定点的 y 坐标, 这里改成矩阵的中间出发
      width: end[0] - start[0],
      height: height
    }, {
        // 这四个值都是固定的, 这是整个坐标轴范围的起始和宽高
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
      }),
    style: api.style()
  };
}


function getOption(data, date, tasksIdMap) {
  const taskNames = Object.values(tasksIdMap).map(name => ({name}));
  return ({
    tooltip: {
      formatter: function (params) {
        return params.marker + params.data.name + ': ' + params.value[3] + ' min';
      }
    },
    grid: {
      height: 100,
      top: 20,
    },
    xAxis: {
      min: 'dataMin',
      max: value => value.max + 15 * 60 * 1000,
      scale: true,
      interval: 3600000,
      axisLabel: {
        formatter: function (val) {
          return moment(val).format('HH:mm');
        }
      }
    },
    yAxis: {
      data: [date]
    },
    series: [{
      type: 'custom',
      renderItem: renderItem,
      itemStyle: {
        normal: {
          opacity: 0.8
        }
      },
      encode: { // 维度映射
        x: [1, 2],
        y: 0
      },
      data: data
    }]
  })
}

class TimelineBar extends React.Component {
  constructor(props) {
    super(props);
    this.barContainer = React.createRef();
    this.colorMap = {};
    this.colors = ['#206be5', '#e24446', '#4bed84', '#ffa42d', '#c2e07b'];
    this.tasksCount = 0;
    this.data = null;
    this.chart = null;
  }

  componentDidMount() {
    const { date, tasksIdMap, stats } = this.props;
    this.chart = echarts.init(this.barContainer.current);
    if (stats) {
      this.data = this.generateData(stats);
      this.chart.setOption(getOption(this.data, date, tasksIdMap));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { date, tasksIdMap, stats } = nextProps; 
    if (stats) {
      this.data = this.generateData(stats);
      this.chart.setOption(getOption(this.data, date, tasksIdMap));
    } else {
      this.chart.clear();
    }
  }

  generateData = (stats) => {
    const { tasksIdMap } = this.props;
    const data = [];
    stats.forEach(e => {
      const block = {};
      // If the task have been deleted, then you can't get the name by id anymore, so use the name pre-stored in stats then.
      block.name = tasksIdMap[e._id] ? tasksIdMap[e._id] : e.name;
      block.value = this.getTimePeriod(e);
      block.itemStyle = this.getItemStyle(e);
      data.push(block);
    })
    
    return data;
  }

  getTimePeriod = (task) => {
    const endedAt = task.endedAt,
          focusTime = task.focusTime;
    const startedAt = endedAt - focusTime * 60 * 1000;
    return [0, startedAt, endedAt, focusTime ];
  }

  getItemStyle = (task) => {
    const name = task._id;
    if (!this.colorMap[name]) {
      this.colorMap[name] = this.colors[this.tasksCount++];
    }

    return ({
      normal: {
        color: this.colorMap[name]
      }
    })
  }

  render() {
    const { stats } = this.props;

    return (
      <div className="charts-container">
        <h3>Focus Time Block</h3>
        { !!stats ? null : (
          <div>
            No data
          </div>
        )}
        <div
          className='timeline-bar-chart'
          style={{ height: '200px', width: '800px' }}
          ref={this.barContainer}
        >
        </div>
      </div>
    )
  }
}

export default TimelineBar;