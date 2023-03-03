const { REGEX_FOR_TAG, REGEX_FOR_TASK, REGEX_FOR_TIME } = require('./constants');

const parseDescription = (description) => description
  .replace(REGEX_FOR_TAG, '')
  .replace(REGEX_FOR_TIME, '')
  .split(/\n/gm)
  .map((val) => val.trim());

const getTasks = (description) => {
  const tasks = [];
  let x;
  // eslint-disable-next-line no-cond-assign
  while ((x = REGEX_FOR_TASK.exec(description))) {
    tasks.push(x[0]);
  }
  return tasks;
};

module.exports = {
  parseDescription,
  getTasks,
};
