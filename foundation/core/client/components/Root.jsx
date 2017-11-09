import PropTypes from 'prop-types';
import React from 'react';
import { matchRoutes } from 'react-router-config';
import { withRouter } from 'react-router';

import Application from './Application';


class Root extends React.Component {
  static propTypes = {
    environment: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
    ]).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    location: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    routes: PropTypes.array.isRequired,
  }

  render() {
    const branch = matchRoutes(this.props.routes, this.props.location.pathname);

    return <Application branch={ branch } environment={ this.props.environment } />;
  }
}

export default withRouter(Root);
