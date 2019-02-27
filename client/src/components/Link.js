import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";

import ILink from "../interfaces/Link";
import { AUTH_TOKEN } from "../constants";
import { timeDifferenceForDate } from "../utils";
import { useMutation } from "../hooks/useMutation";

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const Link = ({ link, index, updateStoreAfterVote, showUpvote }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const voteMutation = useMutation(VOTE_MUTATION, {
    variables: { linkId: link.id },
    update: (store, { data: { vote } }) =>
      updateStoreAfterVote(store, vote, link.id)
  });

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && showUpvote && (
          <div className="ml1 gray f11" onClick={voteMutation}>
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        <div className="f6 lh-copy gray">
          {link.votes.length} votes | by{" "}
          {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
};

Link.propTypes = {
  link: ILink,
  index: PropTypes.number.isRequired,
  updateStoreAfterVote: PropTypes.func,
  showUpvote: PropTypes.bool
};

Link.defaultProps = {
  showUpvote: true
};

export default Link;
