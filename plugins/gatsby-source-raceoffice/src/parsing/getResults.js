const cheerio = require('cheerio');

module.exports = html => {
  const $ = cheerio.load(html);
  const results = $('table#tabledynraces tr.hovercell');
  return results
    .map((index, result) => {
      const columns = $(result).find('td');

      let place = columns.first().text();
      place = parseInt(place);

      let helm = $(columns.get(1))
        .html()
        .split('<br>')[0]
        .trim();
      let crew = $(columns.get(1))
        .html()
        .split('<br>')[1]
        .trim();

      helm = cheerio
        .load(`<div>${helm}</div>`)('div')
        .text();
      crew = cheerio
        .load(`<div>${crew}</div>`)('div')
        .text();

      const clubsHTML = $(columns.get(2)).html();
      const helmClubLink = cheerio.load(clubsHTML.split('<br>')[0]);
      const crewClubLink = cheerio.load(clubsHTML.split('<br>')[1]);

      const [helmClub, helmClubCode] = helmClubLink
        .text()
        .trim()
        .split(' / ');
      const [crewClub, crewClubCode] = crewClubLink
        .text()
        .trim()
        .split(' / ');

      const points = parseFloat($(columns.get(3)).text(), 10) || 0;

      return {
        place,
        helm,
        crew,
        helmClub: helmClub || null,
        helmClubCode: helmClubCode || null,
        crewClub: crewClub || null,
        crewClubCode: crewClubCode || null,
        points,
      };
    })
    .toArray()
    .filter(result => result.helm !== 'N.N.');
};
