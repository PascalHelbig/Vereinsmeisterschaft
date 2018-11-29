const fetchRanglisteByDates = require('./fetchRanglisteByDates');

module.exports = year => {
  const startDate = `01-01-${year}`;
  const endDate = `31-12-${year}`;
  return fetchRanglisteByDates(startDate, endDate);
};
