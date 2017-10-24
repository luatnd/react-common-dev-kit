// 3rd party
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Table, Row, Col } from 'antd';

// My logic
import { formatMoneyLocale } from '../../../helpers/AccountingHelper'
import { getCarrierById } from '../../ShopPage/Topup/TopupHelper'

// My UI
import Styles from "./TopupCheckoutInfo.module.scss"
import ChoosePaymentStyles from "../ChoosePayment/ChoosePayment.module.scss"

@connect(
  state => {
    const {phone, rateId, cards} = state.topup;
    
    return {
      phone, rateId, cards
    }
  }
)
export default class TopupCheckoutInfo extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    phone: PropTypes.string,
    rateId: PropTypes.number,
    cards: PropTypes.object,
  }
  
  columns = [{
    title: '',
    dataIndex: 'theAttr',
    key: 'theAttr',
    width: 145,
  }, {
    title: '',
    dataIndex: 'theVal',
    key: 'theVal',
  }];
  
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.phone !== this.props.phone
      || nextProps.rateId !== this.props.rateId
    );
  }
  
  get card() {
    const rateId = this.props.rateId;
    const cards = this.props.cards;
    let card = {};
    
    
    for (var carrierId in cards) {
      if (cards.hasOwnProperty(carrierId)) {
        const rates = cards[carrierId].rates;
        if (rates && typeof rates[rateId] !== 'undefined') {
          card = rates[rateId];
          card.carrier = getCarrierById(carrierId);
          break;
        }
      }
    }
    
    return card;
  }
  
  render() {
    //console.log("TopupCheckoutInfo render");
  
    const {
      title = 'Thanh toán topup:',
      additionTableDataSource = [],
    } = this.props;
    
    const card = this.card; // Each time we call this.card, it will run function again.
    
    const dataSource = [
      {key: 0, theAttr: 'Số điện thoại', theVal: this.props.phone,},
      {key: 1, theAttr: 'Nhà mạng', theVal: card.carrier? card.carrier.name: 'Không xác định',},
      {key: 2, theAttr: 'Mệnh giá thẻ', theVal: formatMoneyLocale(card.rate, 'vi'),},
      {key: 3, theAttr: 'Số tiền thanh toán', theVal: formatMoneyLocale(card.bee_rate, 'vi'),},
    ];
  
    const displayDataSource = dataSource.concat(additionTableDataSource);
    
    return (
      <div className={Styles.container}>
        <p className={ChoosePaymentStyles.title}>{title}</p>
        <Row>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Table
              className={Styles.infoTable}
              dataSource={displayDataSource} columns={this.columns}
              pagination={false} showHeader={false}
              bordered={false} size="small"
            />
          </Col>
        </Row>
      </div>
    );
  }
}
