import React from 'react';
import classnames from 'classnames';
import { Layout } from 'antd';

import MyLayout from '../Layout';
import img404 from '../../assets/img/minion_day8_404_2.jpg';

const CommonStyles = require("../../components/Styles/Styles.module.scss");
const Styles = require("./Page404.module.scss");


export default class Page404 extends React.Component {
  render() {
    const {Content} = Layout;
    
    return (
      <MyLayout footer={false}>
        <Content className={classnames([Styles.mainContainer, CommonStyles.antBsContainer])}>
          
          <div>
            <h2 style={{marginBottom:'20px', textAlign: 'center'}}>Bạn đang truy cập một trang không tồn tại</h2>
          </div>
          
          <div className={Styles.img404Container}>
            <img src={img404} alt="404 not found"/>
          </div>
        
        </Content>
      </MyLayout>
    );
  }
}
