/**
 * Creates a function that memoizes the result of func. If resolver is provided,
 * it determines the cache key for storing the result based on the arguments provided to the memorized function.
 * By default, the first argument provided to the memorized function is used as the map cache key. The memorized values
 * timeout after the timeout exceeds. The timeout is in defined in milliseconds.
 *
 * Example:
 * function addToTime(year, month, day) {
 *  return Date.now() + Date(year, month, day);
 * }
 *
 * const memoized = memoization.memoize(addToTime, (year, month, day) => year + month + day, 5000)
 *
 * // call the provided function cache the result and return the value
 * const result = memoized(1, 11, 26); // result = 1534252012350
 *
 * // because there was no timeout this call should return the memorized value from the first call
 * const secondResult = memoized(1, 11, 26); // secondResult = 1534252012350
 *
 * // after 5000 ms the value is not valid anymore and the original function should be called again
 * const thirdResult = memoized(1, 11, 26); // thirdResult = 1534252159271
 *
 * @param func      the function for which the return values should be cached
 * @param resolver  if provided gets called for each function call with the exact same set of parameters as the
 *                  original function, the resolver function should provide the memoization key.
 * @param timeout   timeout for cached values in milliseconds
 */
function memoize(func, resolver, timeout) {
  // Considering memoize(func, timout) { }
  if (typeof resolver === "number") {
    timeout = resolver;
    resolver = (...args) => args[0];
  }

  // Check arguments types to be valid
  if (
    typeof func !== "function" ||
    typeof resolver !== "function" ||
    typeof timeout !== "number"
  ) {
    throw new Error("Argument Error: memoize(function, [function,] number)");
  }

  const cache = {};
  return (...args) => {
    const key = resolver(...args);

    if (!cache[key] || Date.now() > cache[key].expiresAt) {
      cache[key] = {
        expiresAt: Date.now() + timeout,
        value: func(...args),
      };
    }

    return cache[key].value;
  };
}

module.exports = {
  memoize,
};