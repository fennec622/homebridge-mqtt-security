var Service, Characteristic;
var mqtt = require("mqtt");

module.exports = function(homebridge){
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-mqtt-security", "Homebridge-MQTT-Security", MQTTSecuritySystemAccessory);
}

function MQTTSecuritySystemAccessory(log, config) {
	this.log = log;
	// Load data from config.json, set to default values if necessary
	if ((!(config["name"])) || config["name"] == '') {
		this.name = 'MQTT Security System';
	} else {
		this.name = config["name"];
	}
	this.mqtt_broker = "mqtt://".concat(config["mqtt_broker_ip"]);
	if ((!(config["mqtt_client_id"])) || config["mqtt_client_id"] == '') {
		this.mqtt_client_id = 'homebridge-mqtt-security';
	} else {
		this.mqtt_client_id = config["mqtt_client_id"];
	}
	this.command_topic = config["command_topic"];
	if ((!(config["command_payload_home"])) || config["command_payload_home"] == '') {
		this.command_payload_home = 'home';
	} else {
		this.command_payload_home = config["command_payload_home"];
	}
	if ((!(config["command_payload_away"])) || config["command_payload_away"] == '') {
		this.command_payload_away = 'away';
	} else {
		this.command_payload_away = config["command_payload_away"];
	}
	if ((!(config["command_payload_night"])) || config["command_payload_night"] == '') {
		this.command_payload_night = 'night';
	} else {
		this.command_payload_night = config["command_payload_night"];
	}
	if ((!(config["command_payload_off"])) || config["command_payload_off"] == '') {
		this.command_payload_off = 'off';
	} else {
		this.command_payload_off = config["command_payload_off"];
	}
	this.state_topic = config["state_topic"];
	if ((!(config["state_payload_home"])) || config["state_payload_home"] == '') {
		this.state_payload_home = 'home';
	} else {
		this.state_payload_home = config["state_payload_home"];
	}
	if ((!(config["state_payload_away"])) || config["state_payload_away"] == '') {
		this.state_payload_away = 'away';
	} else {
		this.state_payload_away = config["state_payload_away"];
	}
	if ((!(config["state_payload_night"])) || config["state_payload_night"] == '') {
		this.state_payload_night = 'night';
	} else {
		this.state_payload_night = config["state_payload_night"];
	}
	if ((!(config["state_payload_off"])) || config["state_payload_off"] == '') {
		this.state_payload_off = 'off';
	} else {
		this.state_payload_off = config["state_payload_off"];
	}
	if ((!(config["state_payload_triggered"])) || config["state_payload_triggered"] == '') {
		this.state_payload_triggered = 'triggered';
	} else {
		this.state_payload_triggered = config["state_payload_triggered"];
	}
	if ((!(config["manufacturer"])) || config["manufacturer"] == '') {
		this.manufacturer = '@schmittx';
	} else {
		this.manufacturer = config["manufacturer"];
	}
	if ((!(config["serial_number"])) || config["serial_number"] == '') {
		this.serial_number = '0.1.4';
	} else {
		this.serial_number = config["serial_number"];
	}
	if ((!(config["model"])) || config["model"] == '') {
		this.model = 'homebridge-mqtt-security';
	} else {
		this.model = config["model"];
	}

	// MQTT broker connection settings
	this.options = {
	    keepalive: 10,
    	clientId: this.mqtt_client_id,
		protocolId: 'MQTT',
		protocolVersion: 4,
		clean: true,
		reconnectPeriod: 1000,
		connectTimeout: 30 * 1000,
		will: {
			topic: 'WillMsg',
			payload: 'Connection closed abnormally!',
			qos: 0,
			retain: false
		},
		username: config["mqtt_username"],
		password: config["mqtt_password"],
		rejectUnauthorized: false
	};

	// Connect to MQTT broker
	this.client = mqtt.connect(this.mqtt_broker, this.options);
	var that = this;
	this.client.on('error', function () {
		that.log('Error event on MQTT');
	});

	// Set initial state to disarmed
	console.log("Setting initial HomeKit state to disarmed");
	that.readstate = Characteristic.SecuritySystemCurrentState.DISARMED;


	self = this;
	this.client.on('message', function (topic, message) {
		var status = message.toString();
		console.log("MQTT state message received:", status);
		switch (status) {
			case self.state_payload_home:
				// STAY_ARM = 0
				status = Characteristic.SecuritySystemCurrentState.STAY_ARM;
				break;
			case self.state_payload_away:
				// AWAY_ARM = 1
				status = Characteristic.SecuritySystemCurrentState.AWAY_ARM;
				break;
			case self.state_payload_night:
				// NIGHT_ARM = 2
				status = Characteristic.SecuritySystemCurrentState.NIGHT_ARM;
				break;
			case self.state_payload_off:
				// DISARMED = 3
				status = Characteristic.SecuritySystemCurrentState.DISARMED;
				break;
			case self.state_payload_triggered:
				// ALARM_TRIGGERED = 4
				status = Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
				break;
			default:
				status = null;
				break;
		};
		if (status !== null){
			self.readstate = status;
			console.log("HomeKit received state=",self.readstate);
			self.securityService.setCharacteristic(Characteristic.SecuritySystemCurrentState, self.readstate);
		};
	});
	this.client.subscribe(this.state_topic);
}

MQTTSecuritySystemAccessory.prototype = {

	setTargetState: function(state, callback) {
		this.log("Setting state to %s", state);
		var self = this;
		switch (state) {
			case Characteristic.SecuritySystemTargetState.STAY_ARM:
				mqttstate = this.command_payload_home;
				break;
			case Characteristic.SecuritySystemTargetState.AWAY_ARM:
				mqttstate = this.command_payload_away;
				break;
			case Characteristic.SecuritySystemTargetState.NIGHT_ARM:
				mqttstate = this.command_payload_night;
				break;
			case Characteristic.SecuritySystemTargetState.DISARM:
				mqttstate = this.command_payload_off;
				break;
		};
		// MQTT Publish state   
		this.client.publish(this.command_topic, mqttstate);
		self.securityService.setCharacteristic(Characteristic.SecuritySystemCurrentState, state);
		callback(null, state);
	},

	getState: function(callback) {
		var self = this;
		if (this.readstate == "0" || this.readstate == "1" || this.readstate == "2" || this.readstate == "3" || this.readstate == "4"){
			self.log("Setting state to:", this.readstate);
			callback(null, this.readstate);
		}
		else{
			self.log("Not a valid HomeKit State:", this.readstate);
			callback("error");
		};
	},

	getCurrentState: function(callback) {
		this.log("Getting current state");
		this.getState(callback);
	},

	getTargetState: function(callback) {
		this.log("Getting target state");
		this.getState(callback);
	},

	identify: function(callback) {
		this.log("Identify requested!");
		callback(); // success
	},

	getServices: function() {
		// Set accessory information
		const informationService = new Service.AccessoryInformation();
		informationService.setCharacteristic(Characteristic.Manufacturer, this.manufacturer);
		informationService.setCharacteristic(Characteristic.Model, this.model);
		informationService.setCharacteristic(Characteristic.SerialNumber, this.serial_number);

		this.securityService = new Service.SecuritySystem(this.name);

		this.securityService
			.getCharacteristic(Characteristic.SecuritySystemCurrentState)
			.on('get', this.getCurrentState.bind(this));

		this.securityService
			.getCharacteristic(Characteristic.SecuritySystemTargetState)
			.on('get', this.getTargetState.bind(this))
			.on('set', this.setTargetState.bind(this));

		return [informationService, this.securityService];
	}
};
