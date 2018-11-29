const request = require('request-promise');

module.exports = async url => request(url, { encoding: 'latin1' });
