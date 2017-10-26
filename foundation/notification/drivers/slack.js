import path from 'path';
import slack from '@slack/client';

import Notification from '../notification';

class Slack {
  constructor(notificationObject) {
    this.slack = notificationObject;
  }

  send() {
    var IncomingWebhook = slack.IncomingWebhook;

    var url = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/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';

    var webhook = new IncomingWebhook(url);

    webhook.send(this.slack.msg, function(err, header, statusCode, body) {
      if (err) {
        console.log('Error:', err);
      } else {
        console.log('Received', statusCode, 'from Slack');
      }
    });
  }
}

export default Slack;