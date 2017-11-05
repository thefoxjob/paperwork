import ServiceProvider from '@thefoxjob/js-service-provider';

import Notification from './Notification';


class NotificationServiceProvider extends ServiceProvider {
  register() {
    this.ioc.bind('Notification', (ioc, params) => {
      const config = ioc.make('config');
      const options = config.secure.modules.notification;
      const adapter = ioc.make('NotificationAdapter', { request: params.request, options });

      return new Notification(adapter);
    });

    this.ioc.alias('Notification', 'notification');
  }
}

export default NotificationServiceProvider;
