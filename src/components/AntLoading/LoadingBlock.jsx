// 3rd party
import React from 'react';
import PropTypes from 'prop-types';

export default class LoadingBlock extends React.Component {
  static propTypes = {
    line: PropTypes.number,
  }
  
  render() {
    const {line = 5} = this.props;
    
    return (
      <div className="ant-card-loading-content">
        {line >= 1 && <p><span className="ant-card-loading-block" style={{width: '28%'}}/><span className="ant-card-loading-block" style={{width: '62%'}}/></p>}
        {line >= 2 && <p className="ant-card-loading-block" style={{width: '94%'}}/>}
        {line >= 3 && <p><span className="ant-card-loading-block" style={{width: '22%'}}/><span className="ant-card-loading-block" style={{width: '66%'}}/></p>}
        {line >= 4 && <p><span className="ant-card-loading-block" style={{width: '56%'}}/><span className="ant-card-loading-block" style={{width: '39%'}}/></p>}
        {line >= 5 && <p><span className="ant-card-loading-block" style={{width: '21%'}}/><span className="ant-card-loading-block" style={{width: '15%'}}/><span className="ant-card-loading-block" style={{width: '40%'}}/></p>}
      </div>
    );
  }
}
