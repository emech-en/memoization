# Memoization

A general introduction into memoization: https://en.wikipedia.org/wiki/Memoization

**Memoization** is a simple npm package to cache the result of the provided function for a limited amount of time.

The purpose of this project is to demonstrate the followings:

- Development of a simple npm package with javascript.
- Automatic Unit Tests and achieving 100% coverage.
- Using CI/CD tools:
  - [Github Actions](https://github.com/features/actions) to automatically run tests and publish the npm package.
- Using semantic-relase:
  - [Semantic Release](https://github.com/semantic-release/semantic-release) to calculate new version number by processing commit messages.
  - Publish the `next` branch to the `next` channel on npm and publish the `master` branch to the main channel.

## Instalation

```
yarn add @emech/memoization
```

## Usage

```
const memoize = require("@emech/memoization").memoize;

const random = (max) => Math.random() * max;
const memoizedRandom = memoize(random, (max) => max, 1000);

const randomNumber = memoizedRandom(2);
const randomNumber2 = memoizedRandom(2);

assert(randomNumber === randomNumber2);
```


## Contribution

```bash
# Clone
$ git clone git@github.com:emech-en/memoization.git

# Run test 
$ yarn test

# Report coverage
$ yarn test:coverage
```

## Stay in touch

- Author: [Emech En](https://github.com/emech-en) < [mh.niroomand91@gmail.com](mailto://mh.niroomand91@gmail.com) >
