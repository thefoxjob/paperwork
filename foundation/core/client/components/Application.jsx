import PropTypes from 'prop-types';
import React from 'react';
import Relay, { graphql } from 'react-relay';
import { Route } from 'react-router-dom';

import Page from './Page';
import router from '../router';


class Application extends React.Component {
  static propTypes = {
    environment: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
    ]).isRequired,
  }

  render() {
    return router.setup().map(route => (
      <Route
        key={ route.path }
        exact={ typeof (route.exact) === 'boolean' ? route.exact : true }
        path={ route.path }
        render={ () => (
          <Relay.QueryRenderer
            environment={ this.props.environment }
            query={ graphql`
              query ApplicationQuery($path: String!) {
                page(path: $path) {
                  ...PageComponent
                }
              }
            ` }
            variables={{ path: route.path }}
            render={ ({ props }) => {
              if (props) {
                return <Page environment={ this.props.environment } query={ route.query } variables={ route.variables } component={ route.component } page={ props.page } />;
              }

              return null;
            } }
          />
        ) }
      />
    ));
  }
}

export default Application;
