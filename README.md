# homebridge-mqtt-security

This is a lightly modified version of "[homebridge-paradox-security-system](https://github.com/MnrGreg/homebridge-paradox-security-system)". Both are Homebridge plugins to allow control of a security system via MQTT. For my purposes I'm using Home Assistant as a middle-man to bridge my security system (Honeywell Total Connect) to MQTT, and vice versa.

## Notes
- Usage of this plugin requires a MQTT broker to be setup, check out [Mosquitto](https://github.com/eclipse/mosquitto) if you're in need of one.
- "command_topic" and associated payload is what Homebridge will send to the MQTT broker.
- "state_topic" and associated payload is what Homebridge will receive from the MQTT broker.

## Installation

    npm install -g homebridge-mqtt-security

## Configuration
Configure the plugin as shown below within config.json (typically located in the "~/.homebridge" directory).

    {
        "accessories": [
            {
            "accessory": "Homebridge-MQTT-Security",
            "name": "",
            "manufacturer": "",
            "serial_number": "",
            "model": "",
            "mqtt_username": "",
            "mqtt_password": "",
            "mqtt_broker_ip": "",
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

Parameter | Required | Modifiable | Default (if not specified in config.json)
:--- | :---: | :---: | :---
accessory | yes | no | `Homebridge-MQTT-Security`
name | no | yes | `MQTT Security System`
manufacturer | no | yes | `@schmittx`
serial_number | no | yes | `0.1.4`
model | no | yes | `homebridge-mqtt-security`
mqtt_username | yes | yes |
mqtt_password | yes | yes |
mqtt_broker_ip | yes | yes |
mqtt_client_id | no | yes | `homebridge-mqtt-security`
command_topic | yes | yes |
command_payload_home | no | yes | `home`
command_payload_away | no | yes | `away`
command_payload_night | no | yes | `night`
command_payload_off | no | yes | `off`
state_topic | yes | yes |
state_payload_home | no | yes | `home`
state_payload_away | no | yes | `away`
state_payload_night | no | yes | `night`
state_payload_off | no | yes | `off`
state_payload_triggered | no | yes | `triggered`

## Acknowledgement
The real credit goes to [@MnrGreg](https://github.com/MnrGreg), visit his page and consider donating if you're feeling generous.
