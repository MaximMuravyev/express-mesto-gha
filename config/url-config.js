const validator = require('validator');

module.exports.urlCorrect = (link) => {
  if (validator.isURL(link)) {
    return link;
  }
  throw new Error('Неправильный URL');
};
