var Service, Characteristic;
var mqtt = require("mqtt");

module.exports = function(homebridge){
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-mqtt-security", "Homebridge-MQTT-Security", ParadoxSecuritySystemAccessory);
}

function ParadoxSecuritySystemAccessory(log, config) {
    this.log = log;
    this.name = config["name"];
    this.mqtt_broker = config["mqtt_broker"];
    this.mqtt_client_id = config["mqtt_client_id"];
    this.command_topic = config["command_topic"];
    //this.command_payload_home = config["command_payload_home"];
    //this.command_payload_away = config["command_payload_away"];
    //this.command_payload_night = config["command_payload_night"];
    //this.command_payload_off = config["command_payload_off"];
    this.state_topic = config["state_topic"];
    this.state_payload_home = config["state_payload_home"];
    this.state_payload_away = config["state_payload_away"];
    this.state_payload_night = config["state_payload_night"];
    this.state_payload_off = config["state_payload_off"];
    this.state_payload_triggered = config["state_payload_triggerd"];

	// connect to MQTT broker connection settings
	//this.mqtt_client_id = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
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
			payload: 'Connection closed abnormally..!',
			qos: 0,
			retain: false
		},
	    username: config["mqtt_username"],
	    password: config["mqtt_password"],
    	rejectUnauthorized: false
	};

	// connect to MQTT broker
	this.client = mqtt.connect(this.mqtt_broker, this.options);
	var that = this;
	this.client.on('error', function () {
		that.log('Error event on MQTT');
	});

    // Set initial Alarm State to disarmed
    console.log("Setting initial HomeKit state to DISARMED");
    that.readstate = Characteristic.SecuritySystemCurrentState.DISARMED;


   self = this;
    this.client.on('message', function (topic, message) {
        var status = message.toString();
        console.log("mqtt Alarm State message received:", status);
        switch (status) {
            case self.state_payload_home:
                status = Characteristic.SecuritySystemCurrentState.STAY_ARM;
                break;
	        case self.state_payload_away:
                status = Characteristic.SecuritySystemCurrentState.AWAY_ARM;
                break;
            case self.state_payload_night:
                status = Characteristic.SecuritySystemCurrentState.NIGHT_ARM;
                break;
            case self.state_payload_off:
                status = Characteristic.SecuritySystemCurrentState.DISARMED;
                break;
            case self.state_payload_triggered:
                status = Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
                break;
            default:
                status = null;
                break;
        };
        if (status !== null){
            self.readstate = status;
            console.log("HomeKit received state=",self.readstate);
            self.securityService.getCharacteristic(Characteristic.SecuritySystemCurrentState, self.readstate);
        };
	});
    this.client.subscribe(this.state_topic);
}

ParadoxSecuritySystemAccessory.prototype = {

    setTargetState: function(state, callback) {
        this.log("Setting state to %s", state);
        var self = this;
        switch (state) {
            case Characteristic.SecuritySystemTargetState.STAY_ARM:
                // stayArm = 0
                mqttstate: config["command_payload_home"];
                break;
            case Characteristic.SecuritySystemTargetState.AWAY_ARM:
                // stayArm = 1
                mqttstate: config["command_payload_away"];
                break;
            case Characteristic.SecuritySystemTargetState.NIGHT_ARM:
                // stayArm = 2
                mqttstate: config["command_payload_night"];
                break;
            case Characteristic.SecuritySystemTargetState.DISARM:
                // stayArm = 3
                mqttstate: config["command_payload_off"];
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
        this.securityService = new Service.SecuritySystem(this.name);

        this.securityService
            .getCharacteristic(Characteristic.SecuritySystemCurrentState)
            .on('get', this.getCurrentState.bind(this));

        this.securityService
            .getCharacteristic(Characteristic.SecuritySystemTargetState)
            .on('get', this.getTargetState.bind(this))
            .on('set', this.setTargetState.bind(this));

        return [this.securityService];
    }
};
