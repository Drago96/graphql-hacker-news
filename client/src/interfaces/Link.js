import PropTypes from "prop-types";

import Vote from "./Vote";
import Author from "./Author";

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  votes: PropTypes.arrayOf(Vote),
  postedBy: Author
});
