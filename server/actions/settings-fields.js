/* @flow */
import type { $Response } from "express";
import type { THullRequest } from "hull";

const _ = require("lodash");

const ACCOUNT_FIELDDEFS = require("../lib/account-fielddefs");
const PERSON_FIELDDEFS = require("../lib/person-fielddefs");

function fieldsAccountInbound(req: THullRequest, res: $Response): $Response {
  const options = _.map(ACCOUNT_FIELDDEFS, f => {
    return { value: f.id, label: f.label };
  });

  return res.json({ options });
}

function fieldsPersonInbound(req: THullRequest, res: $Response): $Response {
  const options = _.map(PERSON_FIELDDEFS, f => {
    return { value: f.id, label: f.label };
  });

  return res.json({ options });
}

module.exports = {
  fieldsAccountInbound,
  fieldsPersonInbound
};
