import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';


const Component = props => React.createElement(props.tag, { className: classnames('component', props.className) }, props.children);

Component.defaultProps = {
  tag: 'div',
};

Component.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  tag: PropTypes.string,
};

export default Component;
