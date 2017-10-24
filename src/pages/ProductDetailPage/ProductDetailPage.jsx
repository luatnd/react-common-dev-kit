/* eslint-disable */

// 3rd
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { Layout, Breadcrumb, Row, Col, Card, BackTop } from 'antd'
import { Form, Input, Button, Radio, Icon } from 'antd'

// My libs / logic
import { restoreStringFromFriendlyUrl } from '../../helpers/UrlHelper'

// My UI
import MyLayout from '../Layout';
const Styles = require("./ProductDetailPage.module.scss");
const CommonStyles = require("../../components/Styles/Styles.module.scss");

export default class ProductDetailPage extends React.Component {
  render() {
    console.log("ProductDetailPape render");

    const { Content } = Layout;
    const params = this.props.match.params;
    
    return (
      <MyLayout>
        <Content className={CommonStyles.antBsContainer}>
          
          <Breadcrumb separator=">" style={{ marginBottom: '12px'}}>
            <Breadcrumb.Item><Icon type="home" /> <a href="/">Trang chủ</a></Breadcrumb.Item>
            <Breadcrumb.Item><Icon type="gift" /> Chợ ++</Breadcrumb.Item>
            <Breadcrumb.Item><Icon type="gift" /> <span style={{textTransform: 'capitalize'}}>{params.categoryName}</span></Breadcrumb.Item>
            <Breadcrumb.Item><Icon type="gift" /> {restoreStringFromFriendlyUrl(params.productName)}</Breadcrumb.Item>
          </Breadcrumb>
          
          <div>
            <h1>Page Product detail content</h1>
          </div>
          
          <BackTop className={CommonStyles.backTop}>
            <div className="ant-back-top-content" style={{fontSize: '24px', lineHeight: '40px'}}><Icon type="to-top"/></div>
          </BackTop>
          
        </Content>
      </MyLayout>
    );
  }
}
