const memoization = require("./memoizaton");
const expect = require("chai").expect;

// hint: use https://sinonjs.org/releases/v6.1.5/fake-timers/ for faking timeouts

describe("memoization", function () {
  it("should memoize function result", (done) => {
    const testFunction = (year, month, day) => {
      return Date.now() + Date(year, month, day);
    };

    const memoized = memoization.memoize(
      testFunction,
      (year, month, day) => year + month + day,
      1000
    );
    const firstResult = memoized(1, 11, 26);
    const secondResult = memoized(1, 11, 26);
    expect(firstResult).to.equal(secondResult);

    setTimeout(() => {
      const thirdResult = memoized(1, 11, 26);
      expect(thirdResult).to.equal(secondResult);
      setTimeout(() => {
        const forthResult = memoized(1, 11, 26);
        expect(forthResult).not.to.equal(secondResult);
        done();
      }, 1000);
    }, 500);
  });

  // TODO additional tests required
});
