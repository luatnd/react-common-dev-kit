import React from 'react';
import PropTypes from 'prop-types';
import { Layout as AntLayout, LocaleProvider } from 'antd';
import localeVi from 'antd/lib/locale-provider/vi_VN';

import BsNav from '../components/BsNav/BsNav';
import BsFooter from '../components/BsFooter/BsFooter';

import Styles from './Layout.module.scss';
import CommonStyles from '../components/Styles/Styles.module.scss';

export default class Layout extends React.Component {
  static propTypes = {
    header: PropTypes.bool,
    footer: PropTypes.bool,
  }
  
  render() {
    const {
      header = true,
      footer = true
    } = this.props;
    
    return (
      <LocaleProvider locale={localeVi}>
        <AntLayout className={Styles.layoutContainer}>
          {header && <BsNav/>}
          <div className={CommonStyles.mainContainer}>
            {this.props.children}
          </div>
          {footer && <BsFooter/>}
        </AntLayout>
      </LocaleProvider>
    );
  }
}
