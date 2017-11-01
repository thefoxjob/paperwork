import Slack from '@slack/client';

import NotificationAdapter from '../NotificationAdapter';


class SlackNotificationAdapter extends NotificationAdapter {
  constructor(options) {
    super(options);

    this.slack = new Slack.WebClient(options.token);
  }

  channel(name) {
    this.recipient(name);
  }

  send(message = null, subject = null, recipients = null) {
    // eslint-disable-next-line no-param-reassign
    recipients = this.recipients(recipients);
    // eslint-disable-next-line no-param-reassign
    subject = this.subject(subject);
    // eslint-disable-next-line no-param-reassign
    message = this.message(message);

    const promises = recipients.forEach(recipient => new Promise((resolve, reject) => {
      this.slack.chat.postMessage(recipient, message, {
        attachments: [{
          title: subject,
          text: message,
        }],
      }, (error) => {
        if (error) {
          return reject(error);
        }

        this.reset();
        return resolve();
      });
    }));

    return Promise.all(promises);
  }
}

export default SlackNotificationAdapter;
