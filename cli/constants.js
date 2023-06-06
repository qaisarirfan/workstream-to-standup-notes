const REGEX_FOR_TASK = /(MOPD|EMPD)-[0-9]+/gm;
const REGEX_FOR_TAG = /\[(.*?)] - /gm;
const REGEX_FOR_TIME = /\(([0-9]*[.])?[0-9]+\)/gm;

module.exports = {
  REGEX_FOR_TASK,
  REGEX_FOR_TAG,
  REGEX_FOR_TIME,
};
