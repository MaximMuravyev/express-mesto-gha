const validator = require('validator');

module.exports.urlCorrect = (url) => {
  if (validator.isURL(url)) {
    return url;
  }
  throw new Error('Неправильный URL');
};
