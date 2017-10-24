import React from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { getAllMapper } from '../../base/redux/dispatch'
import HeadHelmet from "../../components/SEO/HeadHelmet"
import { withRouter } from 'react-router-dom'
import { push } from 'react-router-redux'
//import classnames from 'classnames'
import { Layout, Breadcrumb, Row, Col, Card, BackTop, Icon } from 'antd'
import moment from 'moment'

import { reader as persistReader } from '../../base/redux/persist/Persist.redux'
import { sagaFetchShopCategories } from '../../components/ProductCategory/ProductCategory.redux'

import MyLayout from '../Layout'
import Page404 from '../Page404/Page404'
import Topup from '../ShopPage/Topup/Topup'
import AdBanner from '../../components/AdBanner/AdBanner'
import ProductCategory from '../../components/ProductCategory/ProductCategory'
import TmpShopItemDialog from '../ShopPage/TmpShopItemDialog/TmpShopItemDialog'
import LoadingBlock from '../../components/AntLoading/LoadingBlock'

import leftAdImg from '../../assets/img/khuyenmaiVCB.jpg'; // TODO: From db
const CommonStyles = require("../../components/Styles/Styles.module.scss")
//const Styles = require("./ProductCategoryPage.module.scss")
const PRODUCT_PERPAGE = 20;
const CATEGORY_STATE_CACHING_TIME = 600; // 0.5 days
const { Content } = Layout;

@withRouter
@connect(
  (state, ownProps) => {
    let categoriesState = state.productCategory.categories;
  
    const maxAge = notThenNext(categoriesState.maxAge, 0);
    const expired = maxAge + CATEGORY_STATE_CACHING_TIME < parseInt(moment().format('X'));
    
    const categoryId = ownProps.match.params.id;
    const category = categoriesState.items[categoryId];

    return {
      rehydrated: persistReader.rehydrated(state),
      category,
      expired: expired,
      loading: categoriesState.loading,
    }
  },
  getAllMapper({
    sagaFetchShopCategories
  },{
    push
  })
)
export default class ProductCategoryPage extends React.Component {
  static propTypes = {
    rehydrated: PropTypes.bool,
    category: PropTypes.object
  }
  
  componentWillMount() {
    this.foo(this.props);
  }
  
  componentWillReceiveProps(nextProps) {
    this.foo(nextProps);
  }
  
  foo = (props) => {
    if (props.rehydrated && typeof props.category === 'undefined') {
      if (props.expired && !props.loading) {
        
        /**
         * Required state.productCategory.categories for loading product category
         */
        this.props.sagaFetchShopCategories.trigger({
          size: PRODUCT_PERPAGE,
          page: 1,
        });
      }
    }
  }
  
  render() {
    if (!this.props.rehydrated || this.props.loading) {
      return this.renderRehydrate();
    }
    
    const {category} = this.props;
    
    return (
      (typeof category !== 'undefined')
       ? <MyLayout>
        {/* See the /public/seo.conf.json for the `page` value */}
        <HeadHelmet page="categoryPage" data={{
          title: {'$categoryName$': category.name},
          canonical: {'$categoryId$': category.category_id, '$categoryName$': category.name},
        }}/>
    
        <Content className={CommonStyles.antBsContainer}>
          <Breadcrumb separator=">" style={{ marginBottom: '12px'}}>
            <Breadcrumb.Item><Icon type="home" /> <a href="/">Trang chủ</a></Breadcrumb.Item>
            <Breadcrumb.Item><Icon type="gift" /> Chợ ++</Breadcrumb.Item>
          </Breadcrumb>
      
          <Row gutter={8}>
            <Col className="left" xs={24} sm={8} md={6} lg={5}>
          
              <Topup/>
          
              <AdBanner>
                <img src={leftAdImg} alt="vcb khuyen mai - Campp"/>
              </AdBanner>
        
            </Col>
        
            <Col className="right" xs={24} sm={16} md={18} lg={19}>
  
              {typeof category !== 'undefined' &&
              <ProductCategory
                key={category.category_id}
                category={category}
                perPage={PRODUCT_PERPAGE}
                viewAllBtn={false}
              />}
        
            </Col>
          </Row>
      
          <BackTop className={CommonStyles.backTop}>
            <div className="ant-back-top-content" style={{fontSize: '24px', lineHeight: '40px'}}><Icon type="to-top"/></div>
          </BackTop>
      
          <TmpShopItemDialog/>
    
        </Content>
      </MyLayout>
        
      : <Page404/>
    );
  }
  
  /**
   * Replace all your place holder here with loading state, try to imitate the shape of your result screen
   * This must be static method, that not depend on state or props
   */
  renderRehydrate() {
    return (
      <MyLayout>
        <Content className={CommonStyles.antBsContainer}>
      
          <Breadcrumb separator=">" style={{marginBottom: '12px'}}>
            <Breadcrumb.Item><Icon type="home"/> <a href="/">Trang chủ</a></Breadcrumb.Item>
            <Breadcrumb.Item><Icon type="gift"/> Chợ ++</Breadcrumb.Item>
          </Breadcrumb>
      
          <Row gutter={8}>
            <Col className="left" xs={24} sm={8} md={6} lg={5}>
          
              <Card title="Nạp tiền điện thoại" bordered={false} loading={true} style={{marginBottom: '10px'}}/>
              <AdBanner>
                <img src={leftAdImg} alt="vcb khuyen mai - Campp"/>
              </AdBanner>
        
            </Col>
            <Col className="right" xs={24} sm={16} md={18} lg={19}>
          
              <div className="categoryPlaceHolder">
                <Card title=" ">
                  <Row gutter={16}>
                    {[1,2,3,4,5,6,7,8].map((n) =>
                      <Col key={n} xs={24} sm={12} md={8} lg={6}>
                        <LoadingBlock/>
                      </Col>
                    )}
                  </Row>
                </Card>
              </div>
        
            </Col>
          </Row>
        </Content>
      </MyLayout>
    );
  }
}
