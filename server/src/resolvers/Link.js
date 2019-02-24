const postedBy = (parent, args, context, info) =>
  context.prisma.link({ id: parent.id }).postedBy();

const votes = (parent, args, context, info) =>
  context.prisma.link({ id: parent.id }).votes;

module.exports = {
  postedBy,
  votes
};
