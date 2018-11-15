const _ = require("lodash");
const apiPersonResponse = _.cloneDeep(
  require("../../fixtures/api-responses/list-people.json").data[0]
);

module.exports = ctxMock => {
  const expectedUserIdent = {
    email: _.get(apiPersonResponse, "email_address"),
    anonymous_id: `salesloft:${_.get(apiPersonResponse, "id")}`
  }
  const userTraits = {
    "first_name": { operation: "setIfNull", value: _.get(apiPersonResponse, "first_name") },
    "last_name": { operation: "setIfNull", value: _.get(apiPersonResponse, "last_name") },
    "email": { operation: "setIfNull", value: _.get(apiPersonResponse, "email") },
    "phone": { operation: "setIfNull", value: _.get(apiPersonResponse, "phone") },
    "salesloft/id": { operation: "set", value: _.get(apiPersonResponse, "id") },
    "salesloft/created_at": { operation: "set", value: _.get(apiPersonResponse, "created_at") },
    "salesloft/updated_at": { operation: "set", value: _.get(apiPersonResponse, "updated_at") },
    "salesloft/first_name": { operation: "set", value: _.get(apiPersonResponse, "first_name") },
    "salesloft/last_name": { operation: "set", value: _.get(apiPersonResponse, "last_name") },
    "salesloft/email": { operation: "set", value: _.get(apiPersonResponse, "email") },
    "salesloft/last_replied_at": { operation: "set", value: _.get(apiPersonResponse, "last_replied_at") },
    "salesloft/title": { operation: "set", value: _.get(apiPersonResponse, "title") },
    "salesloft/emails_bounced_count": { operation: "set", value: _.get(apiPersonResponse, "counts.emails_bounced") },
    "salesloft/last_contacted_by_id": { operation: "set", value: _.get(apiPersonResponse, "last_contacted_by.id") }
  };

  expect(ctxMock.client.asUser.mock.calls[0]).toEqual([expectedUserIdent]);
  expect(ctxMock.client.traits.mock.calls[0][0]).toEqual(userTraits);
  expect(ctxMock.metric.increment.mock.calls).toHaveLength(1);
  expect(ctxMock.metric.increment.mock.calls[0]).toEqual([
    "ship.service_api.call",
    1,
    [
      "method:GET",
      "url:https://api.salesloft.com/v2/people/",
      "status:200",
      "statusGroup:2xx",
      "endpoint:GET https://api.salesloft.com/v2/people/"
    ]
  ]);

  expect(ctxMock.client.logger.debug.mock.calls).toHaveLength(1); // debug calls from super-agent
  expect(ctxMock.client.logger.error.mock.calls).toHaveLength(0);

  expect(ctxMock.client.logger.info.mock.calls).toHaveLength(4);
  expect(ctxMock.client.logger.info.mock.calls[3][0]).toEqual(
    "incoming.people.success"
  );
};
