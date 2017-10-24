import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { getAllMapper } from '../../../base/redux/dispatch';
import classnames  from 'classnames'
import { Card, Form, Button, Radio, Icon, Badge, AutoComplete } from 'antd';
import moment from 'moment';
import uniqueId from 'lodash/uniqueId';

import { setTopupData, toogleTopupCollapse, sagaGetTopupCardAndRate, pushTopupHistory } from './Topup.redux'
import { getHistoryKey, getCarrierById } from './TopupHelper'
import { formatMoneyLocale } from '../../../helpers/AccountingHelper'
import { antFormItemAttr } from '../../../components/AntForm/AntStaticData'

import Styles from "./Topup.module.scss"
const FormItem = Form.Item;
const OptGroup = AutoComplete.OptGroup;
const Option = AutoComplete.Option;
const formStatus = antFormItemAttr.validateStatus;
const defaultCards = {
  "10000": {id: -1, rate: 10000, bee_rate: 9500},
  "20000": {id: -2, rate: 20000, bee_rate: 19000},
  "30000": {id: -3, rate: 30000, bee_rate: 28000},
  "50000": {id: -4, rate: 50000, bee_rate: 47000},
  "100000": {id: -5, rate: 100000, bee_rate: 95000},
  "200000": {id: -6, rate: 200000, bee_rate: 185000},
};

@withRouter
@connect(
  state => {
    const {
      cards,
      supportedCarriers,
      collapse,
      history:topupHistory
    } = state.topup;

    return {
      cards,
      supportedCarriers,
      collapse,
      topupHistory,
    }
  },
  getAllMapper({
    sagaGetTopupCardAndRate,
  }, {
    push,
    setTopupData,
    toogleTopupCollapse,
    pushTopupHistory,
  })
)
export default class Topup extends React.Component {
  static propTypes = {
    cards: PropTypes.any,
    collapse: PropTypes.bool,
    supportedCarriers: PropTypes.array,
    topupHistory: PropTypes.any,
  }

  state = {
    phone: '',
    phoneMsg: '',
    phoneValidateStatus: formStatus.unTouch,

    carrierId: '',
    carrierMsg: '',
    carrierValidateStatus: formStatus.unTouch,
  
    cardId: 0,
    cardMsg: '',
    cardValidateStatus: formStatus.unTouch,
  }
  
  componentWillMount() {
    // TODO: Set initial state or highlight
    
    this.props.sagaGetTopupCardAndRate.trigger();
  }
  
  handlePhoneChange = (val) => {
    //console.log("Change = Search or Select:", val);
  }
  
  handlePhoneSelect = (val) => {
    //console.log('handlePhoneSelect', val);
    
    const history = this.getHistoryByKey(val);
    
    if (history) {
      // Validate and set to state
      this.validatePhoneNumber(history.phone);
      this.validateCarrierId(history.carrierId);
      this.validateCardId(history.rateId);
    }
  }

  handlePhoneSearch = (val) => {
    //console.log("handlePhoneSearch", val);
    this.validateTypingPhoneNumber(val);
  }
  
  handleCarrierChange = (e) => {
    //console.log("handleCarrierChange", e);
    const val = e.target.value;
  
    this.validateCarrierId(val);
  }
  
  handleCardChange = (e) => {
    //console.log("handleCardChange", e.target.value);
  
    let val = e.target.value;
    this.validateCardId(val);
  }
  
