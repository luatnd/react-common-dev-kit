import React from 'react';
import { connect } from "react-redux";
import classnames from 'classnames';
import { Layout, Breadcrumb, BackTop } from 'antd';

import MyLayout from '../Layout';
import { getDispatchMapper } from '../../base/redux/dispatch';

const CommonStyles = require("../../components/Styles/Styles.module.scss");
const Styles = require("./HomePage.module.scss");

@connect(
  state => ({}),
  getDispatchMapper({
    
  })
)
export default class HomePage extends React.Component {
  static propTypes = {
    
  }
  
  reloadClientBrowser = () => {
    console.log("Don't need to reload anymore");
  }
  
  render() {
    const { Content } = Layout;
    
    return (
    <MyLayout>
      <Content className={classnames([
        Styles.mainContainer,
        CommonStyles.antBsContainer,
      ])}>
        <Breadcrumb style={{ marginBottom: '12px'}}>
          <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        </Breadcrumb>
        
        <div style={{minHeight: '500px'}}>
          <h2>Hi, this is your Homepage</h2>
          {this.reloadClientBrowser()}
        </div>
  
        <BackTop>
          <div className="ant-back-top-inner">UP</div>
        </BackTop>
      </Content>
    </MyLayout>
    );
  }
}
