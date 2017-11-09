import PropTypes from 'prop-types';
import React from 'react';
import QueryRenderer from 'relay-query-lookup-renderer';


class Application extends React.Component {
  static propTypes = {
    branch: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]).isRequired,
    environment: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
    ]).isRequired,
  }

  renderComponent(match, route, children = null) {
    if (route.query) {
      return (
        <QueryRenderer
          lookup
          environment={ this.props.environment }
          query={ route.query }
          variables={ typeof (route.variables) === 'function' ? route.variables(match.params) : route.variables }
          render={ ({ props }) => {
            if (props) {
              return <route.component { ...props }>{ children }</route.component>;
            }

            if (route.loading) {
              return <route.loading />;
            }

            return null;
          } }
        />
      );
    }

    return <route.component>{ children }</route.component>;
  }

  render() {
    let component = null;

    this.props.branch.reverse().forEach(({ match, route }) => {
      component = this.renderComponent(match, route, component);
    });

    return component;
  }
}

export default Application;
