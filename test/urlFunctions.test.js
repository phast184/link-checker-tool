const chalk = require("chalk");
const { jsonResult, checkURL } = require("../src/urlHelper/urlFunctions");

const originalConsoleLogFn = global.console.log;
const originalConsoleErrorFn = global.console.error;

describe("test all funtions in urlFunctions", () => {
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

  // test jsonResult
  test("should return jsonResult object with status code 200", async () => {
    let url = "https://www.instagram.com/";
    await jsonResult(url);
    const expected = [
      {
        url: url,
        status: 200,
      },
    ];
    expect(finalize(JSON.stringify(logOutput))).toEqual(
      JSON.stringify(expected)
    );
    expect(finalize(errorOutput)).toBe(null);
  });

  test("should return jsonResult object with status code 404", async () => {
    let url =
      "http://zadkielm.blogspot.com/feeds/posts/default/-/open%20source";
    await jsonResult(url);
    const expected = [
      {
        url: url,
        status: 404,
      },
    ];
    expect(finalize(JSON.stringify(logOutput))).toEqual(
      JSON.stringify(expected)
    );
    expect(finalize(errorOutput)).toBe(null);
  });

  // test checkURL

  test("should return 200 code for the GOOD url", async () => {
    let flag = "good";
    let url = "https://www.instagram.com/";
    await checkURL(url, flag);
    const expected = chalk.green("[GOOD]" + "[200]" + " " + url);
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });

  test("should return 400 or 404 code for the GOOD url", async () => {
    let flag = "bad";
    let url = "http://dev-blog.zerogin.com/category/opensource/feed";
    await checkURL(url, flag);
    const expected = chalk.red("[BAD]" + "[404]" + " " + url);
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });

  test("should return 500 status code for the UNKNOWN url", async () => {
    let flag = "all";
    let url = "http://stronglytyped.ca/category/spo600/feed";
    await checkURL(url, flag);
    const expected = chalk.gray("[UNKOWN]" + "[500]" + " " + url);
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });


