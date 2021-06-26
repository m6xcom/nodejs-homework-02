const sendGrid = require("@sendgrid/mail");
require("dotenv").config();

class CreateSender {
  async send(msg) {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    return await sendGrid.send({ ...msg, from: "Max <maxcom@ex.ua>" });
  }
}

module.exports = CreateSender;
