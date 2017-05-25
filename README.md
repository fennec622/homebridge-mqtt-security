# homebridge-mqtt-security-system

This is a lightly modified version of "homebridge-paradox-security-system" (https://github.com/MnrGreg/homebridge-paradox-security-system). Both are Homebridge plugins to allow control of a security system via MQTT. For my purposes I'm using Home Assistant as a middle-man to bridge my security system (Honeywell Total Connect) to MQTT, and vice versa.

## Notes
- Usage of this plugin requires an MQTT server to be setup, check out Mosquitto (https://github.com/eclipse/mosquitto) if you're in need of one.
- 

## Installation

    npm install -g homebridge-mqtt-security-system

## Configuration
Remember to configure the plugin in config.json in your home directory inside the .homebridge directory. Configuration parameters:

    {
        "accessories": [
            {
            "accessory": "Homebridge-MQTT-Security",
            "name": "",
            "mqtt_username": "",
            "mqtt_password": "",
            "mqtt_server": "mqtt://XXX.XXX.XXX.XXX",
            "command_topic": "",
            "command_payload_arm
            "state_topic": "",
            "state_payload_armed_stay": "",
            "state_payload_armed_away": "",
            "state_payload_disarmed": "",
            "state_payload_triggered": ""
            }
        ]
    }

## Acknowledgement
All credit goes to @MnrGreg (https://github.com/MnrGreg), visit his page and consider donating if you're feeling generous.
