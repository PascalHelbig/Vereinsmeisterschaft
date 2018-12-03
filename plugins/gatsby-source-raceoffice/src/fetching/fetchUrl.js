const request = require('request-promise');

module.exports = async url => {
  console.log('fetch', url);
  return request(url, { encoding: 'latin1' });
};
