const fetchRangliste = require('./src/fetching/fetchRangliste');
const fetchUrl = require('./src/fetching/fetchUrl');
const getRegattas = require('./src/parsing/getRegattas');
const getResultLinkFromEvent = require('./src/parsing/getResultLinkFromEvent');
const getResults = require('./src/parsing/getResults');

exports.sourceNodes = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  const ranglisteHTML = await fetchRangliste(2018);
  const regattaList = getRegattas(ranglisteHTML);

  const regattaPromises = regattaList.map(async regatta => {
    const regattaId = createNodeId(`raceoffice-regatta-${regatta.url}`);
    let resultIds = null;

    if (regatta.hasResult) {
      const eventHTML = await fetchUrl(regatta.url);
      const resultLink = getResultLinkFromEvent(eventHTML);
      const resultHTML = await fetchUrl(resultLink);
      const results = getResults(resultHTML);

      resultIds = results.map((result, index) => {
        const resultObject = {
          ...result,
          regatta___NODE: regattaId,
        };
        const resultId = createNodeId(
          `raceoffice-regatta-${regatta.url}-result-${index}`,
        );
        const resultNode = {
          ...resultObject,
          id: resultId,
          parent: null,
          children: [],
          internal: {
            type: 'RaceofficeResult',
            content: JSON.stringify(resultObject),
            contentDigest: createContentDigest(resultObject),
          },
        };

        createNode(resultNode);

        return resultId;
      });
    }

    const regattaNodeData = {
      ...regatta,
      results___NODE: resultIds,
      id: regattaId,
      parent: null,
      children: [],
      internal: {
        type: 'RaceofficeRegatta',
        content: JSON.stringify(regatta),
        contentDigest: createContentDigest(regatta),
      },
    };
    createNode(regattaNodeData);
  });

  return Promise.all(regattaPromises);
};
