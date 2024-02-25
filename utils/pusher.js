const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1761471",
  key: "b6fc6c0bbaa88e19ba69",
  secret: "67b5d2f07ce9d171b63d",
  cluster: "ap2",
  useTLS: true
});

module.exports = {pusher};