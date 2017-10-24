/* eslint-disable */

// 3rd party
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { getDispatchMapper, getAllMapper } from '../../base/redux/dispatch';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux'
import classnames from 'classnames';
import { Layout, Breadcrumb, Row, Col, Card, BackTop } from 'antd';


// My logic
import { reader as exampleComponentReader} from './ExampleComponent.redux';

// My UI
const CommonStyles = require("../../components/Styles/Styles.module.scss");
const Styles = require("./ExampleComponent.module.scss");


@connect(
  state => {
    const exampleState = exampleComponentReader.getState(state);
    const foo = exampleComponentReader.getExampleDataByFooId(state, 10);
    
    return {
      foo
    }
  },
  getAllMapper({}, {})
)
export default class ExampleComponent extends React.Component {
  static propTypes = {
    foo: PropTypes.func,
  }
  
  state = {
    
  }
  
  render() {
    return (
      <div>My component</div>
    );
  }
}
