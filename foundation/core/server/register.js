import IoC from '@thefoxjob/js-ioc';
import { Registrar } from '@thefoxjob/js-service-provider';

import config from '../../config';
import modules from '../../config/modules';


export default (app) => {
  IoC.bindInstance('config', () => config);
  IoC.bindInstance('app', () => app);

  Object.keys(modules.adapters).forEach((key) => {
    if (modules.adapters[key]) {
      IoC.bind(key, () => modules.adapters[key]);
    }
  });

  const registrar = new Registrar(IoC);
  registrar.registerProviders(Object.values(modules.providers));

  return IoC;
};
