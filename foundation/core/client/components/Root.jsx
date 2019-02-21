import PropTypes from 'prop-types';
import React from 'react';
import { matchRoutes } from 'react-router-config';
import { withRouter } from 'react-router';

import Application from './Application';


const Root = (props) => {
  let branch = props.branch;

  if (! branch) {
    branch = matchRoutes(props.routes, props.location.pathname);
  }

  return <Application branch={ branch } environment={ props.environment } />;
};

Root.defaultProps = {
  branch: null,
};

Root.propTypes = {
  branch: PropTypes.arrayOf(PropTypes.shape({
    match: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
  })),
  // eslint-disable-next-line react/forbid-prop-types
  environment: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  routes: PropTypes.array.isRequired,
};

export default withRouter(Root);
