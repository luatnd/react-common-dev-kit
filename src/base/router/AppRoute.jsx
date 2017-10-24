/**
 * Generate router from react router v4
 */
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
//import { CSSTransitionGroup } from 'react-transition-group';
import { ConnectedRouter } from 'react-router-redux';
import history from './history'
import md5 from 'md5';

import { noticeHack } from '../../helpers/consoleHelper';
import routes from './rootRoutes';
import Page404 from '../../pages/Page404/Page404';


export default class AppRoute extends React.Component {
  componentDidMount() {
    noticeHack();
  }
  
  render() {
    return <ConnectedRouter history={history}>
      <BrowserRouter>
        <Switch>
          {routes.map((r) => {
            return <Route path={r.path} component={r.component} exact={r.exact} key={md5(r.path)}/>
          })}
          
          <Route component={Page404}/>
        </Switch>
      </BrowserRouter>
    </ConnectedRouter>
    ;
  }
}
  