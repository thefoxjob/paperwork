import sendmail from 'sendmail';

import NotificationAdapter from '../NotificationAdapter';


class EmailNotificationAdapter extends NotificationAdapter {
  send(message = null, title = null, recipients = null) {
    // eslint-disable-next-line no-param-reassign
    recipients = this.recipients(recipients);
    // eslint-disable-next-line no-param-reassign
    title = this.subject(title);
    // eslint-disable-next-line no-param-reassign
    message = this.message(message);

    return new Promise((resolve, reject) => sendmail({
      from: this.sender,
      to: recipients.join(', '),
      subject: title,
      html: message,
    }, (error, reply) => {
      if (error) {
        return reject(error);
      }

      this.reset();
      return resolve(reply);
    }));
  }
}

export default EmailNotificationAdapter;
