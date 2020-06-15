const memoization = require("./memoization");
const sinon = require("sinon");
// hint: use https://sinonjs.org/releases/v6.1.5/fake-timers/ for faking timeouts

describe("memoization", () => {
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers(Date.now());
  });
  afterEach(() => {
    clock.uninstall();
  });

  it("should memoize function result for a definite time", () => {
    const testFunction = (year, month, day) => {
      return Date.now() + Date(year, month, day);
    };

    const testMemoizedFunction = memoization.memoize(
      testFunction,
      (year, month, day) => year + month + day,
      1000
    );

    const firstResult = testMemoizedFunction(1, 11, 26);
    clock.tick(100);
    const secondResult = testMemoizedFunction(1, 11, 26);
    expect(firstResult).toBe(secondResult);
    const anotherResult = testMemoizedFunction(2, 12, 26);
    expect(anotherResult).not.toBe(firstResult);

    clock.tick(500);
    const thirdResult = testMemoizedFunction(1, 11, 26);
    expect(thirdResult).toBe(secondResult);

    clock.tick(1000);
    const forthResult = testMemoizedFunction(1, 11, 26);
    expect(forthResult).not.toBe(secondResult);
  });

  it("should use default resolver: memoize(func, timeout)", () => {
    const testFunction = (year, month, day) => {
      return Date.now() + Date(year, month, day);
    };

    const testMemoizedFunction = memoization.memoize(testFunction, 1000);

    const firstResult = testMemoizedFunction(1, 11, 26);
    clock.tick(100);
    const secondResult = testMemoizedFunction(1, 11, 26);
    expect(firstResult).toBe(secondResult);
    const anotherResult = testMemoizedFunction(2, 12, 26);
    expect(anotherResult).not.toBe(firstResult);
  });

  it("should throw error if params are not valid", () => {
    const testFunction = (year, month, day) => {
      return Date.now() + Date(year, month, day);
    };

    expect(() => memoization.memoize(testFunction)).toThrow();
    expect(() => memoization.memoize(1, (key) => key, 1000)).toThrow();
    expect(() => memoization.memoize(testFunction, "hello")).toThrow();
  });

  it("should handle undefined as cache key", () => {
    const testFunction = () => {
      return Math.random();
    };

    const testMemoizedFunction = memoization.memoize(testFunction, 1000);

    const firstResult = testMemoizedFunction();
    clock.tick(100);
    const secondResult = testMemoizedFunction();
    expect(firstResult).toBe(secondResult);

    clock.tick(1000);
    const forthResult = testMemoizedFunction();
    expect(forthResult).not.toBe(secondResult);
  });

  it("should handle null as cache key", () => {
    const testFunction = () => {
      return Math.random();
    };

    const testMemoizedFunction = memoization.memoize(
      testFunction,
      () => null,
      1000
    );

    const firstResult = testMemoizedFunction();
    clock.tick(100);
    const secondResult = testMemoizedFunction();
    expect(firstResult).toBe(secondResult);

    clock.tick(1000);
    const forthResult = testMemoizedFunction();
    expect(forthResult).not.toBe(secondResult);
  });

  it("should cache async functions result", async () => {
    clock.restore();

    const asyncRandom = () => {
      return new Promise((resolve) =>
        setTimeout(() => resolve(Math.random()), 500)
      );
    };

    const testMemoizedFunction = memoization.memoize(
      asyncRandom,
      () => null,
      2000
    );

    let startTime = Date.now();
    const firstResult = await testMemoizedFunction();
    let duration = Date.now() - startTime;
    expect(duration).toBeGreaterThanOrEqual(500);

    startTime = Date.now();
    const secondResult = await testMemoizedFunction();
    duration = Date.now() - startTime;
    expect(duration).toBeLessThan(500);
    expect(firstResult).toBe(secondResult);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    startTime = Date.now();
    const thirdResult = await testMemoizedFunction();
    duration = Date.now() - startTime;
    expect(duration).toBeGreaterThanOrEqual(500);
    expect(firstResult).not.toBe(thirdResult);
  });
});
