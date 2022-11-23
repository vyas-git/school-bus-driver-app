import React from 'react';
import { ImageBackground, StyleSheet, StatusBar, Dimensions, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Block, Text, Icon, Input } from 'galio-framework';
const { height, width } = Dimensions.get('screen');
import MapView from 'react-native-maps';
import theme from '../constants/Theme';
import { Button as GaButton } from "../components/";
import FooterTabs from "./Footer";
import { observer, inject } from "mobx-react";
import PhoneInput from 'react-native-phone-input';
import { PERMISSIONS, check, RESULTS, request } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import ImagePicker from 'react-native-image-picker';


class EditAccount extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
			locationResult: null,
			locationCoords: { coords: { latitude: 37.78825, longitude: -122.4324 } },
			name: "",
			mobile: "",
			busNo: "",
			image: ""
		};

	}


	componentWillMount() {
		const { DriverStore } = this.props;

		this.setState({
			name: DriverStore.driverObj.name,
			mobile: DriverStore.driverObj.mobile,
			busNo: DriverStore.driverObj.busNo,
			image: DriverStore.driverObj.image,
			locationCoords: { coords: { latitude: DriverStore.driverObj.location ? parseFloat(DriverStore.driverObj.location.split(",")[0]) : 0, longitude: DriverStore.driverObj.location ? parseFloat(DriverStore.driverObj.location.split(",")[1]) : 0 } }
		})
		this.checkPermission();

	}
	updateDriversData() {
		const { DriverStore, screenProps } = this.props;
		DriverStore.updateDriverDetails({ id: DriverStore.driverObj.id, name: this.state.name, mobile: this.state.mobile, busNo: this.state.busNo, image: this.state.image, location: "" + this.state.locationCoords.coords.latitude + "," + this.state.locationCoords.coords.longitude + "" })
		alert(screenProps.localization.details_update_msg);
	}


	_getLocationAsync = async () => {
		try {
			Geolocation.getCurrentPosition(location => {
				this.setState({
					locationResult: JSON.stringify(location), locationCoords: location,
				});
			}, err => {
				alert("Please on and allow location service")
				this.checkPermission();

			});
		}
		catch (err) {
			console.log("error", err)
		}



	};
	checkPermission() {
		let location_permssion = Platform.OS === "ios" ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
		check(location_permssion)
			.then(result => {
				console.log('result', result)
				switch (result) {
					case RESULTS.UNAVAILABLE:
						console.log(
							'This feature is not available (on this device / in this context)',
						);
						break;
					case RESULTS.DENIED:

						console.log(
							'The permission has not been requested / is denied but requestable',
						);
						request(location_permssion).then(result => {
							// …
						});
						break;
					case RESULTS.GRANTED:

						break;
					case RESULTS.BLOCKED:
						console.log('The permission is denied and not requestable anymore');
						request(location_permssion).then(result => {
							// …
						});
						break;
				}
			})
			.catch(error => {
				// …
				console.log("Permissions Error", error)
			});
	}

	_pickImage = async () => {

		const options = {
			title: 'Choose Image',
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
			maxWidth: 50,
			maxHeight: 50
		};

		/**
		 * The first arg is the options object for customization (it can also be null or omitted for default options),
		 * The second arg is the callback which sends object: response (more info in the API Reference)
		 */
		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				const source = { uri: response.data };

				// You can also display the image using data:
				// const source = { uri: 'data:image/jpeg;base64,' + response.data };


				this.setState({ image: source.uri });

			}
		});

	};
	_resizeImage = async (uri) => {
		const result = await ImageManipulator.manipulateAsync(uri,
			[{ resize: { width: 100, height: 100 } }], { base64: true })

		this.setState({ image: result.base64 });

	}
	render() {
		const { navigation, screenProps, DriverStore } = this.props;
		return (
			<Block flex style={{
				backgroundColor: theme.COLORS.WHITE,
			}}>
				<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
					<ScrollView>

						<Block flex style={[styles.container, styles.padded]}>

							<TouchableOpacity onPress={() => this._pickImage()} >

								{
									this.state.image == null || this.state.image == "" || this.state.image == "string" ? <Block style={{ width: 80, height: 80, borderRadius: 40, borderColor: theme.COLORS.PRIMARY, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
										<Icon color={theme.COLORS.PRIMARY} size={40} name='photo' family="font-awesome"></Icon>
									</Block> :
										<Image style={{ width: 80, height: 80, borderRadius: 40, borderColor: theme.COLORS.PRIMARY, borderWidth: 1 }} source={{ uri: 'data:image/png;base64,' + this.state.image }} />

								}
							</TouchableOpacity>
							<Input
								onRef={input => { this.input = input }}

								style={[styles.shadow]}
								bgColor={theme.COLORS.INPUT}
								placeholderTextColor={theme.COLORS.PRIMARY}
								rounded
								color={theme.COLORS.PRIMARY}
								icon="edit"
								family="material-icons"
								right={true}
								value={this.state.name}
								onChangeText={(text) => this.setState({ name: text })}
							/>

							<PhoneInput
								placeholder={screenProps.localization.mobile_no_placeholder}
								style={[styles.shadow, { backgroundColor: theme.COLORS.INPUT, height: 50, borderRadius: 30, width: '100%', paddingHorizontal: 5 }]}
								bgColor={theme.COLORS.INPUT}
								placeholderTextColor={theme.COLORS.PRIMARY}
								value={this.state.mobile}
								onChangePhoneNumber={(text) => this.setState({ mobile: text })}
								keyboardType="phone-pad"
								color={theme.COLORS.BLACK}
								rounded
								ref='phone' />
							<Input
								color={theme.COLORS.BLACK}

								placeholder={"bus - hy 7245"}
								style={[styles.shadow]}
								bgColor={theme.COLORS.INPUT}
								placeholderTextColor={theme.COLORS.PRIMARY}
								rounded
								value={this.state.busNo}
								onChangeText={(text) => this.setState({ busNo: text })}

							/>
							<TouchableOpacity style={{
								alignSelf: "flex-start",
								width: '100%',
								flexDirection: 'row',
								marginTop: 30,

							}}
								onPress={() => this._getLocationAsync()}
							>
								<TextInput
									editable={false}
									color={theme.COLORS.PRIMARY}
									style={{
										fontSize: 15, color: theme.COLORS.PRIMARY,
										borderBottomColor: theme.COLORS.PRIMARY,
										borderBottomColor: theme.COLORS.PRIMARY,
										borderBottomWidth: 1,
										alignSelf: "flex-start",

										marginBottom: 10,
									}}
								>{screenProps.localization.locate_school}
								</TextInput>
								<Icon name="edit" color={theme.COLORS.PRIMARY} style={{ marginLeft: 20 }} family="material-icons" />

							</TouchableOpacity>

							<MapView style={{
								height: 100, width: '100%',
								borderColor: "#cdcccd",
								borderWidth: 3, borderRadius: 5,
								marginBottom: 20

							}}
								region={{ latitude: this.state.locationCoords.coords.latitude, longitude: this.state.locationCoords.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
							>
								<MapView.Marker
									draggable
									coordinate={this.state.locationCoords.coords}
									title="School Location"
									description="Set school location"
									onDragEnd={(e) => this.setState({ locationCoords: { coords: e.nativeEvent.coordinate } })}

								>
									<Icon name="map-marker" family="font-awesome" size={30} color={theme.COLORS.ERROR} />
								</MapView.Marker>
							</MapView>
							<GaButton
								onPress={() => this.updateDriversData()}
								gradColors={[theme.COLORS.GRADIENT_START, theme.COLORS.GRADIENT_END]}
								textcolor={theme.COLORS.WHITE}
								fontSize={20}
								style={styles.button}
								round
								gradient
								children={screenProps.localization.save_text} />
						</Block >
					</ScrollView>

				</KeyboardAvoidingView>

				<FooterTabs navigation={navigation}></FooterTabs>
			</Block>


		);
	}
}
export default inject(["DriverStore"])(observer(EditAccount));
const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.COLORS.WHITE,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",

	},
	padded: {

		paddingHorizontal: theme.SIZES.BASE * 2,
		position: 'relative',
		bottom: theme.SIZES.BASE,
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
});
