module.exports = {
  SECRET_KEY: "superConfidentialToken",
  POST_LIMIT: 2,
  MONGODB_URI:
    "mongodb+srv://jiteshs:jiteshs7@cluster0.5h1dazv.mongodb.net/chat?retryWrites=true&w=majority",
  EMAIL_REGEX:
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/,
  USER_STATUS: {
    ACTIVE: "Active",
    InACTIVE: "InActive",
  },
};
