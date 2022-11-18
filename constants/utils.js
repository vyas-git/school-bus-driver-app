import { Platform, StatusBar } from 'react-native';
import { theme } from 'galio-framework';

export const StatusHeight = StatusBar.currentHeight;
export const HeaderHeight = (theme.SIZES.BASE * 3.5 + (StatusHeight || 0));
export const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812);
export const HYPERTRACK_TOKEN = "dUFLWXk3ZWJqaVB3Y1d6ZkN5NjNONDJ6SGZ3OkVQRjdGQ0hWWVRjbVdfR1RYMFhtVXdIdEpnWm45SEN1RDRsZE5nUkVycVM2Y2FSeEhrRTRNZw=="
let headers = { "Content-Type": "application/json" }
export const http = {
	get: (url) => {
		if (url.includes("https://v3.api.hypertrack.com/")) {
			headers = {
				"Content-Type": "application/json",
				Authorization: "Basic " + HYPERTRACK_TOKEN
			}

		}
		return fetch(url, {
			method: "GET",
			headers: headers,
		})
	},
	post: (url, payload) => {
		if (true) {
			headers = {
				"Content-Type": "application/json",
				Authorization: "Basic " + HYPERTRACK_TOKEN
			}

		}
		return fetch(url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(payload),
		})
	},
	put: (url, payload) => {
		if (url.includes("https://v3.api.hypertrack.com/")) {
			headers = {
				"Content-Type": "application/json",
				Authorization: "Basic " + HYPERTRACK_TOKEN
			}

		}
		return fetch(url, {
			method: "PUT",
			headers: headers,
			body: JSON.stringify(payload),
		})
	}
}
export const API_DOMAIN = "https://mudarsati.com/api/";
export const EXPO_PUSH_DOMAIN = "https://onesignal.com/api/v1/notifications";
export const CLOUD_MAPS_KEY = Platform.OS == 'android' ? "AIzaSyABnco27IyxK_8P-JWK1cmSPvRxIy5ZoFY" : "AIzaSyCoWaTuIFIks-T9T3HYnyX6Hi0SNrpmxj0";
export const HYPER_TRACK_PUBLISHABLE_KEY = "BxlQHWIdyGG-PETHKa3CLoj1-pMDnG7Yv62ttcCvOvX62Vl_sJUjYBbmVxnYMBYrlNBHK0nob8BNSRVl6NEnVw";
export const HYPERTRACK_API_ENDPOINT = "http://mudarsati.com/hypertrack_api/";
export const HYPERTRACK_TRACK_URL = "https://trck.at/";
export const ONE_SIGNAL_PUSH_PARENTS_APP_ID = "aa2a2b83-afd4-4d80-8990-865e1306bc0a"

export const ONE_SIGNAL_REST_KEY = "aa2a2b83-afd4-4d80-8990-865e1306bc0a"