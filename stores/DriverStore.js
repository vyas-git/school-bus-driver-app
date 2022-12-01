import { observable, action } from "mobx";
import { http, API_DOMAIN, EXPO_PUSH_DOMAIN, CLOUD_MAPS_KEY, HYPER_TRACK_PUBLISHABLE_KEY, ONE_SIGNAL_REST_KEY, ONE_SIGNAL_PUSH_PARENTS_APP_ID } from "../constants/utils";
import { AsyncStorage } from "react-native";
import { Location, Permissions } from 'react-native-unimodules';
import { HyperTrack } from 'hypertrack-sdk-react-native';
import Geolocation from '@react-native-community/geolocation';

navigator.geolocation = require('@react-native-community/geolocation');

export default class DriverStore {
	@observable driverObj = { "name": "" };
	@observable alerts = [];
	@observable isLoading = false;
	@observable _interval = "";
	@observable flagTracking = false;
	@observable hyperTrack = {};
	@observable deviceId = "";
	@observable pushToken = "";


	@action AddDriver(payload, navigation, route, screenProps) {
		console.log("drivers responssse");
		payload = {
			"id": 0,
			"name": payload.name,
			"nameAr": payload.location,
			"email": "string",
			"mobile": payload.mobile,
			"profileImg": 0,
			"licence": "string",
			"deviceId": this.deviceId,
			"busNo": "string",
			"location": "",
			"students": "string",
			"pushId": this.pushToken,
			"image": payload.image,
			"isApproved": false,
			"insertedBy": 0,
			"upadtedBy": 0,
			"createdAt": {},
			"updatedAt": {}
		}
		http.post(API_DOMAIN + "drivers", payload).then((response) => response.json().then((responseJson) => {
			console.log("post driver response" + JSON.stringify(responseJson))
			if (!responseJson.status) {
				this.getDriverDetails(payload, navigation, route, screenProps);
			} else if (response.status == 201) {
				this.driverObj = responseJson;
				AsyncStorage.setItem('driverObj', JSON.stringify(this.driverObj));

			}


		})).catch((error) => {

			console.log("fetch error: " + JSON.stringify(error));
		});
	}
	@action getDriverDetails(payload, navigation, route, screenProps) {
		console.log("ok---");
		http.get(API_DOMAIN + "drivers/mobile/" + payload.mobile).then((response) => response.json()).then((responseJson) => {
			console.log("po[po[o", responseJson);

			if (responseJson.length > 0) {
				this.driverObj = responseJson[0];
				AsyncStorage.setItem('driverObj', JSON.stringify(this.driverObj));
				this.updateDriverDetails({ id: this.driverObj.id, pushId: this.pushToken, deviceId: this.deviceId })
				navigation.navigate("PhoneAuth", { phone: payload.mobile, route: route })

			} else {
				alert(screenProps.localization.not_registered_please_login)

			}
		}).catch((error) => {

			console.log("fetch error: " + error);
		});
	}
	@action emergency(payload) {
		payload = {
			"id": 0,
			"userName": payload.name,
			"userType": "driver-" + payload.mobile,
			"message": payload.subject + " - " + payload.message,
			"createdAt": {},
			"updatedAt": {}
		}
		http.post(API_DOMAIN + "emergency", payload).then((response) => response.json().then((responseJson) => {
			console.log("Success" + JSON.stringify(responseJson))

		})).catch((error) => {
			console.log("fetch error: " + error);
		});
	}
	@action getDriverDetailsByMobile(mobile) {

		http.get(API_DOMAIN + "drivers/mobile/" + mobile).then((response) => response.json()).then((responseJson) => {
			if (responseJson.length > 0) {
				this.driverObj = responseJson[0];
				AsyncStorage.setItem('driverObj', JSON.stringify(this.driverObj));

			}
		}).catch((error) => {

			console.log("fetch error: " + error);
		});
	}
	@action updateDriverDetails(payload) {

		http.put(API_DOMAIN + "drivers", payload).then((response) => response.json()).then((responseJson) => {
			console.log("responseJson" + JSON.stringify(responseJson));
			this.getDriverDetailsByMobile(this.driverObj.mobile);
		}).catch((error) => {

			console.log("fetch error: " + error);
		});
	}

	@action changeValues(text, field) {
		this[field] = text;
	}
	@action updateDriverLocation(location) {
		payload = {
			id: this.driverObj.id,
			location: "" + location.coords.latitude + "," + location.coords.longitude + ""
		}
		http.put(API_DOMAIN + "drivers", payload).then((response) => response.json().then((responseJson) => {

		})).catch((error) => {

			console.log("fetch error: " + error);
		});
	}
	@action postAlerts(payload) {
		payload.include_player_ids.forEach(pushId => {
			const pl = {
				"id": 0,
				"name": payload.contents.en,
				"nameAr": "string",
				"pushId": pushId,
				"insertedBy": 0,
				"upadtedBy": 0,
				"createdAt": {},
				"updatedAt": {}
			}

			http.post(API_DOMAIN + "alerts", pl).then((response) => response.json()).then((responseJson) => {
			}).catch((error) => {

			});
		});

	}

