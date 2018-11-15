/* @flow */
import type {
  HullMetrics,
  HullClientLogger,
  SalesloftClientConfiguration,
  SalesloftListQuery,
  SalesloftListBody,
  SalesloftAccountRead,
  SalesloftPersonRead
} from "./types";

const _ = require("lodash");
const { promiseToReadableStream } = require("hull/lib/utils");
const superagent = require("superagent");
const SuperagentThrottle = require("superagent-throttle");
const {
  superagentUrlTemplatePlugin,
  superagentInstrumentationPlugin,
  superagentErrorPlugin
} = require("hull/lib/utils");
const { ConfigurationError } = require("hull/lib/errors");

const throttlePool = {};

class SalesloftClient {
  urlPrefix: string;
  hullMetric: HullMetrics;
  hullLogger: HullClientLogger;
  apiKey: string;
  agent: superagent;

  constructor(config: SalesloftClientConfiguration) {
    this.urlPrefix = config.baseApiUrl;
    this.hullMetric = config.hullMetric;
    this.hullLogger = config.hullLogger;
    this.apiKey = config.apiKey;

    throttlePool[this.apiKey] =
      throttlePool[this.apiKey] ||
      new SuperagentThrottle({
        rate: parseInt(process.env.THROTTLE_RATE, 10) || 40, // how many requests can be sent every `ratePer`
        ratePer: parseInt(process.env.THROTTLE_RATE_PER, 10) || 1000 // number of ms in which `rate` requests may be sent
      });

    const throttle = throttlePool[this.apiKey];

    this.agent = superagent
      .agent()
      .use(throttle.plugin())
      .redirects(0)
      .use(superagentErrorPlugin({ timeout: 10000 }))
      .use(superagentUrlTemplatePlugin())
      .use(
        superagentInstrumentationPlugin({
          logger: this.hullLogger,
          metric: this.hullMetric
        })
      )
      .on("response", res => {
        const limit = _.get(res.header, "x-ratelimit-limit-minute");
        const remaining = _.get(res.header, "x-ratelimit-remaining-minute");

        if (remaining !== undefined) {
          this.hullMetric.value("connector.service_api.remaining", remaining);
        }

        if (limit !== undefined) {
          this.hullMetric.value("connector.service_api.limit", limit);
        }
      })
      .set({
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      });
  }

  listAccounts(
    query: SalesloftListQuery
  ): Promise<SalesloftListBody<SalesloftAccountRead>> {
    if (!this.hasValidApiKey()) {
      return Promise.reject(
        new ConfigurationError("No API key specified in the Settings.", {})
      );
    }

    return this.agent.get(`${this.urlPrefix}/accounts/`).query(_.pickBy(query));
  }

  listPeople(
    query: SalesloftListQuery
  ): Promise<SalesloftListBody<SalesloftPersonRead>> {
    if (!this.hasValidApiKey()) {
      return Promise.reject(
        new ConfigurationError("No API key specified in the Settings.", {})
      );
    }

    return this.agent.get(`${this.urlPrefix}/people/`).query(_.pickBy(query));
  }

  listAccountsStream(updatedAfter: DateTime): Readable {
    const accountsQuery = { 
      per_page: 100,
      "updated_at[gt]": updatedAfter.toISODate(),
      include_paging_counts: 1
    };

    return promiseToReadableStream(push => {
      return this.listAccounts(_.merge(accountsQuery, { page: 1 })).then(res => {
        push(res.body.data);

        const apiOps = [];
        if (
          _.get(res.body, "metadata.paging.total_pages")
        ) {
          const totalPages = res.body.metadata.paging.total_pages;

          for (let page = 2; page < totalPages; page += 1) {
            apiOps.push(this.listPeople(_.merge(accountsQuery, { page })));
          }
        }

        return Promise.all(apiOps).then(results => {
          results.forEach(result => {
            push(result.body.data);
          });
        });
      });
    });
  }

  listPeopleStream(updatedAfter: DateTime) {
    const peopleQuery = { 
      per_page: 100,
      "updated_at[gt]": updatedAfter.toISODate(),
      include_paging_counts: 1
    };

    return promiseToReadableStream(push => {
      return this.listPeople(_.merge(peopleQuery, { page: 1 })).then(res => {
        push(res.body.data);

        const apiOps = [];
        if (
          _.get(res.body, "metadata.paging.total_pages")
        ) {
          const totalPages = res.body.metadata.paging.total_pages;

          for (let page = 2; page < totalPages; page += 1) {
            apiOps.push(this.listPeople(_.merge(peopleQuery, { page })));
          }
        }

        return Promise.all(apiOps).then(results => {
          results.forEach(result => {
            push(result.body.data);
          });
        });
      });
    });
  }

  hasValidApiKey() {
    return _.isString(this.apiKey) && this.apiKey.length > 5;
  }
}

module.exports = SalesloftClient;
