const {
  fieldsAccountInbound,
  fieldsPersonInbound
} = require("./settings-fields");
const statusCheck = require("./status-check");
const fetch = require("./fetch");
const adminHandler = require("./admin-handler");

module.exports = {
  fieldsAccountInbound,
  fieldsPersonInbound,
  statusCheck,
  fetch,
  adminHandler
};
