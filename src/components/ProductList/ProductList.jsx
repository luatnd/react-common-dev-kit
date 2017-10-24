import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';

import Product from '../Product/Product'
import LoadingBlock from '../../components/AntLoading/LoadingBlock'

//const Styles = require("./ProductList.module.scss");

export default class ProductList extends React.PureComponent {
  static propTypes = {
    fetchAllProducts: PropTypes.func,
    products: PropTypes.array,
  }

  render() {
    //console.log("ProductList rendered");

    const {products} = this.props;
    const loading = (!products || !products.length);

    return <Row gutter={16}>
      {loading
        ? [1, 2, 3, 4, 5, 6, 7, 8].map((n) =>
          <Col key={n} xs={24} sm={12} md={8} lg={6}>
            <LoadingBlock/>
          </Col>
        )
        : products.map((product) =>
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <Product product={product} imageDirection={'horizontal'}/>
          </Col>
        )
      }
    </Row>
  }
}
