import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

const query = graphql`
  {
    allRaceofficeRegatta(sort: { fields: from }) {
      totalCount
      edges {
        node {
          id
          name
          competitors
        }
      }
    }
  }
`;

export default () => (
  <ul>
    <StaticQuery
      query={query}
      render={data =>
        data.allRaceofficeRegatta.edges.map(({ node }) => (
          <li key={node.id}>
            {node.name} ({node.competitors} Teilnehmer)
          </li>
        ))
      }
    />
  </ul>
);
