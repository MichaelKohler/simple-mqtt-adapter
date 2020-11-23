'use strict';

const { Database } = require('gateway-addon');

module.exports = {
  load,
};

async function load(manifest) {
  const database = new Database(manifest.name);
  await database.open()
  const config = await database.loadConfig();
  return config;
}
