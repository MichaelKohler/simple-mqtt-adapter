# Simple MQTT Adapter

This is a WebThingsIO adapter to connect MQTT topics and to corresponding actions/events that can be be configured in the adapter. It then provides a virtual device with these actions and events.

* Actions: publish a given messages to a specific topic
* Events: subscribe to given topic and use them in rules

Right now there is no property support, but you might want to have a look at https://github.com/tim-hellhake/homie-adapter.

## Possible Improvements

- [ ] Support arbitrary properties
- [ ] Currently only input from the config is supported. There might be a config value to create inputs in the future, and then those get attached appropriately in case an action needs dynamic input
