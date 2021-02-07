'use strict';

const { Database } = require('gateway-addon');

module.exports = {
  load,
};

async function load(manifestId) {
  const database = new Database(manifestId);
  await database.open()
  const config = await database.loadConfig();
  return config;
}
