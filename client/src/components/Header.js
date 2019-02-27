import React from "react";
import ReactRouterPropTypes from "react-router-prop-types";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import { AUTH_TOKEN } from "../constants";

const Header = ({ history }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <div className="flex pa1 justify-between nowrap orange">
      <div className="flex flex-fixed black">
        <div className="fw7 mr1">Hacker News</div>
        <Link to="/" className="ml1 no-underline black">
          new
        </Link>
        <div className="ml1">|</div>
        <Link to="/search" className="ml1 no-underline black">
          search
        </Link>
        <div className="ml1">|</div>
        {authToken && (
          <Link to="/create" className="ml1 no-underline black">
            submit
          </Link>
        )}
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <div
            className="ml1 pointer black"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              history.push(`/`);
            }}
          >
            logout
          </div>
        ) : (
          <Link to="/authentication" className="ml1 no-underline black">
            login
          </Link>
        )}
      </div>
    </div>
  );
};

Header.propTypes = {
  history: ReactRouterPropTypes.history.isRequired
};

export default withRouter(Header);
