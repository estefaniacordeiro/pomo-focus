import React from 'react';

class Icon extends React.Component {

  handleClick() {
    console.log('icon clicked');
    
  }

  render() {
    const { name, size, onClick } = this.props;
    const style = {
      fontSize: size + 'px'
    }
    return <i className={name} style={style} onClick={onClick} />;
  }
}


export default Icon;