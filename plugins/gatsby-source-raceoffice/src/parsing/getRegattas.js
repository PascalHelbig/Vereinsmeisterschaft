const cheerio = require('cheerio');

module.exports = html => {
  const $ = cheerio.load(html);
  const regattaTable = $('table#tabledynraces').first();
  const rows = regattaTable.find('tr.hovercell');

  return rows
    .map((index, row) => {
      const columns = $(row).find('td');

      /** first column */
      const firstColumn = $(columns.first());
      const [from, to] = firstColumn
        .html()
        .trim()
        .split('<br>')
        .map(date => {
          const [day, month, year] = date.trim().split('.');
          return `${year}-${month}-${day}`;
        });

      /** second column */
      const secondColumn = $(columns.get(1));
      const link = secondColumn.find('a').first();
      const url = link.attr('href');
      const name = link.text().trim();

      /** third column */
      const thirdColumn = $(columns.get(2));
      const resultImg = thirdColumn.find('img:nth-child(2)');
      const hasResult =
        resultImg.attr('src') ===
        'http://www.raceoffice.org/gifs/files_yes.gif';

      /** fifth column */
      const fifthColumn = $(columns.get(4));
      const fifthColumnText = fifthColumn.text();
      let regexResult = fifthColumnText.match(/(\d+.\d+)\/m=(\d+)/);
      let rlf, m;
      if (regexResult) {
        [_, rlf, m] = regexResult;
        rlf = parseFloat(rlf);
        m = parseInt(m);
      }

      /** sixth column */
      const sixthColumn = $(columns.get(5));
      const races = parseInt(sixthColumn.text()) || null;

      /** seventh column */
      const seventhColumn = $(columns.get(6));
      const competitors = parseInt(seventhColumn.text()) || null;

      return {
        from,
        to,
        url,
        name,
        hasResult,
        rlf,
        m,
        races,
        competitors,
      };
    })
    .toArray();
};
