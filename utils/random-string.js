const { randomBytes } = require("crypto");

const randomString = (length = 30) =>
  randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);

module.exports = randomString;
