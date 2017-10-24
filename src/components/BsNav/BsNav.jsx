
import React from 'react';
import { NavLink } from 'react-router-dom';

import logoImg from '../../assets/img/campp-logo-2.png';
import "../../assets/css/campp_bootstrap.min.css";
const BsNavStyles = require("./BsNav.module.scss");


export default class BsNav extends React.Component {
  state = {
    collapsed: true,
  }
  
  handleBtnClick = () => {
    this.setState(function (prevState) {
      return {
        collapsed: !prevState.collapsed
      }
    });
  }
  
  render() {
    const { collapsed } = this.state;

    return (
      <nav className={`${BsNavStyles.navContainer} navbar navbar-default mainmenu-area navbar-fixed-top affix`}>
        <div className="container">
        {/*<div className="ant-col-xs-24 ant-col-sm-24 ant-col-md-18 ant-col-lg-20">*/}
    
          <div className="navbar-header">
            <button type="button" data-toggle="collapse"
                    className={`${BsNavStyles.btnMenuToggle} navbar-toggle ${collapsed ? 'collapsed' : ''}`}
                    data-target="#mainmenu" aria-expanded={!collapsed}
                    onClick={this.handleBtnClick}
            >
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
      
            <a href="/" className="navbar-brand" style={{padding: '0px 12px'}}>
              <img src={logoImg} alt="Campus Cộng - Kết nối sinh viên Việt Nam" style={{marginTop: '4px'}}/>
            </a>
          </div>
    
          <div className={`${BsNavStyles.navbarContent} navbar-collapse navbar-right collapse ${collapsed ? '' : 'in'}`} id="mainmenu">
            <ul className="nav navbar-nav">
              <li><NavLink to="/" activeClassName="active" exact>Home page</NavLink></li>
              <li><NavLink to="/shop" activeClassName="active">Shop page</NavLink></li>
              <li><a href="/#download">Mobile Apps</a></li>
              <li><a href="/#bar">Bar</a></li>
            </ul>
          </div>
  
        </div>
      </nav>
    )
  }
}