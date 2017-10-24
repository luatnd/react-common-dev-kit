/**
 * NOTE: This file currently support EPAY payment method only
 * IF any payment method available, you need to refactor + re-structure the code
 */

// 3rd party
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { getDispatchMapper } from '../../../base/redux/dispatch';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux'
import classnames from 'classnames';
import { Row, Col, Progress, Button, Icon, Alert } from 'antd';
import queryString from 'query-string';

// My logic

// My UI
import Styles from "./PaymentSuccess.module.scss"
import TopupCheckoutInfo from "../CheckoutInfo/TopupCheckoutInfo"
import { SITE_URLS } from '../../../siteConfig'
const redirectTimeout = 600; // Redirect after Xs


@withRouter
@connect(
  state => ({email: state.checkoutPage.choosePayment.email}),
  getDispatchMapper({
    push,
  })
)
export default class PaymentSuccess extends React.PureComponent {
  static propTypes = {
    error: PropTypes.bool,
    email: PropTypes.string,
  }
  
  state = {
    count: redirectTimeout,
  }
  
  myInterval;
  componentWillMount() {
    this.myInterval = setInterval(() => {
      if (this.state.count < 0) {
        return;
      }
  
      this.setState((prevState) => ({count: prevState.count - 1}));
      
      if (this.state.count <= 0) {
        setTimeout(() => window.location.href = '/' + SITE_URLS.shop.uri, 500)
      }
    }, 1000);
  }
  
  componentWillUnmount() {
    clearInterval(this.myInterval);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.count !== this.state.count;
  }
  
  render() {
    //console.log("PaymentSuccess render");
    
    const {count} = this.state;
    const {email} = this.props;
  
    const queryStr = this.props.location.search;
    const queryStringObj = queryString.parse(queryStr);
    const transactionId = queryStringObj.transactionId;
  
    const percent = (redirectTimeout-count)/redirectTimeout*100;
    
    
    return (
      <div className={Styles.container}>
        
        <Row type="flex" justify="end" align="middle">
          <Col xs={16} className={Styles.fullWidth430}>
  
            {
              this.props.error
                ? <Alert
                message="Thanh toán không thành công."
                description={`Bạn sẽ được tự động chuyển về trang Chợ ++ sau ${redirectTimeout}s.`}
                type="error"
                showIcon
              />
                : <Alert
                message="Thanh toán thành công."
                description={`Bạn sẽ được tự động chuyển về trang Chợ ++ sau ${redirectTimeout}s.`}
                type="success"
                showIcon
              />
            }
            
          </Col>
          <Col xs={8} className={classnames(Styles.fullWidth430, Styles.circleContainer)}>
            <Progress type="circle" width={110} percent={percent} format={() => `${count} s`}/>
          </Col>
        </Row>
        
        
        <div style={{marginTop: '30px'}}>
          <TopupCheckoutInfo title="Thông tin hóa đơn:" additionTableDataSource={[
            {key: 4, theAttr: 'Mã hóa đơn', theVal: transactionId},
            {key: 5, theAttr: 'Email  nhận hóa đơn', theVal: email},
          ]} />
  
          <p>
            Đồng thời hóa đơn được gửi cho bạn thông qua địa chỉ email: <b>{email}</b><br/>
            Khách hàng lưu ý mã hóa đơn được dùng trong trường hợp khiếu nại.
          </p>
          <p style={{fontSize: '36px'}}>Mã hóa đơn: {transactionId}</p>
        </div>
        
  
        <div style={{textAlign: 'right', marginTop: '40px'}}>
          <Button type="primary"
                  onClick={() => {
                    const targetUrl = '/shop';
                    this.props.push(targetUrl);
                    this.props.history.replace(targetUrl);
                  }}
          ><Icon type="check-circle-o"/> Trở về Chợ ++</Button>
        </div>
    
      </div>
    );
  }
}
