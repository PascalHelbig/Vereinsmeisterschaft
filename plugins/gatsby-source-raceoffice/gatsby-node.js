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
  let clubObject = {};

  /**
   * Adds an club to clubObject
   *
   * @param {string} club Club short name
   * @param {string} clubCode DSV club code
   * @param {string} resultId the node id of the result
   * @param {boolean} forHelm add result for helm?
   *
   * @returns {string} the club id for GraphQL
   */
  const addClub = (club, clubCode, resultId, forHelm) => {
    const clubId = createNodeId(`raceoffice-club-${club}-${clubCode}`);

    if (!clubObject[clubId]) {
      clubObject = {
        [clubId]: {
          name: club,
          dsvCode: clubCode,
          allResults___NODE: [],
          helmResults___NODE: [],
          crewResults___NODE: [],
        },
        ...clubObject,
      };
    }

    if (!clubObject[clubId].allResults___NODE.includes(resultId)) {
      clubObject[clubId].allResults___NODE.push(resultId);
    }
    if (forHelm) {
      clubObject[clubId].helmResults___NODE.push(resultId);
    } else {
      clubObject[clubId].crewResults___NODE.push(resultId);
    }

    return clubId;
  };

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
        const resultId = createNodeId(
          `raceoffice-regatta-${regatta.url}-result-${index}`,
        );

        const helmClubId = addClub(
          result.helmClub,
          result.helmClubCode,
          resultId,
          true,
        );
        const crewClubId = addClub(
          result.crewClub,
          result.crewClubCode,
          resultId,
          false,
        );

        const resultObject = {
          ...result,
          helmClub___NODE: helmClubId,
          crewClub___NODE: crewClubId,
          regatta___NODE: regattaId,
        };

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

  return Promise.all(regattaPromises).then(() => {
    Object.keys(clubObject).forEach(clubId => {
      const club = clubObject[clubId];
      const clubNodeData = {
        ...club,
        id: clubId,
        parent: null,
        children: [],
        internal: {
          type: 'RaceofficeClub',
          content: JSON.stringify(club),
          contentDigest: createContentDigest(club),
        },
      };
      createNode(clubNodeData);
    });
  });
};
