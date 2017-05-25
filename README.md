# homebridge-mqtt-security-system

This is a lightly modified version of "homebridge-paradox-security-system" (https://github.com/MnrGreg/homebridge-paradox-security-system). Both are Homebridge plugins to allow control of a security system via MQTT. For my purposes I'm using Home Assistant as a middle-man to bridge my security system (Honeywell Total Connect) to MQTT, and vice versa.

## Notes
- Usage of this plugin requires an MQTT broker to be setup, check out Mosquitto (https://github.com/eclipse/mosquitto) if you're in need of one.
- "command_topic" and associated payload is what Homebridge will send to your MQTT broker.
- "state_topic" and associated payload is what Homebridge will receive from your MQTT broker.

## Installation

    npm install -g homebridge-mqtt-security-system

## Configuration
Configure the plugin as shown below within config.json (typically located in the ".homebridge" directory).

    {
        "accessories": [
            {
            "accessory": "Homebridge-MQTT-Security",
            "name": "",
            "mqtt_username": "",
            "mqtt_password": "",
            "mqtt_broker": "mqtt://XXX.XXX.XXX.XXX",
            "mqtt_client_id": "",
            "command_topic": "",
            "command_payload_home": "",
            "command_payload_away": "",
            "command_payload_night": "",
            "command_payload_off": "",
            "state_topic": "",
            "state_payload_home": "",
            "state_payload_away": "",
            "state_payload_night": "",
            "state_payload_off": "",
            "state_payload_triggered": ""
            }
        ]
    }

## Acknowledgement
All credit goes to @MnrGreg (https://github.com/MnrGreg), visit his page and consider donating if you're feeling generous.
