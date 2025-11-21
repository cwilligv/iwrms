// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.VUE_APP_TWILIO_ACCOUNT_SID;
const authToken = process.env.VUE_APP_TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createMessage() {
  const message = await client.messages.create({
    body: "This is the ship that made the Kessel Run in fourteen Bananasecs?",
    from: "+15714597906",
    to: "+18777804236",
  });

  console.log(message.body);
}

createMessage();