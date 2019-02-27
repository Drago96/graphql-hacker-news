import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import LinkList from "./LinkList";
import CreateLink from "./CreateLink";
import Header from "./Header";
import Authentication from "./Authentication";
import Search from "./Search";
import { AUTH_TOKEN } from "../constants";

const App = () => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/new/1" />} />
          <Route exact path="/top" component={LinkList} />
          <Route exact path="/new/:page" component={LinkList} />
          {authToken && <Route exact path="/create" component={CreateLink} />}
          <Route exact path="/search" component={Search} />
          {!authToken && (
            <Route exact path="/authentication" component={Authentication} />
          )}
        </Switch>
      </div>
    </div>
  );
};

export default App;
