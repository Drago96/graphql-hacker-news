import React, { useState } from "react";
import gql from "graphql-tag";
import { useApolloClient } from "react-apollo-hooks";

import Link from "./Link";

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String) {
    feed(filter: $filter) {
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

const Search = () => {
  const [filter, setFilter] = useState("");
  const [links, setLinks] = useState([]);
  const client = useApolloClient();

  return (
    <div>
      <div>
        Search <input type="text" onChange={e => setFilter(e.target.value)} />
        <button
          onClick={async () => {
            const result = await client.query({
              query: FEED_SEARCH_QUERY,
              variables: { filter }
            });

            const links = result.data.feed.links;
            setLinks(links);
          }}
        >
          OK
        </button>
        {links.map((link, index) => (
          <Link
            key={link.id}
            link={link}
            index={index}
            showUpvote={false}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
