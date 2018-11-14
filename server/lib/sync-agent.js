/* @flow */
import type { THullReqContext, THullConnector } from "hull";

import type {
  HullMetrics,
  HullClient,
  HullClientLogger,
  SalesloftConnectorSettings,
  SalesloftClientConfiguration,
  SalesloftMappingConfiguration
} from "./types";

const { settingsUpdate, pipeStreamToPromise } = require("hull/lib/utils");

const _ = require("lodash");
const { DateTime } = require("luxon");
const SalesloftMapping = require("./salesloft-mapping");
const SalesloftClient = require("./salesloft-client");

const BASE_API_URL = "https://api.salesloft.com/v2";

class SyncAgent {
  hullMetric: HullMetrics;
  hullClient: HullClient;
  hullLogger: HullClientLogger;
  hullConnector: THullConnector;
  helpers: Object;
  privateSettings: SalesloftConnectorSettings;
  settingsUpdate;
  salesloftMapping: SalesloftMapping;
  salesloftClient: SalesloftClient;

  constructor(ctx: THullReqContext) {
    this.hullMetric = ctx.metric;
    this.hullLogger = ctx.client.logger;
    this.hullClient = ctx.client;
    this.hullConnector = ctx.connector;
    this.helpers = ctx.helpers;
    this.settingsUpdate = settingsUpdate.bind(null, ctx);
    this.privateSettings = _.get(ctx, "connector.private_settings");

    const salesloftClientConfiguration: SalesloftClientConfiguration = {
      baseApiUrl: BASE_API_URL,
      hullMetric: this.hullMetric,
      hullLogger: this.hullLogger,
      apiKey: this.privateSettings.api_key
    };
    this.salesloftClient = new SalesloftClient(salesloftClientConfiguration);

    const salesloftMappingConfiguration: SalesloftMappingConfiguration = {
      accountAttributesInbound: this.privateSettings.account_attributes_inbound,
      personAttributesInbound: this.privateSettings.person_attributes_inbound
    };
    this.salesloftMapping = new SalesloftMapping(salesloftMappingConfiguration);
  }

  fetchUpdatedAccounts(): Promise<any> {
    const updatedAfter = this.getFetchUpdatedAfter(
      parseInt(this.privateSettings.account_last_sync_at, 10)
    );

    this.hullLogger.info("incoming.accounts.start", { updated_after: updatedAfter.toISODate() });

    const streamOfUpdatedAccounts = this.salesloftClient.listAccountsStream(
      updatedAfter
    );

    return pipeStreamToPromise(streamOfUpdatedAccounts, accounts => {
      this.hullLogger.info("incoming.accounts.progress", {
        accounts_count: accounts.length
      });

      return Promise.all(
        accounts.map(account => {
          const hullAccount = this.hullClient.asAccount({
            domain: account.domain,
            anonymous_id: `salesloft:${account.id}`
          });
          const hullAccountAttributes = this.salesloftMapping.mapSalesloftAccountToHull(
            account
          );

          return hullAccount
            .traits(hullAccountAttributes)
            .then(() => {
              return hullAccount.logger.info(
                "incoming.account.success",
                hullAccountAttributes
              );
            })
            .catch(error => {
              hullAccount.logger.error("incoming.account.error", error);
            });
        })
      );
    })
      .then(() => {
        return this.settingsUpdate({
          account_last_sync_at: Math.floor(DateTime.utc().toMillis() / 1000)
        });
      })
      .then(() => this.hullLogger.info("incoming.accounts.success"))
      .catch(error => {
        this.hullLogger.error("incoming.accounts.error", error);
      });
  }

  fetchUpdatedPeople() {
    const updatedAfter = this.getFetchUpdatedAfter(
      parseInt(this.privateSettings.person_last_sync_at, 10)
    );

    this.hullLogger.info("incoming.person.start", { updated_after: updatedAfter.toISODate() });

    const streamOfUpdatedPeople = this.salesloftClient.listPeopleStream(
      updatedAfter
    );

    return pipeStreamToPromise(streamOfUpdatedPeople, people => {
      this.hullLogger.info("incoming.person.progress", {
        people_count: people.length
      });

      return Promise.all(
        people.map(person => {
          const hullUser = this.hullClient.asUser({
            email: person.email,
            anonymous_id: `salesloft:${person.id}`
          });
          const hullUserAttributes = this.salesloftMapping.mapSalesloftPersonToHull(
            person
          );

          return hullUser
            .traits(hullUserAttributes)
            .then(() => {
              if (_.get(person, "account.id")) {
                hullUser
                  .account({
                    anonymous_id: `salesloft:${_.get(person, "account.id")}`
                  })
                  .traits({});
              }

              return hullUser.logger.info(
                "incoming.person.success",
                hullUserAttributes
              );
            })
            .catch(error => {
              hullUser.logger.error("incoming.person.error", error);
            });
        })
      );
    })
      .then(() => {
        return this.settingsUpdate({
          person_last_sync_at: Math.floor(DateTime.utc().toMillis() / 1000)
        });
      })
      .then(() => this.hullLogger.info("incoming.people.success"))
      .catch(error => {
        this.hullLogger.error("incoming.people.error", error);
      });
  }

  getFetchUpdatedAfter(lastSyncAt: number) {
    if (!_.isNaN(lastSyncAt)) {
      return DateTime.fromMillis(lastSyncAt * 1000).minus({
        minutes: 5
      });
    }

    return DateTime.utc().minus({
      days: 2,
      minutes: 5
    });
  }

  isAuthenticationConfigured() {
    return this.salesloftClient.hasValidApiKey();
  }
}

module.exports = SyncAgent;
