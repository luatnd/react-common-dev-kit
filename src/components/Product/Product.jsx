import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { getDispatchMapper } from '../../base/redux/dispatch';
//import { Link } from 'react-router-dom';
import { push } from 'react-router-redux'
import classnames from 'classnames';
import { Row, Col, Card, Rate } from 'antd';
import pick from 'lodash/pick';
import first from 'lodash/first';

import { formatMoneyLocale } from '../../helpers/AccountingHelper'
//import { getFriendlyUrlComponent } from '../../helpers/UrlHelper'
import { setBuyProductDialog_Data } from '../../pages/ShopPage/TmpShopItemDialog/TmpShopItemDialog.redux'

import productImg from '../../assets/img/product_ao_polonam.jpg';
const Styles = require("./Product.module.scss");
const supportedAntCardPropNames = ['className', 'style', 'extra', 'title', 'loading', 'noHovering', 'bodyStyle', 'bordered'];

@connect(
  state => ({}),
  getDispatchMapper({
    setBuyProductDialog_Data,
    push
  })
)
export default class Product extends React.Component {
  static propTypes = {
    product: PropTypes.object,
    imageDirection: PropTypes.oneOf(['vertical', 'horizontal']),
    setBuyProductDialog_Data: PropTypes.func,
    push: PropTypes.func,
  }
  
  //oneFiveRange = Math.floor(Math.random()*5); // Random a number from 1 to 5 for temporary rating number
   
  defaultProduct = {
    // API attr
    "id": 120,
    "price_type": "voucher",
    "supplier_id": 80,
    "category_id": 7,
    "title": "Giảm 10k/vé cho mỗi vé xem phim tại các rạp Beta trong khung giờ 12-22h",
    "description": "Thời gian áp dụng ưu đãi: 01/09/2017 đến 31/12/2017\r\nGiảm 10k/vé cho mỗi vé xem phim tại các rạp Beta trong khung giờ 12-22h.",
    "thumbnail": [
      "http://admin.cms.campp.me/uploads/uudaicampus/baa72f0f2a63a763fa4736eee72f9c04e9aecb2efe4b11ec26pimgpsh-fullsize-distr.jpg"
    ],
    "end_time": 1514678400,
    "original_price": 252000,
    "total_orders": 16,
    "total_product": 10000,
    "information": {
      "Điều kiện sử dụng ưu đãi": "Chỉ áp dụng ưu đãi cho sinh viên Campus+ \r\n\r\nƯu đãi này không được áp dụng kèm với ưu đãi giá vé cho học sinh sinh viên của Beta.\r\n\r\nCác bạn sinh viên phải đưa ra thông tin thành viên của mình trên ứng dụng Campus Cộng"
    },
    "step_qualities_text": [
      "Giá gốc",
      "Khuyến mãi"
    ],
    "step_prices_text": [
      "0",
      "0"
    ],
    "location": null,
    "area": null,
    "phone": null,
    "max_quantity": 1,
    "limited_quantity": 0,
    "limited_period": 0,
    "due_date": 86400,
    "is_price": 0,
    "discount_price": 199000,
    "discount": "NaN%",
    
    // custom attr
    price_unit: 'đ',  // TODO: Can we automatic locale this unit ? --> Should not
    img: {
      src: productImg,
      alt: 'polo nam',
    },
    rate_avg: this.oneFiveRange + 2,
    rate_count: this.oneFiveRange*3,
  }
  
  handleTitleClick = (product) => {
    // dispatch somesth to open buy dialog
    this.props.setBuyProductDialog_Data({
      visible: true,
      product: pick(product, [
        'id', 'title', 'img',
        'price_type',
        'original_price', 'discount_price', 'rate_avg', 'rate_count',
        'description', 'information',
      ]),
    });
  }

  render() {
    const {product} = this.props;
    const props = pick(this.props, supportedAntCardPropNames);
    
    let item = {...this.defaultProduct, ...product};
    if (item.thumbnail.length) {
      item.img.src = first(item.thumbnail);
    }
  
    
    const salePercent = Math.round((item.original_price - item.discount_price) / item.original_price * 100);
    //const itemUrl = `/product/${product.id}/${getFriendlyUrlComponent(product.title)}/${getFriendlyUrlComponent(product.price_type)}`;

    return (
      <Card bordered={false} {...props} className={Styles.product}>
        <Row>
          
          <Col xs={8} sm={24}>
            <div className={classnames(Styles.imgC)} onClick={() => this.handleTitleClick(item)}>
              <img src={item.img.src} alt={item.img.alt}/>
            </div>
          </Col>
        
          <Col xs={16} sm={24} className={Styles.pright}>
            <p className={Styles.title} onClick={() => this.handleTitleClick(item)}>{item.title}</p>
            {/*<p className={Styles.title}><Link to={itemUrl} onClick={() => this.props.push(itemUrl)}>{item.title}</Link></p>*/}
  
            {item.original_price > 0 &&
            <p className={Styles.priceSale}>
              {formatMoneyLocale(item.discount_price, 'vi')}
              &nbsp;<span className={Styles.priceReg}>{formatMoneyLocale(item.original_price, 'vi')}</span>
              &nbsp;&nbsp;<span className={Styles.saleTag}>-{salePercent}%</span>
            </p>
            }
  
            <div className={Styles.reviewWrap} style={{visibility: item.rate_count ? 'visible' : 'hidden'}}>
              <Rate className={Styles.rate} disabled defaultValue={item.rate_avg} />
              <p className={Styles.review}>({item.rate_count} nhận xét)</p>
            </div>
          </Col>
          
        </Row>
      </Card>
    );
  }
}
