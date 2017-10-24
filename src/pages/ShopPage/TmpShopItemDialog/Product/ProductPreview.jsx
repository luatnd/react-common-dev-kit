import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Row, Col, Card, Rate } from 'antd'
import pick from 'lodash/pick'
import forIn from 'lodash/forIn'
import nl2br from 'locutus/php/strings/nl2br'

import { formatMoneyLocale } from '../../../../helpers/AccountingHelper'

import KeyValueInfo from "../../../../components/KeyValueInfo/KeyValueInfo"
import Styles from "./ProductPreview.module.scss"

const supportedAntCardPropNames = ['className', 'style', 'extra', 'title', 'loading', 'noHovering', 'bodyStyle', 'bordered'];


export default class ProductPreview extends React.PureComponent {
  static propTypes = {
    product: PropTypes.object,
    imageDirection: PropTypes.oneOf(['vertical', 'horizontal']),
  }
  
  state = {
    descExpand: false,
  }
  
  defaultImageDirection = 'horizontal';
  
  columns = [{
    title: '',
    dataIndex: 'theAttr',
    key: 'theAttr',
    width: 110,
  }, {
    title: '',
    dataIndex: 'theVal',
    key: 'theVal',
  }];
  
  
  toggleDescExpand = () => {
    this.setState((prevState) => ({descExpand: !prevState.descExpand}))
  }
  
  render() {
    //console.log("ProductPreview render");

    const {descExpand} = this.state;
    let {product:item, imageDirection} = this.props;
    
    if (!item) {
      //console.log("Product not found, render null");
      return null;
    }

    const props = pick(this.props, supportedAntCardPropNames);
  
    const imgDirection = imageDirection || this.defaultImageDirection;
    const salePercent = Math.round((item.original_price - item.discount_price) / item.original_price * 100);
    const description = nl2br(item.description, true);
  
    let dataSource = [];
    let count = 0;
    forIn(item.information, (v, k) => {
      dataSource.push({
        key: count++,
        theAttr: k,
        theVal: <div dangerouslySetInnerHTML={{__html: nl2br(item.description, true)}}></div>,
      })
    });

    return (
      <Card bordered={false} {...props} className={Styles.product + ' ' + Styles.hover}>
        <Row>
          
          <Col xs={8}>
            <div className={classnames(Styles.imgC, Styles[imgDirection])}>
              <img src={item.img.src} alt={item.img.alt}/>
            </div>
          </Col>
        
          <Col xs={16} className={Styles.pright}>
            <p className={Styles.title}>{item.title}</p>
  
            {item.original_price > 0 &&
            <p className={Styles.priceSale}>
              {formatMoneyLocale(item.discount_price, 'vi')}
              &nbsp;&nbsp;<span className={Styles.priceReg}>{formatMoneyLocale(item.original_price, 'vi')}</span>
              &nbsp;&nbsp;<span className={Styles.saleTag}>-{salePercent}%</span>
            </p>
            }
  
            <div className={Styles.reviewWrap} style={{visibility: item.rate_count ? 'visible' : 'hidden'}}>
              <Rate className={Styles.rate} disabled defaultValue={item.rate_avg} />
              <p className={Styles.review}>({item.rate_count} nhận xét)</p>
            </div>
          </Col>
          
          <Col xs={24} className={Styles.detailContainer}>
            <hr/>
            
            <div onClick={this.toggleDescExpand} className={Styles.descContainer}>
              <div className={descExpand ? Styles.expanded : Styles.collapsed}>
                <p className={Styles.desc} dangerouslySetInnerHTML={{__html: description}}/>
              </div>
              {!descExpand && <p>(Nhấn để xem thêm ...)</p>}
            </div>
            
            {dataSource.length > 0 &&
            <div>
              <p style={{marginTop: '20px'}}><b>Thông tin bổ sung <small>(scroll to see more)</small>:</b></p>
              
              {/*<Table className={Styles.infoTable}*/}
                     {/*dataSource={dataSource} columns={this.columns}*/}
                     {/*pagination={false} showHeader={false} bordered={false} size="small" scroll={{y: 200}}*/}
              {/*/>*/}
              
              <KeyValueInfo className={Styles.infoTable}
                     dataSource={dataSource}
                     scroll={{y: 194}}
              />
            </div>
            }
          </Col>
          
        </Row>
      </Card>
    );
  }
}
