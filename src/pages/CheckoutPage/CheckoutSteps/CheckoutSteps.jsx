/**
 * NOTE: This file currently support EPAY payment method only
 * IF any payment method available, you need to refactor + re-structure the code
 */

// 3rd party
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Steps } from 'antd';

// My logic

// My UI
import Styles from "../CheckoutPage.module.scss"
import { SITE_URLS } from '../../../siteConfig'
const Step = Steps.Step;


export default class CheckoutSteps extends React.PureComponent {
  static propTypes = {
    checkoutTarget: PropTypes.string,
    stepSlug: PropTypes.string,
  }
  
  parseStep = () => {
    if (this.props.checkoutTarget === 'topup') {
      switch (this.props.stepSlug) {
        case SITE_URLS.checkout.topup.choosePayment:
          return 1;
        case SITE_URLS.checkout.topup.paymentSuccess:
        case SITE_URLS.checkout.topup.paymentUnSuccess:
          return 3;
        default:
          return 0
      }
    } else {
      return 0;
    }
  }
  
  render() {
    //console.log("CheckoutSteps render");
    
    const step = this.parseStep();
    
    return (
      <div className={Styles.stepContainer}>
        <Row>
          <Col xs={0} sm={24}>
            {/* https://ant.design/components/steps/#API */}
            <Steps current={step} direction="horizontal" size="default">
              <Step title="Topup"/>
              <Step title="Ngân hàng"/>
              <Step title="Thanh toán"/>
              <Step title="Hoàn tất"/>
            </Steps>
          </Col>
          <Col xs={24} sm={0}>
            <Steps current={step} direction="vertical" size="small">
              <Step title="Topup" description="Hoàn tất nhập thông tin thanh toán"/>
              <Step title="Phương thức" description="Đang chọn phương thức thanh toán"/>
              <Step title="Thanh toán" description="Thanh toán với ngân hàng"/>
              <Step title="Hoàn tất" description="Nạp thẻ thành công"/>
            </Steps>
          </Col>
        </Row>
      </div>
    );
  }
}
