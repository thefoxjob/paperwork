import Email from './drivers/email';
import Slack from './drivers/slack';

class Notification {
  constructor(sender, recipient, title, msg, options = {}) {
    this.sender = sender;
    this.recipient = recipient;
    this.title = title;
    this.msg = msg;
    this.options = options;
  }

  static use(service) {
    let driver = null;

    try {
      const driver = require(`.drivers/${ service }`);
    } catch (e) {
      logMyErrors(e);
    }

    return new NotificationDriver(service);
  }
}

class NotificationDriver extends Notification {
  constructor(driver) {
    super();

    this.driver = driver;
  }

  send() {
    const notificationObject = new Notification(this.recipient, this.msg, this.options={});
    switch(this.driver) {
    case 'slack': 
      return new Slack(notificationObject);
      Slack.send();
      break;
    case'email':
      return new Email(notificationObject);
      Email.send();
      break;
    default:
      throw 'Notification sending failed!';
    }
  }
}

export default Notification;