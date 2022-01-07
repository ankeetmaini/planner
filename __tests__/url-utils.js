const { stringify } = require("jsurl2");

const PUBLIC_URL = "http://localhost:3000";

function getUrlForData(data) {
  const stringified = stringify(data);

  return `${PUBLIC_URL}/?${stringified}`;
}

function getUrlForOgImage(data) {
  const stringified = stringify(data);

  return `${PUBLIC_URL}/og:image/?${stringified}`;
}

module.exports = {
  getUrlForData,
  getUrlForOgImage,
};
