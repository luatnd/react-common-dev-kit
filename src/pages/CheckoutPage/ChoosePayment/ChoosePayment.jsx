/**
 * NOTE: This file currently support EPAY payment method only
 * IF any payment method available, you need to refactor + re-structure the code
 */

// 3rd party
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { getAllMapper } from '../../../base/redux/dispatch';
import { withRouter } from 'react-router-dom';
import { push, goBack } from 'react-router-redux'
import { Form, Popover, Radio, Button, Icon, Spin, notification } from 'antd';
import uniqueId from 'lodash/uniqueId';

// My logic
import {
  sagaFetchEpayBankList,
  setChoosePayment_Bank as setBankInfo,
  setChoosePayment_Data,
  setChoosePayment_Loading as setLoading
} from './ChoosePayment.redux';
import { setCheckoutCommonInfo } from '../CheckoutPage.redux';
import { sagaStartTopup } from '../DoPayment/DoPayment.redux';
import { ePayVisaMasterPayment as visaMasterBank } from './mockData';


// My UI
import IconInputPure from '../../../components/AntForm/IconInput/IconInputPure';
import TopupCheckoutInfo from '../CheckoutInfo/TopupCheckoutInfo';
import { antFormItemAttr } from '../../../components/AntForm/AntStaticData'
import Styles from "./ChoosePayment.module.scss"
import CommonStyles from "../../../components/Styles/Styles.module.scss"
import CheckoutPageStyles from "../CheckoutPage.module.scss"
import { inProdMode } from '../../../siteConfig'

const FormItem = Form.Item;
const formStatus = antFormItemAttr.validateStatus;

