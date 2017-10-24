// 3rd party
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import { Row, Col, Card, Button, Icon, Pagination } from 'antd';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import queryString from 'query-string';

// My Controller/ libs / logic
import { scrollToElement, scrollToPosition } from '../../helpers/DOMHelper';
import { getAllMapper } from '../../base/redux/dispatch';
import { sagaFetchProductsByCat, changeCategoryPage, reader as productCategoryReader} from './ProductCategory.redux';
import { getFriendlyUrlComponent } from '../../helpers/UrlHelper';
import { wasExpired } from '../../helpers/TimeHelper';

// My view: component and style
import ProductList from '../ProductList/ProductList';

const Styles = require("./ProductCategory.module.scss");
const supportedAntCardPropNames = ['className', 'style', 'extra', 'title', 'loading', 'noHovering', 'bodyStyle', 'bordered'];

const PAGE_RESULT_CACHING_TIME = 10*60; // 10 minutes
const defaultDataSource = 'categoryData';
const defaultPaginationUrlTemplate = '/category/[catId]/[catName]?page=[page]&p=[pagination]';
const CATEGORY_PAGE_ROUTER_PATHNAME = '/category';

@withRouter
@connect(
  (state, props) => {
    //console.log("ProductCategory Recalculate state");
    const isExternal = typeof props.external !== 'undefined';

    const pathName = isExternal ? props.external.routerPathname : CATEGORY_PAGE_ROUTER_PATHNAME;
  
    /**
     * Because react-router set url to browser history was async,
     * So that you need to check if url was up to date or not
     * If you read data from query string, url might not updated to your expected url here
     * For example: On CAT page, you go to SHOP page, then this component on SHOP page still receive the url of CAT page
     *
     * @type {boolean}
     */
    const urlUpToDate = state.router.location.pathname.startsWith(pathName);
  
    let urlPaginationData = {};
  
    if (urlUpToDate) {
      const queryStr = state.router.location.search;
      const categoryRouterState = queryString.parse(queryStr);
    
      urlPaginationData = categoryRouterState.p ? JSON.parse(categoryRouterState.p) : {};
    }
  
    const catId = props.category.category_id;
    const reduxDataSourceKey = isExternal ? props.external.paginationDataSource : defaultDataSource;
  
    /**
     * Use productCategoryReader.getCategoryStateById() help you dont need to care about which path of your data,
     * let describe it in your reducer, your component is not a best place
     */
    const categoryState = productCategoryReader.getCategoryStateById(state, reduxDataSourceKey, catId)  //state.productCategory[reduxDataSourceKey][props.category.category_id];
    const categoryDataExist = (typeof categoryState.data !== 'undefined');
  
    let {
      results = {},
      total = 0,
      currentPage:currentPageFromState = 1,
      loading = false
    } = categoryDataExist ? categoryState.data : {};

    // Fallback
    const page = notThenNext(urlPaginationData[catId], currentPageFromState);
    
    urlPaginationData[catId] = page;
  
    let products = [];
    const resultOfPage = notThenNext(results[page], null);
    if (resultOfPage !== null) {
      const expired = wasExpired(resultOfPage['maxAge'], PAGE_RESULT_CACHING_TIME);
      if (!expired) {
        products = notThenNext(resultOfPage['results'], []);
      }
    }
  
    const paginationUrlTemplate = isExternal ? props.external.paginationUrlTemplate : defaultPaginationUrlTemplate;
    
    return {
      pagination: {...urlPaginationData},
      paginationUrlTemplate,
      total,
      products,
      loading,
    }
  },
  getAllMapper({
    sagaFetchProductsByCat,
  }, {
    push,
    changeCategoryPage,
  })
)
export default class ProductCategory extends React.PureComponent {
  static propTypes = {
    category: PropTypes.object,
    perPage: PropTypes.number,
    viewAllBtn: PropTypes.bool,
    customPaginationDataSource: PropTypes.string,
    products: PropTypes.array,
    total: PropTypes.number,
    pagination: PropTypes.object,
    paginationUrlTemplate: PropTypes.string,
    sagaFetchProductsByCat: PropTypes.func,
    changeCategoryPage: PropTypes.func,
    external: PropTypes.shape({
      paginationUrlTemplate: PropTypes.string,
      paginationDataSource: PropTypes.string,
      sagaFetchProductsByCatExternal: PropTypes.func,
      changeCategoryPage: PropTypes.func,
    }),
    // And all valid Ant Card component props
  }
  
  componentWillMount() {
    // Reload product if cache was expired
    if (this.props.products.length === 0) {
      this.triggerFetchProductPage(this.props);
    }
  }
  
