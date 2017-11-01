class NotificationAdapter {
  constructor(options) {
    this.options = options;
    this.states = {};

    this.reset();
  }

  reset() {
    this.states = {
      recipients: [],
      message: null,
      subject: null,
      sender: this.options.sender || null,
    };
  }

  sender(sender = null) {
    if (sender) {
      this.states.sender = sender;
    }

    return this.states.sender;
  }

  recipient(recipient) {
    this.recipients(recipient);
  }

  recipients(recipients = null) {
    if (recipients) {
      if (Array.isArray(recipients)) {
        this.states.recipients = this.states.recipients.concat(recipients);
      } else {
        this.states.recipients.push(recipients);
      }
    }

    return this.states.recipients;
  }

  subject(subject = null) {
    if (subject) {
      this.states.subject = subject;
    }

    return this.states.subject;
  }

  message(message = null) {
    if (message) {
      this.states.message = message;
    }

    return this.states.message;
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  send(message = null, subject = null, recipients = null) {
    throw new Error('Not yet implement');
  }
}

export default NotificationAdapter;
