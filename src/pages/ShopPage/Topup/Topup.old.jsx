import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { getAllMapper } from '../../../base/redux/dispatch';
import classnames  from 'classnames'
import { Card, Form, Input, Button, Radio, Icon, Badge } from 'antd';

import { setTopupData, toogleTopupCollapse, sagaGetTopupCardAndRate } from './Topup.redux'
import { formatMoneyLocale } from '../../../helpers/AccountingHelper'
import { carriers, carriersIDPrefixMap } from './mockDataTopupMethods';
import { antFormItemAttr } from '../../../components/AntForm/AntStaticData'

import Styles from "./Topup.module.scss"
const FormItem = Form.Item;


@withRouter
@connect(
  state => {
    const {phone, card, rateId:cardId, cards, supportedCarriers, collapse} = state.topup;
    return {
      phone,
      card,
      cardId,
      cards,
      supportedCarriers,
      collapse,
    }
  },
  getAllMapper({
    sagaGetTopupCardAndRate,
  }, {
    push,
    setTopupData,
    toogleTopupCollapse,
  })
)
export default class TopupOld extends React.Component {
  static propTypes = {
    phone: PropTypes.string,
    card: PropTypes.number,
    cardId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    push: PropTypes.func,
    cards: PropTypes.any,
    collapse: PropTypes.bool,
    supportedCarriers: PropTypes.array,
    sagaGetTopupCardAndRate: PropTypes.func,
    setTopupData: PropTypes.func,
    toogleTopupCollapse: PropTypes.func,
  }

  state = {
    phoneValidateStatus: antFormItemAttr.validateStatus.unTouch,
    phoneMsg: '',
    phoneVal: '',
    phoneCarrierId: '',
    
    cardId: 0, // TODO: Due to some huge change, the code became messy, need to remove some redundant
    cardVal: 0,
    cardMsg: '',
    cardValidateStatus: antFormItemAttr.validateStatus.unTouch,
  }
  
  componentWillMount() {
    let phoneCarrierId = this.state.phoneCarrierId;
    if (!phoneCarrierId && this.state.phoneValidateStatus === antFormItemAttr.validateStatus.unTouch) {
      // Try to get phoneCarrierId one more, in case of we programmatic set the value
      phoneCarrierId = this.detectCarrierId(this.props.phone);
    }
    
    this.setState({
      phoneVal: this.props.phone,
      cardVal: this.props.card,
      cardId: this.props.cardId,
      phoneCarrierId,
    });
    
    this.props.sagaGetTopupCardAndRate.trigger();
  }
  
  detectCarrierId = (phoneNumber) => {
    if (phoneNumber.length < 3) {
      return '';
    }
    
    let cachedPrefix = phoneNumber.substr(0, 3);
    if (carriersIDPrefixMap[cachedPrefix]) {
      return carriersIDPrefixMap[cachedPrefix];
    }
    
    cachedPrefix = phoneNumber.substr(0, 4);
    if (carriersIDPrefixMap[cachedPrefix]) {
      return carriersIDPrefixMap[cachedPrefix];
    }

    return '';
  }
  
  detectCardId = (cardNumber, phoneCarrierId) => {
    const supportedCards = (phoneCarrierId && this.props.cards[phoneCarrierId])
      ? this.props.cards[phoneCarrierId].rates
      : [];
    
    if (supportedCards.length) {
      let rateFound = {};
      for (var i of Object.keys(supportedCards)) {
        const rate = supportedCards[i];
        if (parseInt(rate.rate) === parseInt(cardNumber)) {
          rateFound = rate;
          break;
        }
      }
      
      //console.log('rateFound: ', rateFound);
      return rateFound.id;
    } else {
      return 0
    }
  }
  
  handlePhoneChange = (e) => {
    let val = e.target.value;
    
    // Validate phone
    const status = antFormItemAttr.validateStatus;
    const isNumPattern = /^([0-9]{1,13})$/;
    const isPhonePattern = /^((01|09)[0-9]{8,9})$/;
    
    let phoneMsg = '';
    let phoneValidateStatus = status.unTouch;
    
    if (!val.match(isNumPattern)) {
      phoneMsg = 'Chỉ nhập số điện thoại hợp lệ';
      phoneValidateStatus = status.error;
    } else if (val.match(isPhonePattern)) {
      phoneMsg = '';
      phoneValidateStatus = status.success;
    }
    
    val = val.replace(' ', '');
    
    this.setState({
      phoneVal: val,
      phoneMsg,
      phoneValidateStatus,
    });
  
    // Detect carrier, ignore to detect when phone number longer than 5 --> DON'T: Because copy paste case
    if (val.length) {
      let phoneCarrierId = this.detectCarrierId(val);
      
      this.setState({
        phoneCarrierId,
        cardVal: 0, // Reset card when carrier changes
        cardId: 0, // Reset card when carrier changes
      });
    }
  }
  
