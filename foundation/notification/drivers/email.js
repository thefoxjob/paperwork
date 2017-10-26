import nodemailer from 'nodemailer';

import Notification from '../notification';

class Email {
  constructor(notificationObject) {
    this.email = notificationObject;
  }

  send() {
    nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass  // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    /*let mailOptions = {
        from: '"Edward Khor 👻" <edward@shopprapp.com>', // sender address
        to: '"DQ" <dao@shopprapp.com>', // list of receivers
        subject: 'Hello Shoppr ✔', // Subject line
        text: 'Shoppr - paradise for fashion lovers!', // plain text body
        html: '<b>Hello world? This is Shoppr</b>' // html body
    };*/

    let mailOptions = {
        from: this.email.sender , // sender address
        to: this.email.recipient , // list of receivers
        subject: this.email.title , // Subject line
        text: this.email.msg , // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
    });
  }
}

export default Email;