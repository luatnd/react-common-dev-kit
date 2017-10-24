import React from 'react';
import { Row, Col, Card } from 'antd';

const Styles = require("./AdBanner.module.scss");


export default class AdBanner extends React.Component {
  render() {
    return (
      <Row gutter={24}>
        <Col xs={0} sm={24}>
          <Card bordered={false} {...this.props} className={Styles.adBannerC}>
            {this.props.children}
          </Card>
        </Col>
      </Row>
    );
  }
}
