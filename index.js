'use strict';

const SimpleMQTTAdapter = require('./simple-mqtt-adapter');

module.exports = (addonManager, manifest) => {
  new SimpleMQTTAdapter(addonManager, manifest);
};