  handleCardChange = (e) => {
    let val = e.target.value;
    val = parseInt(val);
  
    const status = antFormItemAttr.validateStatus;
    let cardMsg = '';
    let cardValidateStatus = status.unTouch;
   
    if (val <= 0) {
      cardMsg = 'Bạn hãy chọn mệnh giá thẻ cần nạp';
      cardValidateStatus = status.error;
    } else {
      cardMsg = '';
      cardValidateStatus = status.success;
    }
    
    this.setState({
      cardVal: val,
      cardId: this.detectCardId(val, this.state.phoneCarrierId),
      cardMsg,
      cardValidateStatus,
    });
  }
  
  onSubmit = () => {
    let phoneOK = false;
    let cardOK = false;
    
    let phoneVal = this.state.phoneVal;
    let cardVal = this.state.cardVal;
    let cardId = this.state.cardId;
    const status = antFormItemAttr.validateStatus;
    const isPhonePattern = /^((01|09)[0-9]{8,9})$/;
    
    let phoneMsg = '';
    let phoneValidateStatus = status.unTouch;
    let cardMsg = '';
    let cardValidateStatus = status.unTouch;
  
    let carrierAllowCard = false;
    let phoneCarrierId = this.state.phoneCarrierId;
    if (this.state.phoneValidateStatus === status.unTouch) {
      // Try to get phoneCarrierId one more, in case of we programmatic set the value
      phoneCarrierId = this.detectCarrierId(phoneVal);
      this.setState({phoneCarrierId});
    }
    
    if (phoneVal.match(isPhonePattern)) {
      phoneOK = true;
      phoneValidateStatus = status.success;
    } else {
      phoneMsg = 'Chỉ nhập số điện thoại hợp lệ';
      phoneValidateStatus = status.error;
    }
    
    if (cardVal > 0) {
      cardOK = true;
      cardValidateStatus = status.success;
    } else {
      cardMsg = 'Bạn quên chưa chọn mệnh giá thẻ';
      cardValidateStatus = status.error;
    }
    
    
    //// Bỏ validate nhà mạng
    //if (phoneOK && cardOK) {
    //  if (phoneCarrierId) {
    //
    //    if (!this.props.supportedCarriers.includes(phoneCarrierId)) {
    //      phoneOK = false;
    //      phoneMsg = `Nhà mạng ${carriers[phoneCarrierId].name} chưa được hỗ trợ`;
    //      phoneValidateStatus = status.error;
    //    } else {
    //      let carrierContainCard = (this.props.cards[phoneCarrierId])
    //          && this.props.cards[phoneCarrierId].rates.pickBy((v) => v.rate === cardVal) !== null
    //        ;
    //
    //      if (carrierContainCard) {
    //        carrierAllowCard = true;
    //      } else {
    //        cardOK = false;
    //        cardMsg = `Nhà mạng ${carriers[phoneCarrierId].name} không hỗ trợ mệnh giá thẻ ${formatMoneyLocale(cardVal, 'vi')}`;
    //        cardValidateStatus = status.error;
    //      }
    //    }
    //  } else {
    //    phoneOK = false;
    //    phoneMsg = 'Không thể xác định được nhà mạng';
    //    phoneValidateStatus = status.error;
    //  }
    //}
    
    //if (phoneOK && cardOK && carrierAllowCard) {
    if (phoneOK && cardOK) {
      // Do Submit
      //console.log('Ok, Do submit: ');
      this.props.setTopupData({
        phone: phoneVal,
        card: cardVal,
        rateId: cardId,
        provider: phoneCarrierId,
        // TODO: Send payment gate data to store
        //paymentGate: {
        //  id: 0,
        //  name: 'EPay'
        //},
      });
      
      const targetUrl = '/checkout/topup/phuong-thuc-thanh-toan';
      this.props.push(targetUrl);
      this.props.history.replace(targetUrl); // Why? --> See README_DEV_CHEATSHEET.md: -> #### Navigate to new route

    } else {
      // Update error
      this.setState({
        phoneMsg,
        phoneValidateStatus,
        cardMsg,
        cardValidateStatus,
      });
    }
  }
  
  calculateDiscountAmount = (cardRateInfo) => {
    return (cardRateInfo.rate - cardRateInfo.bee_rate);
  }

  calculateDiscountPercent = (cardRateInfo) => {
    return (cardRateInfo.rate - cardRateInfo.bee_rate) / cardRateInfo.rate * 100;
  }
  
