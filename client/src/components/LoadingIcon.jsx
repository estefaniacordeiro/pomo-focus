import React from 'react';
import { Spin, Icon } from 'antd';

const loading = <Icon type="loading" style={{ fontSize: 24 }} spin />

const LoadingIcon = props => {
  if(props.show) {
    return (
      <Spin indicator={loading}  style={{margin: '0 10px'}} />
    )
  }
  return null;
}

export default LoadingIcon;