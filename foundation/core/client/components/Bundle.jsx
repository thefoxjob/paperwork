import React from 'react';
import PropTypes from 'prop-types';


class Bundle extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    load: PropTypes.func.isRequired,
  }

  state = {
    module: null,
  }

  componentWillMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }

  load(props) {
    this.setState({ module: null });

    props.load((module) => {
      this.setState({ module: module.default ? module.default : module });
    });
  }

  render() {
    return this.state.module ? this.props.children(this.state.module) : null;
  }
}

export default Bundle;
