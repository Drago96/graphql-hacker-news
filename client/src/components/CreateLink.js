import React, { useState } from "react";
import ReactRouterPropTypes from "react-router-prop-types";
import gql from "graphql-tag";

import { useMutation } from "../hooks/useMutation";
import { FEED_QUERY } from "./LinkList";
import { LINKS_PER_PAGE } from "../constants";

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      url
      description
    }
  }
`;

const CreateLink = ({ history }) => {
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const postMutation = useMutation(POST_MUTATION, {
    variables: { description, url },
    onCompleted: () => history.push("/"),
    refetchQueries: [
      {
        query: FEED_QUERY,
        variables: { first: LINKS_PER_PAGE, skip: 0, orderBy: "createdAt_DESC" }
      }
    ]
  });

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          type="text"
          placeholder="A description for the link"
        />
        <input
          className="mb2"
          value={url}
          onChange={e => setUrl(e.target.value)}
          type="text"
          placeholder="The URL for the link"
        />
      </div>
      <button onClick={postMutation}>Submit</button>
    </div>
  );
};

CreateLink.propTypes = {
  history: ReactRouterPropTypes.history.isRequired
};

export default CreateLink;
