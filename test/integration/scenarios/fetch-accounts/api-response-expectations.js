const _ = require("lodash");
const accountsPayload = require("../../fixtures/api-responses/list-accounts.json");
const emptyPayload = require("../../fixtures/api-responses/list-empty.json");

module.exports = nock => {
  nock("https://api.salesloft.com/v2/")
    .get(/\/accounts\//)
    .query({
      page: 1,
      per_page: 100,
      updated_at: { gt: '2018-11-09' }
    })
    .reply(200, accountsPayload);

  nock("https://api.salesloft.com/v2/")
    .get(/\/accounts\//)
    .query({
      page: 2,
      per_page: 100,
      updated_at: { gt: '2018-11-09' }
    })
    .reply(200, emptyPayload);
};
