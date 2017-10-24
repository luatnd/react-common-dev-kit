// 3rd party
import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'

// My logic

// My UI
import Styles from "./KeyValueInfo.module.scss"


export default class KeyValueInfo extends React.PureComponent {
  static propTypes = {
    dataSource: PropTypes.array,
    scroll: PropTypes.object,
  }
  
  render() {
    const {dataSource, scroll, className, style = {}} = this.props;
    const htmlProps = omit(this.props, ['dataSource', 'scroll', 'className', 'style']);
    const cln = `${className} ${Styles.container}`;
    
    return (
      <div {...htmlProps} className={cln} style={{...style, height: `${scroll.y}px`}}>
        <ul>
        {dataSource.map((row) => {
          return <li key={row.key}>
            <p className={Styles.theAttr}>{row.theAttr}</p>
            <div className={Styles.theVal}>{row.theVal}</div>
          </li>
        })}
        </ul>
      </div>
    );
  }
}
