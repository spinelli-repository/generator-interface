function generateRandomLong() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  module.exports = {
    generateRandomLong: generateRandomLong
  };
  