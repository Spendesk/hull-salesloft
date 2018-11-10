/* eslint-disable global-require, import/no-dynamic-require */
const nock = require("nock");

const SyncAgent = require("../../server/lib/sync-agent");
const { ContextMock } = require("./helpers/context-mock");

/*
 * SyncAgent tests scenarios triggered by smart-notifier messages,
 * for more details about the scenarios, see ./scenarios/README.md
*/

describe("SyncAgent", () => {
  let ctxMock;

  beforeEach(() => {
    ctxMock = new ContextMock();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  test("smoke test", () => {
    expect(ctxMock).toBeDefined();
  });

  describe("fetch", () => {
    test("fetch-accounts", () => {
      const schedulerPayload = require("./scenarios/fetch-accounts/scheduler-payload")();
      ctxMock.connector = schedulerPayload.connector;
      ctxMock.ship = schedulerPayload.connector;
      const syncAgent = new SyncAgent(ctxMock);
      
      require("./scenarios/fetch-accounts/api-response-expectations")(nock);
      
      return syncAgent.fetchUpdatedAccounts().then(() => {
        require("./scenarios/fetch-accounts/ctx-expectations")(ctxMock);
        expect(nock.isDone()).toBe(true);
      });
    });

    test("fetch-people", () => {
      const schedulerPayload = require("./scenarios/fetch-people/scheduler-payload")();
      ctxMock.connector = schedulerPayload.connector;
      ctxMock.ship = schedulerPayload.connector;
      const syncAgent = new SyncAgent(ctxMock);
      
      require("./scenarios/fetch-people/api-response-expectations")(nock);
      
      return syncAgent.fetchUpdatedPeople().then(() => {
        require("./scenarios/fetch-people/ctx-expectations")(ctxMock);
        expect(nock.isDone()).toBe(true);
      });
    });
  });
});
