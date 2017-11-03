import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';


class Page extends React.PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.node,
      PropTypes.string,
    ]).isRequired,
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
  }

  states = {
    information: null,
  }

  render() {
    return <div className={ classnames('page', this.props.className) }>{ this.props.children }</div>;
  }
}

export default Page;
