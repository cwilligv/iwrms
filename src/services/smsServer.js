const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MessagingResponse } = require('twilio').twiml;
const twilio = require('twilio');

const accountSid = process.env.VUE_APP_TWILIO_ACCOUNT_SID;
const authToken = process.env.VUE_APP_TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const messages = [];

// Send SMS endpoint
app.post('/api/send-sms', async (req, res) => {
  const { to, body } = req.body;
  try {
    const message = await client.messages.create({
      body,
      from: '+15714597906',
      to,
    });
    res.status(200).json({ success: true, sid: message.sid });
  } catch (err) {
    console.error('Error sending SMS:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// handle incomming sms
app.post('/sms', express.urlencoded({ extended: false }), (req, res) => {
  const twiml = new MessagingResponse();
  const { From, Body } = req.body;
  //store incomming mesage in temp memory tfor displaying in modal.
  messages.push({
    from: From,
    body: Body,
    timestamp: new Date().toISOString(),
  });

  console.log('Incoming SMS from:', req.body.From);
  console.log('Message:', req.body.Body);

  // basic auto reply   not working atm, will look into it later.
  twiml.message('Thanks for your message!');

  res.type('text/xml').send(twiml.toString());
});

// API route to get messages
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.listen(3000, () => {
  console.log('SMS Server running on http://localhost:3000');
});
