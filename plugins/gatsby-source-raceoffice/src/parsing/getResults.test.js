const fs = require('fs');
const path = require('path');
const getResults = require('./getResults');

it('matches snapshot', () => {
  const fileName = path.join(__dirname, '/__mocks__/results.html');
  const html = fs.readFileSync(fileName, 'utf-8');
  const results = getResults(html);
  expect(results).toMatchSnapshot();
});
