import React, { useCallback } from "react";
import ReactRouterPropTypes from "react-router-prop-types";
import gql from "graphql-tag";
import { useQuery, useSubscription } from "react-apollo-hooks";

import Link from "./Link";
import { LINKS_PER_PAGE } from "../constants";

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        createdAt
        url
        description
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
      count
    }
  }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
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
`;

const LinkList = ({ location, match, history }) => {
  const getQueryVariables = () => {
    const isNewPage = location.pathname.includes("new");
    const page = parseInt(match.params.page, 10);

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : null;
    const orderBy = isNewPage ? "createdAt_DESC" : null;
    return { first, skip, orderBy };
  };

  const { data, error, loading, networkStatus } = useQuery(FEED_QUERY, {
    variables: getQueryVariables()
  });
  useSubscription(NEW_LINKS_SUBSCRIPTION, {
    skip: loading || error,
    onSubscriptionData: ({ client, subscriptionData }) => {
      const data = client.readQuery({
        query: FEED_QUERY,
        variables: getQueryVariables()
      });

      data.feed.links = [...data.feed.links, subscriptionData.data.newLink];

      client.writeQuery({ query: FEED_QUERY, data });
    }
  });

  const updateCacheAfterVote = useCallback((store, createdVote, linkId) => {
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: getQueryVariables()
    });

    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createdVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  });

  const nextPage = () => {
    const page = parseInt(match.params.page, 10);
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      history.push(`/new/${nextPage}`);
    }
  };

  const previousPage = () => {
    const page = parseInt(match.params.page, 10);
    if (page > 1) {
      const previousPage = page - 1;
      history.push(`/new/${previousPage}`);
    }
  };

  if (loading || networkStatus === 4) {
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
      <div className="flex ml4 mv3 gray">
        <div className="pointer mr2" onClick={previousPage}>
          Previous
        </div>
        <div className="pointer" onClick={nextPage}>
          Next
        </div>
      </div>
    </div>
  );
};

LinkList.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired
};

export default LinkList;
