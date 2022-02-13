const unicode = {
  check: '\u2714',
  cross: '\u2716',
};

const color = {
  red: (content) => `\x1b[31m ${content}\x1b[0m`,
  green: (content) => `\x1b[32m ${content}\x1b[0m`,
};

module.exports = { unicode, color };