@withRouter
@connect(
  state => {
    const {phone, rateId} = state.topup;
    const {
      error: doPaymentError,
      loading: doPaymentLoading,
      data: doPaymentData,
    } = state.checkoutPage.doPayment;
    
    return {
      ...state.checkoutPage.choosePayment,
      phone,
      rateId,
      doPaymentError,
      doPaymentLoading,
      doPaymentData,
    }
  },
  getAllMapper({
    sagaFetchEpayBankList,
    sagaStartTopup,
  }, {
    setChoosePayment_Data,
    setBankInfo,
    setLoading,
    push,
    goBack,
    setCheckoutCommonInfo,
  })
)
export default class ChoosePayment extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.string,
    bankId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bankValidateStatus: PropTypes.string,
    email: PropTypes.string, // Belong to state.checkoutPage.choosePayment
    formItemBanks: PropTypes.object, // Belong to state.checkoutPage.choosePayment
    sagaFetchEpayBankList: PropTypes.func,
    setBankInfo: PropTypes.func,
    setChoosePayment_Data: PropTypes.func,
    setLoading: PropTypes.func,
    push: PropTypes.func,
    goBack: PropTypes.func,
    setCheckoutCommonInfo: PropTypes.func,
    sagaStartTopup: PropTypes.func,
    phone: PropTypes.string,
    doPaymentError: PropTypes.string,
    doPaymentLoading: PropTypes.bool,
    doPaymentData: PropTypes.object,
  }
  
  state = {
    email: '',
    emailMsg: '',
    emailValidateStatus: formStatus.unTouch,
  }
  
  componentWillMount() {
    this.setState({email: this.props.email});
    this.props.sagaFetchEpayBankList.trigger();
  }
  
  componentDidUpdate(prevProps) {
    const sagaStartTopupFinished = (
      this.props.doPaymentLoading !== prevProps.doPaymentLoading
      && !this.props.doPaymentLoading
    );
    const sagaTopupWithErr = this.props.doPaymentError.length;
    
    if (sagaStartTopupFinished) {
      if (sagaTopupWithErr) {
        notification.error({
          key: uniqueId('checkout_do_topup_notice'),
          message: 'Không thể topup được',
          description: this.props.doPaymentError,
          duration: 6,
          className: CommonStyles.errorNotification
        });
      } else {
        
        // SUCCESS
        const targetUrl = this.props.doPaymentData.url;
        window.location.assign(targetUrl);
        
      }
    }
  }
  
  handleEmailChange = (e) => {
    let val = e.target.value;
    
    let emailMsg = '';
    let emailValidateStatus = formStatus.unTouch;
  
    // eslint-disable-next-line
    const emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!val.match(emailPattern)) {
      emailMsg = 'Email không hợp lệ';
      emailValidateStatus = formStatus.error;
    } else {
      emailMsg = '';
      emailValidateStatus = formStatus.success;
    }
    
    
    this.setState({
      email: val,
      emailMsg,
      emailValidateStatus,
    })
  }
  
  handleRadioChange = (e) => {
    let val = e.target.value;
    val = parseInt(val);
    
    const status = antFormItemAttr.validateStatus;
    
    let bankValidateStatus = (val <= 0) ? status.error : status.success;
    
    this.props.setBankInfo({
      bankId: val,
      bankValidateStatus,
    });
  }
  
  handleBackButton = () => {
    this.props.goBack();
  }
  
  /**
   * Submit: Call topup API
   *    - trigger Checkout page loading
   *    - trigger topup API
   *
   * Display UI base on topup API result via props ==> See this.componentDidUpdate()
   *    - Done with error: report and stay here
   *    - Done with no error: Then goto external url
   *
   * Next steps was handle in other component:
   * - User input their payment info in Epay or xxx payment gate website
   * - After all, if payment success, their website will redirect back to checkout flow (step final)
   * - Show success message and help content
   */
  handleNextButton = () => {
    this.props.setChoosePayment_Data({email: this.state.email});
    
    this.props.sagaStartTopup.trigger({
      email: this.state.email,
      phone: this.props.phone,
      rateId: this.props.rateId,
      bankId: this.props.bankId,
    });
  }
  
  render() {
    //console.log("ChoosePayment render");
    
    const {doPaymentLoading:loading, bankId:currentBankId, bankValidateStatus, formItemBanks = {}} = this.props;
    const {email, emailMsg, emailValidateStatus } = this.state;
    const {banks = [], loading:formItemBanksLoading} = formItemBanks;
    
    const nextBtnWasDisabled = (
      bankValidateStatus !== formStatus.success
      || emailValidateStatus !== formStatus.success
    );

    
    return (
      <div className={Styles.container}>
  
          <div className={Styles.bankContainer}>
  
            <TopupCheckoutInfo/>

            
            {/*// NOTE this is for EPAY gate only, for other method, you need to refactor this code */}
            <Form layout='vertical'>
              <p className={Styles.title}>Email</p>
              <p className="help-block">Email được dùng để nhận hóa đơn thanh toán và khiếu nại.</p>
              <FormItem className={Styles.formItem} validateStatus={emailValidateStatus} help={emailMsg}>
                <IconInputPure
                  value={email}
                  className={Styles.iconInput}
                  onChange={this.handleEmailChange}
                  placeholder="nguyen_an@gmail.com"
                  prefix={<Icon type="mail"/>}
                />
              </FormItem>
  
  
              <p className={Styles.title} style={{marginTop: '50px'}}>Phương thức thanh toán</p>
              <p className="help-block">
                Chọn một trong những phương thức thanh toán dưới đây và nhấn tiếp tục:
              </p>
              <FormItem className={Styles.formItem}>
                <p className={Styles.title2} style={{color: '#00b300'}}>Thẻ quốc tế Visa, Master Card</p>
                <Spin spinning={formItemBanksLoading}>
                  <Radio.Group size="large" className={Styles.radioGroup} onChange={this.handleRadioChange} value={currentBankId}>
                    <Radio.Button value={parseInt(visaMasterBank.id)}>
                      <img src={visaMasterBank.image} alt={`${visaMasterBank.name}  logo`}/>
                    </Radio.Button>
                    
                    {!inProdMode &&
                    <Radio.Button value={999999}>
                      <Popover content="This bank is used for testing purpose">
                        <img src='#' alt={`Bank for test`}/>
                      </Popover>
                    </Radio.Button>}
                    
                  </Radio.Group>
                </Spin>
  
                <p className={Styles.title2}>Thẻ thanh toán nội địa</p>
                <Spin spinning={formItemBanksLoading}>
                  <Radio.Group size="large" className={Styles.radioGroup} onChange={this.handleRadioChange} value={currentBankId}>
  
                    {banks.map((bank) => (bank.id === visaMasterBank.id)
                      ? null :
                      <Radio.Button value={parseInt(bank.id)} key={bank.id}>
                        <img src={bank.image} alt={`${bank.name} logo`}/>
                      </Radio.Button>
                    )}
                    
                  </Radio.Group>
                </Spin>
              </FormItem>
  
  
              <div className={CheckoutPageStyles.stepAction}>
                <hr style={{margin: "30px 0 5px 0", borderTop: '1px solid #ddd'}}/>
                <div style={{overflow: "hidden", marginBottom: '15px'}}>
                  <p className={Styles.submitNote}>Sau khi nhấn nút <b>thanh toán</b>, bạn sẽ được chuyển tới trang thanh toán của ngân hàng và thanh toán trực tiếp với ngân hàng.</p>
                </div>
                
                <Button.Group size={'large'}>
                  <Button type="default" onClick={this.handleBackButton}>
                    <Icon type="left"/>Quay lại
                  </Button>
                  <Button type="primary"
                          style={{marginLeft: '10px', paddingLeft: loading ? '24px' : '8px'}}
                          disabled={nextBtnWasDisabled}
                          onClick={this.handleNextButton}
                          loading={loading}
                  >Thanh toán {!loading && <Icon type="right"/>}</Button>
                </Button.Group>
              </div>
              
            </Form>
          </div>
    
      </div>
    );
  }
}
