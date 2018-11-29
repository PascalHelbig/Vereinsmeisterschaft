const fetchRangliste = require('./src/fetching/fetchRangliste');
const getRegattas = require('./src/parsing/getRegattas');

exports.sourceNodes = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  const ranglisteHTML = await fetchRangliste(2018);
  const regattaList = getRegattas(ranglisteHTML);

  regattaList.map(regatta => {
    const nodeId = createNodeId(`raceoffice-regatta-${regatta.url}`);

    const nodeData = {
      ...regatta,
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: 'RaceofficeRegatta',
        content: JSON.stringify(regatta),
        contentDigest: createContentDigest(regatta),
      },
    };
    createNode(nodeData);
  });

  return;
};
