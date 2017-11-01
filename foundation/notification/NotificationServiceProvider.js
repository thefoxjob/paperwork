import Notification from './Notification';
import config from '../config';


class NotificationServiceProvider {
  constructor(name = null, _options = {}) {
    const adapter = name || config.secure.notification.default;
    const options = Object.assign(config.secure.notification, _options);

    if ( ! options.adapters[adapter]) {
      throw new ReferenceError(`[Notification Module] ${ adapter } is not found.`);
    }

    const Adapter = options.adapters[adapter].adapter.default ? options.adapters[adapter].adapter.default : options.adapters[adapter].adapter;

    return new Notification(new Adapter(options.adapters[adapter].options));
  }
}

export default NotificationServiceProvider;
