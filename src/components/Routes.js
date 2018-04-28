import React from 'react'
import styled from 'react-emotion'
import {connect} from 'react-redux'
import {Router, Route, Switch} from 'react-static'

import Landing from '../routes/landing'
import NotFound from '../routes/404'

import history from '../core/history'

function getByRole(role, route = Camper) {
  if (role === 'admin') {
    return Admin
  }

  return route
}

function getIfAuth(role, route) {
  if (role === 'admin') {
    return route
  }

  return Login
}

const Routes = ({user}) => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route component={NotFound} />
    </Switch>
  </Router>
)

const mapStateToProps = state => ({
  user: state.user,
})

const enhance = connect(mapStateToProps)

export default enhance(Routes)
