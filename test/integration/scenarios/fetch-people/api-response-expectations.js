const _ = require("lodash");
const peoplePayload = require("../../fixtures/api-responses/list-people.json");
const emptyPayload = require("../../fixtures/api-responses/list-empty.json");

module.exports = nock => {
  nock("https://api.salesloft.com/v2/")
    .get(/\/people\//)
    .query({
      page: 1,
      per_page: 100,
      updated_at: { gt: '2018-11-09' }
    })
    .reply(200, peoplePayload);

  nock("https://api.salesloft.com/v2/")
    .get(/\/people\//)
    .query({
      page: 2,
      per_page: 100,
      updated_at: { gt: '2018-11-09' }
    })
    .reply(200, emptyPayload);
};
