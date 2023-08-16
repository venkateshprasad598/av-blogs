const redis = require("redis");

const client = redis.createClient({
  host: "ec2-13-213-233-77.ap-southeast-1.compute.amazonaws.com",
  port: 6379,
});

client.on("connect", function () {
  console.log("redis connected");
});

client.on("error", (err) => {
  console.log("Error " + err);
});

module.exports = client;
