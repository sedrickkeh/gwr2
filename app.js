const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>A user has sent a contact form from the website</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport

  var transporter = nodemailer.createTransport({
    name: 'Gmail',
    service: 'Gmail',
    auth: {
        user: 'HKUSTGuinnessWorldRecord@gmail.com',
        pass: 'gwrhandsup2018'
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: 'HKUSTGuinnessWorldRecord@gmail.com',
      to: 'worldrecord@ust.hk',
      subject: 'From website',
      html: output
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent.'});
  });
  });

app.listen(3000, () => console.log('Server started...'));