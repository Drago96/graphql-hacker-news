import React, { useCallback } from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";

import Link from "./Link";

export const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const LinkList = () => {
  const { data, error, loading } = useQuery(FEED_QUERY);

  const updateCacheAfterVote = useCallback((store, createdVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY });

    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createdVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  });

  if (loading) {
    return <div>Fetching</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const linksToRender = data.feed.links;

  return (
    <div>
      {linksToRender.map((link, index) => (
        <Link
          key={link.id}
          link={link}
          index={index}
          updateStoreAfterVote={updateCacheAfterVote}
        />
      ))}
    </div>
  );
};

export default LinkList;
