// 3rd party
import React from 'react'
import { connect } from "react-redux";
import { Layout, Breadcrumb, Card, Icon, BackTop } from 'antd'

// My logic
import { SITE_URLS } from '../../siteConfig'
import { reader as persistReader } from '../../base/redux/persist/Persist.redux'

// My UI
import MyLayout from '../Layout'
import ChoosePayment from './ChoosePayment/ChoosePayment'
import PaymentSuccess from './PaymentSuccess/PaymentSuccess'
import CheckoutSteps from './CheckoutSteps/CheckoutSteps'
import HeadHelmet from "../../components/SEO/HeadHelmet";
import CommonStyles from "../../components/Styles/Styles.module.scss"
import Styles from "./CheckoutPage.module.scss"
const Content = Layout.Content;


@connect(
  state => ({rehydrated: persistReader.rehydrated(state)}),
)
export default class CheckoutPage extends React.Component {
  
  renderStepUI = () => {
    const {
      match:{
        params:{
          checkoutTarget,
          stepSlug
        }
      }
    } = this.props;
    
    switch (stepSlug) {
      case SITE_URLS.checkout.topup.choosePayment:
        return <ChoosePayment checkoutTarget={checkoutTarget}/>;
      case SITE_URLS.checkout.topup.paymentSuccess:
        return <PaymentSuccess checkoutTarget={checkoutTarget}/>;
      case SITE_URLS.checkout.topup.paymentUnSuccess:
        return <PaymentSuccess checkoutTarget={checkoutTarget} error={true}/>;
      default:
        return null;
    }
  }
  
  render() {
    //console.log("CheckoutPage render");

    if (!this.props.rehydrated) {
      return this.renderRehydrate();
    }
  
    const {
      match:{
        params:{
          checkoutTarget,
          stepSlug
        }
      }
    } = this.props;
  
    return (
      <MyLayout className={Styles.container}>
        {/* See the /public/seo.conf.json for the `page` value */}
        <HeadHelmet page="checkoutPage"/>

        <Content className={CommonStyles.antBsContainer}>
          <Breadcrumb separator=">" style={{ marginBottom: '12px'}}>
            <Breadcrumb.Item><Icon type="home" /> Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item><Icon type="home" /> Chợ ++</Breadcrumb.Item>
            <Breadcrumb.Item><Icon type="gift" /> Thanh toán</Breadcrumb.Item>
          </Breadcrumb>
  
          <CheckoutSteps checkoutTarget={checkoutTarget} stepSlug={stepSlug}/>
  
          <Card>
            <div className={Styles.stepContent}>
              {this.renderStepUI()}
            </div>
          </Card>
          
          <BackTop className={CommonStyles.backTop}>
            <div className="ant-back-top-content" style={{fontSize: '24px', lineHeight: '40px'}}><Icon type="to-top"/></div>
          </BackTop>
          
        </Content>
      </MyLayout>
    );
  }
  
  /**
   * Replace all your place holder here with loading state, try to imitate the shape of your result screen
   * This must be static method, that not depend on state or props
   */
  renderRehydrate() {
    return (
      <MyLayout className={Styles.container}>
        <Content className={CommonStyles.antBsContainer}>
          
          <Breadcrumb separator=">" style={{ marginBottom: '12px'}}>
            <Breadcrumb.Item><Icon type="home" /> Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item><Icon type="home" /> Chợ ++</Breadcrumb.Item>
            <Breadcrumb.Item><Icon type="gift" /> Thanh toán</Breadcrumb.Item>
          </Breadcrumb>
  
          <Card loading={true} style={{marginBottom: '12px'}}/>
          <Card loading={true} style={{marginBottom: '12px'}}/>
          <Card loading={true} style={{marginBottom: '12px'}}/>
          
        </Content>
      </MyLayout>
    );
  }
}