	@action getAlerts() {
		this.isLoading = true;
		http.get(API_DOMAIN + "alerts/pushid/" + this.driverObj.pushId).then((response) => response.json()).then((responseJson) => {
			this.alerts = responseJson.filter(alert => alert.nameAr == "todriver");
			this.isLoading = false;

		}).catch((error) => {
			this.isLoading = false;

		});
	}
	LocationTracking() {
		var that = this;

		// this._interval = setInterval(async () => {
		// 	// Your code
		// 	let { status } = await Permissions.askAsync(Permissions.LOCATION);
		// 	if (status !== 'granted') {

		// 	}

		// 	Geolocation.getCurrentPosition(location => {
		// 		that.updateDriverLocation(location);
		// 		that.infrontDrStuLocnsUpdate(location);
		// 	}, err => {
		// 		alert("Please on and allow location service")
		// 	});


		// }, 10000);
	}
	StopLocationTracking() {
		AsyncStorage.setItem("flagTracking", "false");
		clearInterval(this._interval);
		//Hyper track Stop Tracking
		this.hyperTrack.stopTracking();

	}
	async StartLocationTracking() {

		// Set AsyncStorage local item 
		AsyncStorage.setItem("flagTracking", "true");
		// Start Background Location Tracking


		// Start In App Location Tracking
		//this.LocationTracking();

		// Hypertrack Location Track 
		this.hyperTrack.startTracking();
		this.hyperTrack.setDeviceName(this.driverObj.name + "-- Driver");


	}
	infrontDrStuLocnsUpdate(location) {

		http.get(API_DOMAIN + "students/driver/" + this.driverObj.id).then((response) => response.json()).then((studentsResp) => {

			studentsResp.forEach(async (item, index) => {
				let status = await this.getStatusAtSchoolOrDoor(item.location, location);
				if (status == "InfrontDoor" || status == "AtSchool") {
					const payload = { id: item.id, nameAr: status }
					http.put(API_DOMAIN + "students", payload).then((response) => response.json().then((responseJson) => {
					})).catch((error) => {

						console.log("fetch error: " + error);
					});
				}



			});

		}).catch((error) => {
			this.isLoading = false;

			console.log("fetch error: " + error);
		});
	}
	async getStatusAtSchoolOrDoor(studentLoc, driverLiveLoc) {
		driverLiveLoc = "" + driverLiveLoc.coords.latitude + "," + driverLiveLoc.coords.longitude + "";
		try {
			// Distance Between Student Home and Driver Location
			let resp1 = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${studentLoc}&destination=${driverLiveLoc}&key=${CLOUD_MAPS_KEY}`)
			let respJson1 = await resp1.json();

			// Distance Between School and Driver Location
			let resp2 = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${this.driverObj.nameAr}&destination=${driverLiveLoc}&key=${CLOUD_MAPS_KEY}`)
			let respJson2 = await resp2.json();

			if (respJson1.routes[0].legs[0].duration.value < 60) {
				return "InfrontDoor"
			}
			if (respJson2.routes[0].legs[0].duration.value < 60) {
				return "AtSchool"
			}

			return ""
		} catch (error) {

			return error
		}

	}
	SendPushNotifications(payload) {
		payload['app_id'] = ONE_SIGNAL_PUSH_PARENTS_APP_ID
		http.post(EXPO_PUSH_DOMAIN, payload).then((response) => response.json().then((responseJson) => {
			console.log("Success send push" + JSON.stringify(responseJson))
		})).catch((error) => {

			console.log("fetch error: " + error);
		});
		this.postAlerts(payload)
	}
	@action initializeHyperTrack = async () => {
		// (Optional) This turns on logging for underlying native SDKs. Placed on top so SDKs start logging immediately
		HyperTrack.enableDebugLogging(true);

		// Initialize HyperTrack with a publishable key
		this.hyperTrack = await HyperTrack.createInstance(HYPER_TRACK_PUBLISHABLE_KEY);

		// Obtain the unique HyperTrack's DeviceID identifier to use it with HyperTrack's APIs
		this.deviceId = await this.hyperTrack.getDeviceID();
		console.log("======================================================= this.deviceId ==============================================================" + this.deviceId);
		// (Optional) Set the device name to display in dashboard (for ex. user name)
		this.hyperTrack.setDeviceName(this.driverObj.name + "-- Driver");



	};
}