  componentDidMount() {
    // Reload product if cache was expired
    if (!this.props.external) {
      scrollToPosition(45);
    }
  }
  
  shouldComponentUpdate(nextProps) {
    const shouldUpdate = (
      !isEqual(nextProps.pagination[nextProps.category.category_id], this.props.pagination[nextProps.category.category_id])
      || !isEqual(nextProps.products, this.props.products)
      || nextProps.perPage !== this.props.perPage
      || nextProps.total !== this.props.total
    );
    
    return shouldUpdate;
  }
  
  componentWillUpdate(nextProps) {
    if ((nextProps.products.length === 0) && !nextProps.loading) {
      //console.log("No products found, trying to fetch new product list");
      
      // Fetch new product list and save to cache
      this.triggerFetchProductPage(nextProps);
    }
  }
  
  triggerFetchProductPage = (props) => {
    // Syntax: this.props.myAction(payload)
    const payload = {
      category: props.category.category_id,
      page: props.pagination[props.category.category_id],
      perPage: props.perPage
    };
  
    props.external
      ? props.external.sagaFetchProductsByCatExternal.trigger(payload)
      : props.sagaFetchProductsByCat.trigger(payload);
  }
  
  handlePaginationChange = (page, perPage) => {
    const catId = this.props.category.category_id;
    const catName = getFriendlyUrlComponent(this.props.category.name);
    const pagination = this.props.pagination;
    pagination[catId] = page;
  
    this.props.external
      ? this.props.external.changeCategoryPage(catId, page)
      : this.props.changeCategoryPage(catId, page);

    this.goToCategoryPage(this.props.paginationUrlTemplate, {
      '[page]': page,
      '[catId]': catId,
      '[catName]': catName,
      '[pagination]': JSON.stringify(pagination),
    });
  }
  
  categoryContainerRef;
  goToCategoryPage = (targetUrlTemplate, urlData) => {
    const targetUrl = targetUrlTemplate.replacePair(urlData);
    this.props.push(targetUrl);
  
    const FIXED_NAV_BAR_HEIGHT = 50;
    scrollToElement(this.categoryContainerRef, FIXED_NAV_BAR_HEIGHT + 10);
  }
  
  // NOTE: Can migrate it to shopPage, should not put this fn here.
  goToCategory = () => {
    const catId = this.props.category.category_id;
    const catName = getFriendlyUrlComponent(this.props.category.name);
    const targetUrl = `/category/${catId}/${catName}`;
    
    this.props.push(targetUrl);
    this.props.history.replace(targetUrl);
  }
  
  goBack = () => {
    this.props.history.go(-1);
  }
  
  render() {
    //console.info('ProductCategory rendered, category = ', this.props.category.category_id);

    const {products, pagination, total, category, viewAllBtn = true} = this.props;
  
    const props = pick(this.props, supportedAntCardPropNames);
    props.className = classnames(Styles.productCategory, this.props.className);
    
    //if (!products.length) {
    //  props.loading = true;
    //} // ==> Move to product list

    props.title = (
      <Row type="flex" align="middle" justify="space-between" className={Styles.headC} style={{backgroundImage: `url(${category.photo})`}}>
        <Col span={12}>
          <p className={Styles.title}>{category.name}</p>
          <p className={Styles.subTitle}>{category.total} sản phẩm</p>
        </Col>
        <Col span={12}>
          <Row type="flex" align="middle" justify="end">
            {viewAllBtn && <Col xs={12} sm={0}><Button onClick={this.goToCategory} type="default" className={Styles.headBtn}><Icon type="right"/></Button></Col>}
            {viewAllBtn && <Col xs={0} sm={12}><Button onClick={this.goToCategory} type="default" className={Styles.headBtn}>Xem tất cả <Icon type="right"/></Button></Col>}
            {!viewAllBtn && <Col xs={12} sm={0}><Button onClick={this.goBack} type="default" className={Styles.headBtn}><Icon type="left"/></Button></Col>}
            {!viewAllBtn && <Col xs={0} sm={12}><Button onClick={this.goBack} type="default" className={Styles.headBtn}><Icon type="left"/> Back</Button></Col>}
          </Row>
        </Col>
      </Row>
    );

    return (
      <Card {...props} ref={ele => this.categoryContainerRef = ele}>
        <ProductList products={products}/>
        {(total > this.props.perPage) && <hr/>}
        {(total > this.props.perPage) &&
        <Pagination
          current={pagination[category.category_id]} total={total} pageSize={this.props.perPage}
          onChange={this.handlePaginationChange}
        />
        }
      </Card>
    );
  }
}
