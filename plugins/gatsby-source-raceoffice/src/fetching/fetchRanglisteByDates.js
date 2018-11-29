const fetchUrl = require('./fetchUrl');

module.exports = (startDate, endDate) => {
  const ranglisteURL = `http://www.raceoffice.org/rangliste/?rlid=11037882664f3f9e3930d6b&s_von=${startDate}&s_bis=${endDate}&s_search=&ord=von&orddir=0&tab=events`;
  return fetchUrl(ranglisteURL);
};
