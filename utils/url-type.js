const validator = require('validator');

module.exports.urlValid = (url) => {
  if (validator.isURL(url)) {
    return url;
  }
  throw new Error('Неправильный URL');
};
