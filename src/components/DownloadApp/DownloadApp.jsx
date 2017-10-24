import React from 'react'

import Styles from "./DownloadApp.module.scss"

import appStoreAndroid from '../../assets/img/appstore-download-android.png';
import appStoreIos from '../../assets/img/appstore-download-ios.png';


export default class DownloadApp extends React.Component {
  render() {
    return (
      <div className={Styles.container}>
        {this.props.children}
      
        <div className={Styles.btnSection}>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img className={Styles.img} src={appStoreAndroid} alt="Download campus cộng trên play store"/>
          </a>
        
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img className={Styles.img} src={appStoreIos} alt="Download campus cộng trên apple store"/>
          </a>
        </div>

      </div>
    );
  }
}
