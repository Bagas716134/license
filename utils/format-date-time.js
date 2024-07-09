const moment = require("moment");

const FORMAT = "YYYY-MM-DD HH:mm:ss";

const formatDateTime = (dateTime) =>
  dateTime ? moment(dateTime).format(FORMAT) : "";

module.exports = {
  formatDateTime,
};
