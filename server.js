const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const cors = require("cors");
require('dotenv').config();

// middleware
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

app.post('/send', (req, res) => {
  console.log(req.body);
  const mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: `Message from ${req.body.name}: ${req.body.subject}`,
    html: `<h1>${req.body.subject}</h1>
      <p>Nome: ${req.body.name}</p>
      <p>Email: ${req.body.email}</p>
      <p>Mensagem: ${req.body.message}</p>
      `,
  };
  
  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      res.json({
        status: "fail",
      });
    } else {
      console.log("== Message Sent ==");
      res.json({
        status: "success",
      });
    }
  })
})

// const port = process.env.PORT || 5000;
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
