class Notification {
  constructor(adapter) {
    this.adapter = adapter;
  }

  sender(sender) {
    this.adapter.sender(sender);

    return this;
  }

  addRecipient(recipient) {
    this.adapter.recipients(recipient);

    return this;
  }

  subject(subject) {
    this.adapter.subject(subject);

    return this;
  }

  message(message) {
    this.adapter.message(message);

    return this;
  }

  send(message = null, subject = null, recipients = null) {
    return this.adapter.send(message, subject, recipients);
  }
}

export default Notification;
