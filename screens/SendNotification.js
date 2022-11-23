import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { Block, Icon, } from 'galio-framework';
const { width } = Dimensions.get('screen');
import theme from '../constants/Theme';
import { Button as GaButton } from "../components/";
import FooterTabs from "./Footer";
import { observer, inject } from "mobx-react";
import Modal, {
	ModalTitle,
	ModalContent,

} from 'react-native-modals';
import { http, HYPERTRACK_API_ENDPOINT, HYPERTRACK_TRACK_URL } from "../constants/utils";
class SendNotification extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			bottomModalAndTitle: false,
			isLoading: false,
			student_trips_log: [""]
		}
	}


	componentDidMount() { }
	SendNotification(msg, movement_flag) {
		const { StudentStore, DriverStore, screenProps } = this.props;
		let pushIds = [];
		const movement_msg = movement_flag = 0 ? "StartMovement" : "StartReturnMovement"
		var student_trips_log = [];
		this.setState({ isLoading: true })
		StudentStore.StudentsList.forEach(element => {
			pushIds.push(element.pushId)
			this.createTripAndGetUrl(DriverStore.deviceId, element, movement_msg).then((response => {
				if (response.status === 400) {
					student_trips_log.push({ id: element.id, name: element.name, log: response.detail, status: 0 })
					//alert((response.detail))


				} else {
					student_trips_log.push({ id: element.id, name: element.name, log: screenProps.localization.success, status: 1 })


				}
				this.setState({ bottomModalAndTitle: true, student_trips_log: student_trips_log, isLoading: false })



				StudentStore.updatestudent({ id: element.id, nameAr: movement_msg, student_is_at: response.views.share_url });
			}));

		});

		DriverStore.SendPushNotifications({
			"include_player_ids": pushIds,
			"data": { "foo": "bar" },
			"ios_sound": "notification",
			"android_sound": "notification",
			"contents": { "en": msg }
		});

	}
	createTripAndGetUrl(device_id, student, movement_msg) {
		let track_url = HYPERTRACK_TRACK_URL;
		const payload = {
			"device_id": device_id,
			"coords": student.location,
			"student_id": student.id,
			"student_name": student.name,
			"movement_name": movement_msg
		}
		return http.post(`${HYPERTRACK_API_ENDPOINT}trips.php`, payload).then((response) => response.json().then((responseJson) => {
			console.log(responseJson)
			return responseJson;
		})).catch((error) => {
			return { views: { share_url: track_url }, detail: "" }
		});
	}
	getDeviceDetails(device_id) {

		return http.post(`${HYPERTRACK_API_ENDPOINT}/devices.php?device_id=${device_id}`).then((response) => response.json().then((responseJson) => {

			return responseJson;
		})).catch((error) => {
			return { views: { share_url: "" } }
		});
	}
	onEmegerncy() {
		this._saveDetails();
		this.sendEmergencyNotifications();
	}
	_saveDetails = async () => {
		const { screenProps, DriverStore } = this.props;
		await DriverStore.emergency({ name: DriverStore.driverObj.name, mobile: DriverStore.driverObj.mobile, message: "Emergency created by driver -  " + DriverStore.driverObj.name + " Contact : " + DriverStore.driverObj.mobile, subject: "Emergency : " });
		alert(screenProps.localization.success);
	}
	sendEmergencyNotifications() {
		const { StudentStore, DriverStore } = this.props;
		let pushIds = [];

		StudentStore.StudentsList.forEach(element => {
			pushIds.push(element.pushId)


		});
		DriverStore.SendPushNotifications({
			"include_player_ids": pushIds,
			"data": { "foo": "bar" },
			"ios_sound": "notification",
			"android_sound": "notification",
			"contents": {
				"en": "Emergency created by driver -  " + DriverStore.driverObj.name + " Contact : " + DriverStore.driverObj.mobile
			}
		});
	}
	render() {
		const { navigation, screenProps } = this.props;
		if (this.state.isLoading) {
			return (
				<Block style={styles.spinnerContainer}>
					<ActivityIndicator size="large" color={theme.COLORS.PRIMARY} />
					<Text style={{ marginTop: 10 }}></Text>
				</Block>
			)
		}
		return (
			<Block flex style={[styles.container]}>
				<ScrollView>

					<Block flex style={[styles.container, { paddingTop: 100 }]}>
						<Icon name="md-bus" size={100} family="Ionicon" style={{ color: theme.COLORS.PRIMARY }} />
						<Block style={{ marginBottom: 10 }}></Block>

						<GaButton
							onPress={() => this.SendNotification(screenProps.localization.start_return_movement_push_msg, 0)}
							gradColors={[theme.COLORS.GRADIENT_START, theme.COLORS.GRADIENT_END]}
							textcolor={theme.COLORS.WHITE}
							fontSize={20}
							style={styles.button}
							round
							gradient
							children={screenProps.localization.start_movement} />
						<Block style={{ marginBottom: 30 }}></Block>

						<GaButton
							onPress={() => this.SendNotification(screenProps.localization.start_return_movement_push_msg, 1)}
							gradColors={[theme.COLORS.GRADIENT_START, theme.COLORS.GRADIENT_END]}
							textcolor={theme.COLORS.WHITE}
							fontSize={20}
							style={styles.button}
							round
							gradient
							children={screenProps.localization.start_return_movement} />
						<Block style={{ marginBottom: 30 }}></Block>

						<GaButton
							onPress={() => this.onEmegerncy()}
							gradColors={[theme.COLORS.GRADIENT_START, theme.COLORS.GRADIENT_END]}
							textcolor={theme.COLORS.WHITE}
							fontSize={20}
							style={styles.button}
							round
							gradient
							children={screenProps.localization.emergency} />



					</Block >
				</ScrollView>

				<FooterTabs navigation={navigation}></FooterTabs>
				<Modal.BottomModal
					visible={this.state.bottomModalAndTitle}
					onTouchOutside={() => this.setState({ bottomModalAndTitle: false })}
					height={0.5}
					width={1}
					onSwipeOut={() => this.setState({ bottomModalAndTitle: false })}
					onHardwareBackPress={true}
					modalTitle={
						<ModalTitle
							title={screenProps.localization.trip_details}
							hasTitleBar
							style={{ backgroundColor: theme.COLORS.PRIMARY, color: theme.COLORS.WHITE }}
							textStyle={{ color: theme.COLORS.WHITE }}
						/>
					}
				>
					<ModalContent
						style={{
							flex: 1,
							backgroundColor: 'fff',
						}}
					>
						{this.state.student_trips_log.map((item) =>
							<View style={{ flex: 1, flexDirection: "row" }}>
								<Text style={{ flex: 1 }}>#{item.id}</Text>
								<Text style={{ flex: 1 }}>{item.name} </Text>
								<Text style={{ flex: 3 }}>{item.status === 1 ? <Text>{" "}<Icon style={{ color: theme.COLORS.SUCCESS, fontSize: 25, marginLeft: 5, marginRight: 5 }} name="ios-checkmark-circle" family="ionicon"></Icon>{" "}</Text> : <Text>{" "}<Icon style={{ color: theme.COLORS.ERROR, fontSize: 20, marginRight: '5px', marginLeft: '5px' }} name="ios-warning" family="ionicon"></Icon>{" "}</Text>}{item.status === 1 ? screenProps.localization.trip_created : screenProps.localization.trip_not_created}{item.status !== 1 ? <Text>{" "} <Icon onPress={() => alert(item.log)} style={{ color: theme.COLORS.INFO, fontSize: 25, marginLeft: 5, marginRight: 5 }} name="ios-information-circle-outline" family="ionicon"></Icon>{" "}</Text> : null}</Text>
							</View>
						)}
					</ModalContent>
				</Modal.BottomModal>
			</Block>


		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.COLORS.WHITE,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",

	},

	shadow: {
		shadowRadius: 3,
		shadowColor: theme.COLORS.BLACK,
		shadowOpacity: 0.5,
		shadowOffset: { width: 0, height: 3 },

	},
	avatar: {
		height: 80,
		width: 80,
		borderRadius: 40,
		marginTop: theme.SIZES.BASE * 2,

		marginBottom: theme.SIZES.BASE * 2,
	},
	button: {
		width: width - theme.SIZES.BASE * 6,
		height: theme.SIZES.BASE * 3,
		shadowRadius: 0,
		shadowOpacity: 0,
	},
	spinnerContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}
});

export default inject(["StudentStore"], ["DriverStore"])(observer(SendNotification));
