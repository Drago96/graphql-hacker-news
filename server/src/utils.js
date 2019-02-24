const jwt = require("jsonwebtoken");

const APP_SECRET = "GraphQL-is-aw3some";

const getUserId = context => {
  const authorizationToken = context.request.get("Authorization");
  if (authorizationToken) {
    const token = authorizationToken.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);

    return userId;
  }

  throw new Error("Not authenticated");
};

module.exports = {
  APP_SECRET,
  getUserId
};
