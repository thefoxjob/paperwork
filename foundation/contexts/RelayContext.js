import React from 'react';

import Environment from '../core/environment';
import config from '../config';


const environment = Environment.instance(config.get('graphql.endpoint'));
const RelayContext = React.createContext({
  environment,
});

export default RelayContext;
