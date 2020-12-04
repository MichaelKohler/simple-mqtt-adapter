'use strict';

const {
  Adapter,
  Device,
  Event,
} = require('gateway-addon');

const MQTT = require('async-mqtt');

const config = require('./config');

const DEVICE_ID = 'simple-mqtt-virtual';
const DEVICE_NAME = 'MQTT Broker';

class MQTTVirtualDevice extends Device {
  constructor(adapter, conf) {
    super(adapter, DEVICE_ID);
    this.title = DEVICE_NAME;
    this.description = DEVICE_NAME;
    this.mqttClient = adapter.mqttClient;
    this.conf = conf;

    this.createActions(this.conf.actions);
    this.createEvents(this.conf.events);

    this.mqttClient.on('message', (topic, message) => {
      const event = this.conf.events.find((eventConf) => eventConf.topic === topic);
      if (event) {
        this.eventNotify(new Event(this, event.name));
      }
    });
  }

  async performAction(action) {
    action.start();
    const actionConfig = this.conf.actions.find((actionConf) => actionConf.name === action.name);
    if (this.mqttClient.connected && actionConfig) {
      console.log('Performing action...', actionConfig);
      await this.mqttClient.publish(actionConfig.topic, actionConfig.payload);
    }
    action.finish();
  }

  createActions(actions = []) {
    for (const action of actions) {
      this.addAction(action.name, {
        title: action.title,
      });
    }
  }

  createEvents(events = []) {
    for (const event of events) {
      this.addEvent(event.name, {
        title: event.title,
      });

      try {
        this.mqttClient.subscribe(event.topic);
      } catch (error) {
        console.error(`Failed to subscribe to ${event.topic}!`);
      }
    }
  }
}

class SimpleMQTTAdapter extends Adapter {
  constructor(addonManager, manifest) {
    super(addonManager, 'SimpleMQTTAdapter', manifest.name);
    addonManager.addAdapter(this);

    this.create(manifest);
  }

  async create(manifest) {
    const conf = await config.load(manifest);
    try {
      await this.connectMQTT(conf.mqttHost, conf.mqttUsername, conf.mqttPassword);
      await this.createVirtualDevice(conf);
    } catch (error) {
      console.error(error);
    }
  }

  async connectMQTT(host, username, password) {
    if (!host) {
      throw new Error('Please set the MQTT Host in the addon config!');
    }

    let options = {};
    if (username && password) {
      options.username = username;
      options.password = password;
    }

    console.log('Connecting to MQTT Broker..', host);
    this.mqttClient = await MQTT.connectAsync(host, options);
    console.log('Connected to MQTT Broker!');
  }

  async createVirtualDevice(conf) {
    console.log('Creating virtual device..');
    this._device = new MQTTVirtualDevice(this, conf);
    this.handleDeviceAdded(this._device);
  }

  startPairing() {
    if (this._device && !this.devices.hasOwnProperty(this._device.id)) {
      this.handleDeviceAdded(this._device);
    }
  }
}

module.exports = SimpleMQTTAdapter;
