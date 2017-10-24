/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { getDispatchMapper, getAllMapper } from '../../base/redux/dispatch';
//import { Link } from 'react-router-dom';
import { push } from 'react-router-redux'
import classnames from 'classnames';
import { Layout, Breadcrumb, Row, Col, Card, BackTop } from 'antd';

import MyLayout from '../Layout';

const CommonStyles = require("../../components/Styles/Styles.module.scss");
const Styles = require("./ExamplePage.module.scss");


@connect(
  state => ({}),
  getDispatchMapper({
    
  })
)
export default class ExamplePage extends React.Component {
  static propTypes = {
    
  }
  
  showStaticMsg = () => {
    const msg = "Hello, static msg";
  }
  
  showAsyncFooMsg = () => {
    const msg = "Hello, todo async msg";
  }
  
  render() {
    const { Content } = Layout;

    return (
    <MyLayout footer={false}>
      <Content className={classnames([
        Styles.mainContainer,
        CommonStyles.antBsContainer,
        //'ant-col-xs-24 ant-col-sm-24 ant-col-md-18 ant-col-lg-20',
      ])}>
        <Breadcrumb style={{ marginBottom: '12px'}}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={16}>
          <Col className="left" xs={24} sm={8} md={6} lg={5}>
            <Card title="Nạp tiền điện thoại" bordered={true}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </Col>
          
          <Col className="right" xs={24} sm={16} md={18} lg={19}>
            <Row>
              
              <Col>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                <h1>Long content</h1>
                
              </Col>
              
            </Row>

            <div style={{visibility: '_'}}>
              <div>
              </div>

              <button onClick={this.showStaticMsg}>Show msg</button>
              <button onClick={this.showAsyncFooMsg}>Show async</button>
            </div>
            
          </Col>
        </Row>
  
        <BackTop>
          <div className="ant-back-top-inner">UP</div>
        </BackTop>
      </Content>
    </MyLayout>
    );
  }
}