  cardRateCacheMap = {};
  renderCardList = () => {
    const {cardVal, phoneCarrierId} = this.state;
    const supportedCards = (phoneCarrierId && this.props.cards[phoneCarrierId])
      ? this.props.cards[phoneCarrierId].rates
      : [];
    const supported = (supportedCards && supportedCards.length);

    this.cardRateCacheMap = supported ? {} : {
      "10000": {rate: 10000, bee_rate: 9500},
      "20000": {rate: 20000, bee_rate: 19000},
      "30000": {rate: 30000, bee_rate: 28000},
      "50000": {rate: 50000, bee_rate: 47000},
      "100000": {rate: 100000, bee_rate: 95000},
      "200000": {rate: 200000, bee_rate: 185000},
    };
    
    
    return supported
      ? <Radio.Group size="large" className={Styles.radioGroup} onChange={this.handleCardChange} value={cardVal}>
          {supportedCards.map((cardRateInfo) => {
            this.cardRateCacheMap[cardRateInfo.rate.toString()] = cardRateInfo;
            
            const beeRatePercent = this.calculateDiscountPercent(cardRateInfo).toSmartPrecision(1, 'floor');
            const rateK = (cardRateInfo.rate / 1000).toSmartPrecision(1, 'floor');
            const badgeText = beeRatePercent ? `-${beeRatePercent}%` : null;
            return <Radio.Button value={cardRateInfo.rate} key={cardRateInfo.rate}>
              <Badge count={badgeText} className={Styles.cardBadge}>{rateK}k</Badge>
            </Radio.Button>
          })}
        </Radio.Group>
      
      // Default placeholder for card
      : <Radio.Group size="large" className={Styles.radioGroup} onChange={this.handleCardChange} value={cardVal}>
          {Object.keys(this.cardRateCacheMap).map(k => {
            const c = this.cardRateCacheMap[k];
            const beeRatePercent = this.calculateDiscountPercent(c).toSmartPrecision(1, 'floor');
            const rateK = (c.rate / 1000).toSmartPrecision(1, 'floor');
            const badgeText = beeRatePercent ? `-${beeRatePercent}%` : null;
            
            return <Radio.Button value={c.rate} key={c.rate}>
              <Badge count={badgeText} className={Styles.cardBadge}>{rateK}k</Badge>
            </Radio.Button>
          })}
        </Radio.Group>
  }
  
  getSaleRate = (cardVal) => {
    const cardRate = this.cardRateCacheMap[cardVal.toString()];
    return cardRate ? cardRate.bee_rate : cardVal;
  }
  
  renderSupportedCarrier = () => {
    const html = this.props.supportedCarriers.length === 0
      ? "Hiện không có nhà mạng nào được hỗ trợ"
      : this.props.supportedCarriers
      .map((carrierId) => {
        return (carrierId === this.state.phoneCarrierId)
          ? `<b>${carriers[carrierId].name}</b>`
          : carriers[carrierId].name
      })
      .join(', ');

    return <span className={Styles.supportedCarrier}>
      Nhà mạng hỗ trợ: <span dangerouslySetInnerHTML={{__html: html}}/>
    </span>
  }

  render() {
    // TEst: cards base on carrier
    // TEst: card 30k on viettel --> input other phone number whose carrier not support 30k
    
    const status = antFormItemAttr.validateStatus;
    const {phoneVal, phoneMsg, phoneValidateStatus, cardVal, cardMsg}  = this.state;
    const salePrice = this.getSaleRate(cardVal);
    const colappse = this.props.collapse ? Styles.collapse: '';
    const display = this.props.supportedCarriers.length ? '' : Styles.hide;
  
    const collapseBtn = <Icon type={colappse ? "right" : "down"}
                              className={Styles.collapseBtn}
                              onClick={() => this.props.toogleTopupCollapse()}/>;
    
    return (
      <Card title="Nạp tiền điện thoại"
            extra={collapseBtn}
            bordered={false}
            className={classnames(Styles.topup, colappse, display)}
      >
        <p className={Styles.helpText}>{this.renderSupportedCarrier()}</p>

        <Form layout='vertical'>
          <FormItem label="1. Nhập số điện thoại"
                    hasFeedback
                    validateStatus={phoneValidateStatus}
                    help={phoneMsg}
          >
            <Input className={Styles.phoneInput} placeholder="01678123456"
                   value={phoneVal}
                   onChange={this.handlePhoneChange}/>
          </FormItem>
          
          <FormItem label="2. Chọn số tiền cần nạp" validateStatus={status.error} help={cardMsg}>
            {this.renderCardList()}
          </FormItem>

          <hr/>

          {cardVal > 0 &&
          <div>
            <p className="help-block text-right" style={{marginBottom: 0}}>
              <b>Thành tiền: {formatMoneyLocale(salePrice, 'vi')}</b>
            </p>
            <p className="help-block text-right" style={{fontStyle:'italic', fontSize:'smaller'}}>Giá đã bao gồm VAT</p>
          </div>
          }
          
          <FormItem {...{span: 14, offset: 5}}>
            <Button className={Styles.submitBtn} type="primary" onClick={this.onSubmit}>
              3. Thanh toán và nạp thẻ<Icon type="right" />
            </Button>
          </FormItem>
        </Form>
        
      </Card>
    );
  }
}
