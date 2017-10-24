import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { getAllMapper } from '../../base/redux/dispatch';
import { Layout, Breadcrumb, Card, Row, Col, BackTop, Icon } from 'antd';
import HeadHelmet from "../../components/SEO/HeadHelmet";
import moment from "moment";
import isEqual from "lodash/isEqual";

import { reader as persistReader } from '../../base/redux/persist/Persist.redux'
import {
  sagaFetchShopCategories,
  sagaFetchProductsByCatShopPage,
  changeShopCategoryPage,
  reader as productCategoryReader
} from '../../components/ProductCategory/ProductCategory.redux'

import Topup from './Topup/Topup';
import MyLayout from '../Layout';
import AdBanner from '../../components/AdBanner/AdBanner';
import ProductCategory from '../../components/ProductCategory/ProductCategory';
import TmpShopItemDialog from './TmpShopItemDialog/TmpShopItemDialog';

import leftAdImg from '../../assets/img/khuyenmaiVCB.jpg'; // TODO: From db
//const Styles = require("./ShopPage.module.scss");
const CommonStyles = require("../../components/Styles/Styles.module.scss");
const Content = Layout.Content;
const PRODUCT_PERPAGE = 8;
const CATEGORY_STATE_CACHING_TIME = 600; // 0.5 days

// 1. product category from API
// 2. products of each categories from API above
// 3. Booking base on type of price type
@connect(
  state => {
    let categoriesState = productCategoryReader.getState(state).categories;
    
    const maxAge = notThenNext(categoriesState.maxAge, 0);
    const expired = maxAge + CATEGORY_STATE_CACHING_TIME < parseInt(moment().format('X'));
  
    return {
      rehydrated: persistReader.rehydrated(state),
      categories: categoriesState.items,
      expired: expired,
      loading: categoriesState.loading,
    }
  },
  getAllMapper({
    sagaFetchShopCategories,
    sagaFetchProductsByCatShopPage,
  }, {
    changeShopCategoryPage,
  })
)
export default class ShopPage extends React.Component {
  static propTypes = {
    rehydrated: PropTypes.bool,
    categories: PropTypes.object,
    expired: PropTypes.bool,
    loading: PropTypes.bool,
    sagaFetchShopCategories: PropTypes.func,
    sagaFetchProductsByCatShopPage: PropTypes.func,
    changeShopCategoryPage: PropTypes.func,
  }

  componentWillMount() {
    if (this.props.rehydrated && this.props.expired) {
      this.fetchNewShopCategoriesData();
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.rehydrated && nextProps.expired && !nextProps.loading) {
      this.fetchNewShopCategoriesData();
    }
  }
  
  fetchNewShopCategoriesData = () => {
    this.props.sagaFetchShopCategories.trigger({
      size: PRODUCT_PERPAGE,
      page: 1,
    });
  }
  
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.rehydrated !== this.props.rehydrated
      || !isEqual(nextProps.categories, this.props.categories)
    );
  }

  render() {
    //console.log("ShopPage render");
    const {rehydrated, loading, categories} = this.props;
    
    /**
     * NOTE: You must call renderRehydrate if ryhydration was not complete
     */
    if (!rehydrated) {
      return this.renderRehydrate();
    }
    
    const categoriesKeys = Object.keys(categories);
    const componentLoading = categoriesKeys.length < 1 || loading;
  
    return (
    <MyLayout>
      {/* See the /public/seo.conf.json for the `page` value */}
      <HeadHelmet page="shopPage"/>
      
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
  
            {!componentLoading
              ? categoriesKeys.map(k => {
              const c = categories[k];

              return parseInt(c.total) === 0 ? null
                : <ProductCategory
                key={c.category_id}
                category={c}
                perPage={PRODUCT_PERPAGE}
                
                // External mean another component call ProductCategory and force ProductCategory to use its cache data and pagination.
                external={{
                  routerPathname: "/shop",
                  paginationUrlTemplate: "/shop?page=[page]&category=[catName]&c=[catId]&p=[pagination]",
                  paginationDataSource: "shopCategoryData", // Mean: use state.productCategory.shopCategoryData as data-source, see reducer initial for more detail
                  sagaFetchProductsByCatExternal: this.props.sagaFetchProductsByCatShopPage,
                  changeCategoryPage: this.props.changeShopCategoryPage,
                }}
              />
            })
            : <div className="categoryPlaceHolder">
              <Card loading title="Ưu đãi giảm giá" style={{marginBottom: '10px'}}> </Card>
              <Card loading title="Điện thoại" style={{marginBottom: '10px'}}> </Card>
              <Card loading title="Máy tính" style={{marginBottom: '10px'}}> </Card>
            </div>
            }
            
          </Col>
        </Row>
  
        <BackTop className={CommonStyles.backTop}>
          <div className="ant-back-top-content" style={{fontSize: '24px', lineHeight: '40px'}}><Icon type="to-top"/></div>
        </BackTop>

        <TmpShopItemDialog/>

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
                <Card loading title="Ưu đãi giảm giá" style={{marginBottom: '10px'}}> </Card>
                <Card loading title="Điện thoại" style={{marginBottom: '10px'}}> </Card>
                <Card loading title="Máy tính" style={{marginBottom: '10px'}}> </Card>
              </div>
          
            </Col>
          </Row>
        </Content>
      </MyLayout>
    )
  }
}
