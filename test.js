const memoization = require("./memoizaton");
const expect = require("chai").expect;
const sinon = require("sinon");
// hint: use https://sinonjs.org/releases/v6.1.5/fake-timers/ for faking timeouts

describe("memoization", function () {
  let clock;
  before(() => {
    clock = sinon.useFakeTimers(Date.now());
  });
  after(() => {
    clock.uninstall();
  });

  it("should memoize function result", () => {
    const testFunction = (year, month, day) => {
      return Date.now() + Date(year, month, day);
    };

    const testMemoizedFunction = memoization.memoize(
      testFunction,
      (year, month, day) => year + month + day,
      1000
    );

    const firstResult = testMemoizedFunction(1, 11, 26);
    const secondResult = testMemoizedFunction(1, 11, 26);
    expect(firstResult).to.equal(secondResult);

    clock.tick(500);
    const thirdResult = testMemoizedFunction(1, 11, 26);
    expect(thirdResult).to.equal(secondResult);

    clock.tick(1000);
    const forthResult = testMemoizedFunction(1, 11, 26);
    expect(forthResult).not.to.equal(secondResult);
  });
});
