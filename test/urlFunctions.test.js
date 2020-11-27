const chalk = require("chalk");
const nock = require("nock");
const { jsonResult } = require("../src/urlHelper/urlFunctions");

const originalConsoleLogFn = global.console.log;
const originalConsoleErrorFn = global.console.error;

describe("test jsonResult", () => {
  let logOutput = null;
  let errorOutput = null;

  function testLogFn(...args) {
    logOutput = logOutput || [];
    args.forEach((arg) => logOutput.push(arg));
  }

  function testErrorFn(...args) {
    errorOutput = errorOutput || [];
    args.forEach((arg) => errorOutput.push(arg));
  }

  function finalize(output) {
    if (output && Array.isArray(output)) {
      return output.join("");
    }
    return output;
  }

  beforeEach(() => {
    // setDefaultConfig();
    global.console.log = testLogFn;
    global.console.error = testErrorFn;

    logOutput = null;
    errorOutput = null;
  });

  afterEach(() => {
    global.console.log = originalConsoleLogFn;
    global.console.error = originalConsoleErrorFn;

    logOutput = null;
    errorOutput = null;
  });
    test("should return jsonResult object", async () => {
        let url = "https://www.instagram.com/";
        await jsonResult(url);
        const expected = [{
            url: url,
            status: 200
        }];
        expect(finalize(JSON.stringify(logOutput))).toEqual(JSON.stringify(expected));
        expect(finalize(errorOutput)).toBe(null);
    });
  
});