  onSubmit = () => {
    //console.log("onSubmit");
    
    const {phone, carrierId, cardId:rateId} = this.state;
    
    const eachIsValid = this.validatePhoneNumber(phone)
      && this.validateCarrierId(carrierId)
      && this.validateCardId(rateId);
    let constrainIsValid = false;
  
    
    if (eachIsValid) {
      // Continue to validate the constrain between them:
      // Constrain 1: Viettel can not contain other cardId that belong to Vinaphone
        // Given carrierId, rateId
      const card = this.getCardById(rateId);
      if (card.carrierId === carrierId) {
        constrainIsValid = true;
      } else {
        // Update error to UI
        this.setState({
          cardMsg: `Cần chọn thẻ tương ứng với nhà mạng ${getCarrierById(carrierId).name}`,
          cardValidateStatus: formStatus.error,
        });
      }
    }
    
    if (eachIsValid && constrainIsValid) {
      
      // Save topup history on this device only
      this.props.pushTopupHistory({
        phone,
        carrierId,
        rateId,
        time: moment().format('X')
      });
  
      // Save topup data and Do checkout, this data is use for next step
      this.props.setTopupData({
        phone: phone,
        rateId: rateId,
        
        // TODO: Send payment gate data to store
        //paymentGate: {
        //  id: 0,
        //  name: 'EPay'
        //},
      });
  
      const targetUrl = '/checkout/topup/phuong-thuc-thanh-toan';
      this.props.push(targetUrl);
      this.props.history.replace(targetUrl); // Why? --> See README_DEV_CHEATSHEET.md: -> #### Navigate to new route
  
    }
  }
  
  validatePhoneNumber = (val) => {
    // Validate phone
    let isValid = false;
    const validPhonePattern = /^0([0-9]{9,10})$/;
    
    let phoneMsg = '';
    let phoneValidateStatus = formStatus.unTouch;
    
    // Validate phone but do not throw red err when user is inputing
    if (val.match(validPhonePattern)) {
      phoneMsg = '';
      phoneValidateStatus = formStatus.unTouch;
      isValid = true;
    } else {
      phoneMsg = 'Số điện thoại dài 10, 11 số và bắt đầu bằng số 0';
      phoneValidateStatus = formStatus.error;
    }
    
    // Remove all space from phone
    val = val.replace(' ', '');
    
    this.setState({
      phone: val,
      phoneMsg,
      phoneValidateStatus,
    });
    
    return isValid;
  }
  validateTypingPhoneNumber = (val) => {
  
    // Remove space and non printable character before validate
    val = val.replace(/[^\x20-\x7E]+/g, '').replace(/\s/g, '');
    
    // Validate phone
    let isValid = false;
    const isBeingPhonePattern = /^(.{0}|(0([0-9]{0,10})))$/;
    
    let phoneMsg = '';
    let phoneValidateStatus = formStatus.unTouch;
    
    // Validate phone but do not throw red err when user is inputing
    if (val.match(isBeingPhonePattern)) {
      phoneMsg = '';
      phoneValidateStatus = formStatus.unTouch;
      isValid = true;
    } else {
      phoneMsg = 'Chỉ nhập số điện thoại hợp lệ';
      phoneValidateStatus = formStatus.error;
    }
    
    // Remove all space from phone
    val = val.replace(/\s/g, '');
    
    this.setState({
      phone: val,
      phoneMsg,
      phoneValidateStatus,
    });
    
    return isValid;
  }
  validateCarrierId = (val) => {
    //console.log('validateCarrierId val: ', val);
  
    let isValid = false;
    let carrierMsg = '';
    let carrierValidateStatus = formStatus.unTouch;
  
    // Validate phone but do not throw red err when user is inputing
    const valid = val ? true : false;
    if (valid) {
      carrierMsg = '';
      carrierValidateStatus = formStatus.unTouch;
      isValid = true;
    } else {
      carrierMsg = 'Bạn quên chưa chọn nhà mạng';
      carrierValidateStatus = formStatus.error;
    }
  
    this.setState({
      carrierId: val,
      carrierMsg,
      carrierValidateStatus,
    });
  
    return isValid;
  }
  
  validateCardId = (val) => {
    //console.log('validateCardId: val', val);
  
    let isValid = false;
    
    val = parseInt(val);
  
    let cardMsg = '';
    let cardValidateStatus = formStatus.unTouch;
  
    if (val <= 0) {
      cardMsg = 'Bạn hãy chọn mệnh giá thẻ cần nạp';
      cardValidateStatus = formStatus.error;
    } else {
      cardMsg = '';
      cardValidateStatus = formStatus.success;
      isValid = true;
    }
  
    this.setState({
      cardId: val,
      cardMsg,
      cardValidateStatus,
    });
    
    return isValid;
  }

