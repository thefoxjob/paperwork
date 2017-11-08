import PropTypes from 'prop-types';
import React from 'react';
import Relay, { graphql } from 'react-relay';

import Meta from '../../../dom/Meta';


class Page extends React.Component {
  static defaultProps = {
    query: null,
    variables: {},
  }

  static propTypes = {
    component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
    ]).isRequired,
    environment: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
    ]).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    page: PropTypes.object.isRequired,
    query: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    variables: PropTypes.object,
  }

  render() {
    const { page } = this.props;

    return (
      <div id="page">
        <Meta { ...page } />

        { this.props.query ? (
          <Relay.QueryRenderer
            environment={ this.props.environment }
            query={ this.props.query }
            variables={ this.props.variables }
            render={ ({ props }) => <this.props.component { ...props } page={ page } /> }
          />
        ) : <this.props.component page={ page } /> }
      </div>
    );
  }
}

export default Relay.createFragmentContainer(Page, {
  page: graphql`
    fragment PageComponent on Page {
      path
      name
      meta {
        title
        description
        keyword
        image
        type
      }
      directories {
        name
        path
      }
      custom {
        script
      }
    }
  `,
});
