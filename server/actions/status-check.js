/* @flow */
import type { $Response } from "express";
import type { THullRequest } from "hull";

const _ = require("lodash");
const SyncAgent = require("../lib/sync-agent");

function statusCheckAction(req: THullRequest, res: $Response): void {
  if (_.has(req, "hull.connector.private_settings")) {
    const { client } = req.hull;
    const connector = req.hull.connector;
    const syncAgent = new SyncAgent(req.hull);
    const messages: Array<string> = [];
    let status: string = "ok";

    if (syncAgent.isAuthenticationConfigured() === false) {
      status = "error";
      messages.push(
        "Cannot communicate with API because no API key is configured."
      );
    }

    res.json({ status, messages });
    client.put(`${connector.id}/status`, { status, messages });
    return;
  }

  res.status(404).json({
    status: 404,
    messages: ["Request doesn't contain data about the connector"]
  });
}

module.exports = statusCheckAction;