  calculateDiscountPercent = (cardRateInfo) => {
    return (cardRateInfo.rate - cardRateInfo.bee_rate) / cardRateInfo.rate * 100;
  }
  
  getCurrentSalePrice = (cardId) => {
    const rates = this.getCurrentRates();
    const card = undefinedThenNext(rates[cardId], null);
    
    return card ? card.bee_rate : 0;
  }
  
  /**
   * Find card by cardId in all Carrier card
   * @param cardId
   * @returns {{id, rate, bee_rate, carrierId}} Return card if found else null
   */
  getCardByIdCache = {};
  getCardById = (cardId) => {
    if (typeof this.getCardByIdCache[cardId] !== 'undefined') {
      return this.getCardByIdCache[cardId]; // Read cache
    }
    
    let card = null;
    const carriersAndCards = this.props.cards;
    
    for (var carrierId in carriersAndCards) {
      const carrierCards = carriersAndCards[carrierId];
      if (typeof carrierCards.rates[cardId] !== 'undefined') {
        card = carrierCards.rates[cardId];
        card.carrierId = carrierId; // Save carrierId on card
        
        this.getCardByIdCache[cardId] = card; // Write cache
        
        break;
      }
    }
    
    return card;
  }

  /**
   * Find history by unique key in history list
   * @param key
   * @returns {*} Return card if found else null
   */
  getHistoryByKey = (key) => {
    const historyEntries = this.props.topupHistory;
    
    return (typeof historyEntries[key] !== 'undefined')
      ? historyEntries[key]
      : null;
  }
  
  getCurrentRates = () => {
    const {carrierId} = this.state;
    const carrierCards = this.props.cards[carrierId];
  
    return (typeof carrierCards !== 'undefined' && typeof carrierCards.rates !== 'undefined')
      ? carrierCards.rates
      : {};
  }
  
  renderCardList = () => {
    const {cardId} = this.state;
    const rates = this.getCurrentRates();
  
    return <Radio.Group onChange={this.handleCardChange} value={cardId} size="large" className={Styles.radioGroup}>
      {Object.keys(rates).length
        ? Object.keys(rates).map(k => {
        const v = rates[k];
    
        const beeRatePercent = this.calculateDiscountPercent(v).toSmartPrecision(1, 'floor');
        const rateK = (v.rate / 1000).toSmartPrecision(1, 'floor');
        const badgeText = beeRatePercent ? `-${beeRatePercent}%` : null;
    
        return <Radio.Button value={v.id} key={v.id}>
          <Badge count={badgeText} className={Styles.cardBadge}>{rateK}k</Badge>
        </Radio.Button>
      })
        : Object.keys(defaultCards).map(k => {
        const v = defaultCards[k];
        
        const rateK = (v.rate / 1000).toSmartPrecision(1, 'floor');
        //const beeRatePercent = this.calculateDiscountPercent(v).toSmartPrecision(1, 'floor');
        //const badgeText = beeRatePercent ? `-${beeRatePercent}%` : null;
  
        return <Radio.Button value={v.id} key={v.id} disabled>
          <Badge count={null} className={Styles.cardBadge}>{rateK}k</Badge>
        </Radio.Button>
      })
      }
    </Radio.Group>
  }
  
  renderCarrierList = () => {
    const {carrierId} = this.state;
    const carrierIds = this.props.supportedCarriers;
    
    return <Radio.Group onChange={this.handleCarrierChange} value={carrierId} size="large" className={classnames(Styles.radioGroup, Styles.radioGroupCarrier)}>
      {carrierIds.map(carrierId => {
        const carrier = getCarrierById(carrierId);
        return <Radio.Button key={carrierId} value={carrierId} className={Styles.radioBtn}>
          <img src={carrier.logo} alt={carrier.name}/>
        </Radio.Button>
      })}
    </Radio.Group>
  }
  
  
  
  
  
  
  
  
  
