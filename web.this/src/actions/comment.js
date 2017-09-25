import { COMMENT } from './const';

function action(parameter) {
  return { type: COMMENT, parameter };
}

module.exports = action;
