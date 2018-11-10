/* @flow */
import type { $Application } from "express";

const cors = require("cors");
const { credsFromQueryMiddlewares } = require("hull/lib/utils");

const actions = require("./actions/index");

function server(app: $Application): $Application {
  app.post("/fetch", ...credsFromQueryMiddlewares(), actions.fetch);

  app.get("/admin", ...credsFromQueryMiddlewares(), actions.adminHandler);

  app.get(
    "/fields-account-in",
    cors(),
    ...credsFromQueryMiddlewares(),
    actions.fieldAccountInbound
  );
  app.get(
    "/fields-person-in",
    cors(),
    ...credsFromQueryMiddlewares(),
    actions.fieldsPersonInbound
  );

  app.all("/status", ...credsFromQueryMiddlewares(), actions.statusCheck);

  return app;
}

module.exports = server;
