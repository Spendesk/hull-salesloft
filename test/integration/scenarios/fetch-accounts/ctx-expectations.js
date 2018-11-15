const _ = require("lodash");
const apiAccountResponse = _.cloneDeep(
  require("../../fixtures/api-responses/list-accounts.json").data[0]
);

module.exports = ctxMock => {
  const expectedAccountIdent = {
    domain: _.get(apiAccountResponse, "domain"),
    anonymous_id: `salesloft:${_.get(apiAccountResponse, "id")}`
  }
  const accountTraits = {
    "name": { operation: "setIfNull", value: _.get(apiAccountResponse, "name") },
    "domain": { operation: "setIfNull", value: _.get(apiAccountResponse, "domain") },
    "salesloft/id": { operation: "set", value: _.get(apiAccountResponse, "id") },
    "salesloft/created_at": { operation: "set", value: _.get(apiAccountResponse, "created_at") },
    "salesloft/updated_at": { operation: "set", value: _.get(apiAccountResponse, "updated_at") },
    "salesloft/archived_at": { operation: "set", value: _.get(apiAccountResponse, "archived_at") },
    "salesloft/domain": { operation: "set", value: _.get(apiAccountResponse, "domain") },
    "salesloft/name": { operation: "set", value: _.get(apiAccountResponse, "name") },
    "salesloft/last_contacted_at": { operation: "set", value: _.get(apiAccountResponse, "last_contacted_at") },
    "salesloft/do_not_contact": { operation: "set", value: _.get(apiAccountResponse, "do_not_contact") },
    "salesloft/people_count": { operation: "set", value: _.get(apiAccountResponse, "counts.people") },
    "salesloft/last_contacted_by_id": { operation: "set", value: _.get(apiAccountResponse, "last_contacted_by.id") }
  };

  expect(ctxMock.client.asAccount.mock.calls[0]).toEqual([expectedAccountIdent]);
  expect(ctxMock.client.traits.mock.calls[0][0]).toEqual(accountTraits);
  expect(ctxMock.metric.increment.mock.calls).toHaveLength(1);
  expect(ctxMock.metric.increment.mock.calls[0]).toEqual([
    "ship.service_api.call",
    1,
    [
      "method:GET",
      "url:https://api.salesloft.com/v2/accounts/",
      "status:200",
      "statusGroup:2xx",
      "endpoint:GET https://api.salesloft.com/v2/accounts/"
    ]
  ]);

  expect(ctxMock.client.logger.debug.mock.calls).toHaveLength(1); // debug calls from super-agent
  expect(ctxMock.client.logger.error.mock.calls).toHaveLength(0);

  expect(ctxMock.client.logger.info.mock.calls).toHaveLength(4);
  expect(ctxMock.client.logger.info.mock.calls[3][0]).toEqual(
    "incoming.accounts.success"
  );
};
