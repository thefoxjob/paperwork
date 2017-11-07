import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';


const Body = props => <div className={ classnames('body', props.className) }>{ props.children }</div>;

Body.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
};

export default Body;
