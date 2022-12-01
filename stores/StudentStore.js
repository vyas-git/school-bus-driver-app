import { observable, action } from "mobx";
import { http, API_DOMAIN } from "../constants/utils";
import { AsyncStorage } from "react-native";
export default class StudentStore {
	@observable StudentsList = [];
	@observable parentObj = { pushId: "" };
	@observable isLoading = false;
	@action
	async FetchStudents() {
		const driverObj = await AsyncStorage.getItem('driverObj');
		const driverId = JSON.parse(driverObj).id;
		this.isLoading = true;
		console.log("driverId" + driverId)
		http.get(API_DOMAIN + "students/driver/" + driverId).then((response) => response.json()).then((responseJson) => {


			this.StudentsList = responseJson;
			this.isLoading = false;
			this.FetchParent();

		}).catch((error) => {
			this.isLoading = false;

			console.log("fetch error: " + error);
		});
	}
	async FetchSortedStudents() {
		const driverObj = await AsyncStorage.getItem('driverObj');
		const driverId = JSON.parse(driverObj).id;
		this.isLoading = true;
		console.log("driverId" + driverId)
		http.get(API_DOMAIN + "students/driver/" + driverId).then((response) => response.json()).then((responseJson) => {


			this.StudentsList = this.StudentsList.concat(responseJson);
			this.StudentsList = this.StudentsList.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)


			this.isLoading = false;
			this.FetchParent();

		}).catch((error) => {
			this.isLoading = false;

			console.log("fetch error: " + error);
		});
	}
	FetchParent() {
		const parentId = this.StudentsList[0].parentId
		console.log("parentId" + API_DOMAIN + "parents/" + parentId)
		http.get(API_DOMAIN + "parents/" + parentId).then((response) => response.json()).then((responseJson) => {
			this.parentObj = responseJson[0];
		}).catch((error) => {

			console.log("fetch error: " + error);
		});
	}
	updatestudent(payload) {

		http.put(API_DOMAIN + "students", payload).then((response) => response.json().then((responseJson) => {
			this.FetchSortedStudents();
		})).catch((error) => {

			console.log("fetch error: " + error);
		});
	}
	updatestudentAbsent(studentObj) {
		payload = {
			id: studentObj.id,
			absent: !studentObj.absent
		}
		http.put(API_DOMAIN + "students", payload).then((response) => response.json().then((responseJson) => {
			console.log("Students" + JSON.stringify(responseJson))
		})).catch((error) => {

			console.log("fetch error: " + error);
		});
	}
	@action changeValues(text, field) {
		this[field] = text;
	}
}
