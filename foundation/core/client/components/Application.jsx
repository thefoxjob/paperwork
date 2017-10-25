import React from 'react';
import { Route } from 'react-router-dom';

import router from '../router';


class Application extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      routes: [],
    };
  }

  componentDidMount() {
    (async () => {
      this.setState({ routes: await router.setup() });
    })();
  }

  render() {
    return this.state.routes.map(route => (
      <Route
        path={ route.path }
        render={ props => <route.component { ...props } routes={ route.routes } /> }
      />
    ));
  }
}

export default Application;