  renderOption = (item) => {
    if (item.rateId <= 0) {
      // Don't render the invalid case
      console.log("Invalid cardId");
      return null;
    }
    
    const card = this.getCardById(item.rateId);
    if (!card) {
      // Don't render the invalid case,
      // that cause by a card is valid in the past, but invalid at this time
      console.log("Invalid card");
      return null;
    }

    const carrier = getCarrierById(item.carrierId);
    if (!carrier) {
      console.log("Invalid carrier");
      return null;
    }
    
    const historyEntryKey = getHistoryKey(item);
    
    return (
      <Option key={historyEntryKey} value={historyEntryKey} phone={item.phone}>
        <img src={carrier.logo} alt={carrier.name} className={Styles.carrierThumbSmall}/> &nbsp;
        <b>{item.phone}</b>&nbsp;
        +<span className={Styles.historyCard}>{Math.floor(card.rate / 1000)}K</span>
      </Option>
    );
  }

  renderList = () => {
  
    let options = [];
  
    for (let k in this.props.topupHistory) {
      const historyEntry = this.props.topupHistory[k];
      const opt = this.renderOption(historyEntry);
    
      // Render only valid option
      if (opt) {
        options.push(opt);
      }
    }
  
    const optGroupEle = <div>
      {(this.state.phoneValidateStatus !== formStatus.unTouch) &&
      <p className={Styles.historyErr}>{this.state.phoneMsg}</p>}
      <p className={Styles.historyTitle}>Lịch sử gần đây: </p>
    </div>;
    
    return [
      <OptGroup key={uniqueId()} label={optGroupEle}>
        {options}
      </OptGroup>
    ];
  }
  
  
  render() {
    //console.log('Topup render');
    
    const status = antFormItemAttr.validateStatus;
    const {
      phone,
      phoneMsg,
      phoneValidateStatus,
      carrierMsg,
      //carrierValidateStatus,
      cardId,
      cardMsg,
    }  = this.state;
    
    const salePrice = this.getCurrentSalePrice(cardId);

    // Hide if form is not supported
    //const display = this.props.supportedCarriers.length ? '' : Styles.hide;
    const display = this.props.supportedCarriers.length > 0;
    
    // User can Collapse and expand
    const collapse = !display || this.props.collapse ? Styles.collapse: '';
  
    const collapseBtn = <Icon type={collapse ? "right" : "down"}
                              className={Styles.collapseBtn}
                              onClick={() => this.props.toogleTopupCollapse()}/>;
    


    return (
      <Card title="Nạp tiền điện thoại"
            extra={collapseBtn}
            bordered={false}
            className={classnames(Styles.topup, collapse)}
      >
        <Form layout='vertical'>
          <FormItem
            className={Styles.phoneInputFormItem}
            label="1. Nhập số điện thoại"
            hasFeedback
            validateStatus={phoneValidateStatus}
            help={phoneMsg}
          >
            <AutoComplete
              className={Styles.phoneInput}
              dataSource={this.renderList()}
              placeholder="0968111789"
              value={phone}
              optionLabelProp="phone"
              onSearch={this.handlePhoneSearch}
              onSelect={this.handlePhoneSelect}
              onChange={this.handlePhoneChange}
            />
          </FormItem>
          
          <FormItem label="2. Chọn nhà mạng" validateStatus={status.error} help={carrierMsg}>
            {this.renderCarrierList()}
          </FormItem>

          <FormItem label="3. Chọn số tiền cần nạp" validateStatus={status.error} help={cardMsg}>
            {this.renderCardList()}
          </FormItem>

          <hr/>

          {salePrice > 0 &&
          <div>
            <p className="help-block text-right" style={{marginBottom: 0}}>
              <b>Thành tiền: {formatMoneyLocale(salePrice, 'vi')}</b>
            </p>
            <p className="help-block text-right" style={{fontStyle:'italic', fontSize:'smaller'}}>Giá đã bao gồm VAT</p>
          </div>
          }
          
          <FormItem {...{span: 14, offset: 5}}>
            <Button className={Styles.submitBtn} type="primary" onClick={this.onSubmit}>
              4. Thanh toán và nạp thẻ<Icon type="right" />
            </Button>
          </FormItem>
        </Form>
        
      </Card>
    );
  }
}
