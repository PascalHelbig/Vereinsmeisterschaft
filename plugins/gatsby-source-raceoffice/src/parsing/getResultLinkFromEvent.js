const cheerio = require('cheerio');

module.exports = html => {
  const $ = cheerio.load(html);
  const link = $('a:contains("Endergebnisse in Rangliste: Cadet")');
  const href = link.attr('href').trim();
  return `http://www.raceoffice.org${href}`;
};
