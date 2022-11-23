import React from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, Dimensions, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Block, Text, Icon, Input, Button } from 'galio-framework';
const { width } = Dimensions.get('screen');
import MapView from 'react-native-maps';
import { PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import ImagePicker from 'react-native-image-picker';

import theme from '../constants/Theme';
import { Button as GaButton } from "../components/";
import { observer, inject } from "mobx-react";
import PhoneInput from 'react-native-phone-input'
// import { Notifications } from 'expo';
class Account extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
			locationResult: null,
			locationCoords: { coords: { latitude: 37.78825, longitude: -122.4324 } },
			phone: "",
			name: "",
			image: "",
			isLoginView: true,
			isLoading: false

		};

	}


	componentDidMount() {
		//this.checkPermission();
		this._getLocationAsync();
	}

	_handleMapRegionChange = mapRegion => {
		this.setState({ mapRegion });
	};

	_getLocationAsync = async () => {
		try {
			Geolocation.getCurrentPosition(location => {
				this.setState({
					locationResult: JSON.stringify(location), locationCoords: location,
				});
			}, err => {
				alert("Please on and allow location")

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
						break;
					case RESULTS.GRANTED:
						request(location_permssion).then(result => {
							// …
						});
						break;
					case RESULTS.BLOCKED:
						console.log('The permission is denied and not requestable anymore');
						break;
				}
			})
			.catch(error => {
				// …
				console.log("Permissions Error", error)
			});
	}

	_saveDetails = async () => {
		this.setState({ isLoading: true })

		const { DriverStore, screenProps, navigation } = this.props;
		const token = "";// await this.getPushToken();
		DriverStore.AddDriver({ name: this.state.name, mobile: this.state.phone, location: "" + this.state.locationCoords.coords.latitude + "," + this.state.locationCoords.coords.longitude + "", pushId: token, image: this.state.image }, navigation, "AddStudent", screenProps);
		var that = this;
		setTimeout(function () {
			that.setState({ isLoading: false })
		}, 2000)
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
	async _login() {
		const { DriverStore, screenProps, navigation } = this.props;
		this.setState({ isLoading: true })
		const token = "";//await this.getPushToken();
		DriverStore.getDriverDetails({ mobile: this.state.phone, pushId: token }, navigation, "Home", screenProps);

		var that = this;
		setTimeout(function () {
			that.setState({ isLoading: false })
		}, 2000)

	}
	render() {
		const { screenProps } = this.props;
		if (this.state.isLoading) {
			return (
				<Block style={styles.spinnerContainer}>
					<ActivityIndicator size="large" color={theme.COLORS.PRIMARY} />
				</Block>
			)
		}

		return (
			<Block flex style={{
				backgroundColor: theme.COLORS.WHITE,

			}}>

				<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
					<ScrollView>

						{
							this.state.isLoginView ?

								<Block style={[styles.padded, { flex: 1, backgroundColor: theme.COLORS.WHITE, flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
									<Image
										style={{ height: 200, width: width / 1.5 }}

										resizeMode="contain"

										source={require("../assets/images/Image_6.png")} />


									<PhoneInput
										placeholder={screenProps.localization.mobile_no_placeholder}
										style={[styles.shadow, { backgroundColor: theme.COLORS.INPUT, height: 50, borderRadius: 30, width: '100%', paddingHorizontal: 5 }]}
										bgColor={theme.COLORS.INPUT}
										placeholderTextColor={theme.COLORS.PRIMARY}
										onChangePhoneNumber={(text) => { this.phone.isValidNumber() ? this.setState({ phone: text }) : this.setState({ phone: "" }) }}
										keyboardType="phone-pad"
										color={theme.COLORS.BLACK}
										rounded
										ref={(ref) => { this.phone = ref; }}
										initialCountry={"sa"}

									/>
									<Block style={{ marginTop: 30 }}></Block>
									<Button
										onPress={() => { (this.state.phone == "") ? {} : this._login() }}

										style={[styles.shadow, { width: 60, height: 60, borderRadius: 10, borderColor: theme.COLORS.PRIMARY, borderWidth: 1 }]}
										color={(this.state.phone == "") ? theme.COLORS.INPUT : theme.COLORS.PRIMARY}
										onlyIcon={true}
										icon="md-arrow-forward"
										iconFamily="ionicon"
										iconColor={(this.state.phone == "") ? theme.COLORS.MUTED : theme.COLORS.WHITE}
										iconSize={30}
										rounded />
									<TouchableOpacity style={{
										alignSelf: "flex-start",
										width: '100%',
										paddingBottom: 100

									}}
										onPress={() => this.setState({ isLoginView: false })
										}

									>
										<TextInput
											editable={false}
											onPress={() => this.setState({ isLoginView: false })}

											color={theme.COLORS.PRIMARY}
											style={{
												fontSize: 15, color: theme.COLORS.PRIMARY,
												borderBottomColor: theme.COLORS.BLACK,
												borderBottomWidth: 1,
												marginTop: 30,
												alignSelf: "center",

												marginBottom: 10,
											}}
										>{screenProps.localization.new_account_signup}
										</TextInput>
									</TouchableOpacity>

								</Block >
								:
								<Block flex style={[styles.container, styles.padded]}>
									<TouchableOpacity onPress={() => this._pickImage()} >

										{this.state.image == "" ? <Block style={{ width: 80, height: 80, borderRadius: 40, borderColor: theme.COLORS.PRIMARY, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
											<Icon color={theme.COLORS.PRIMARY} size={40} name='photo' family="font-awesome"></Icon>
										</Block> :
											<Image style={{ width: 80, height: 80, borderRadius: 40, borderColor: theme.COLORS.PRIMARY, borderWidth: 1 }} source={{ uri: 'data:image/png;base64,' + this.state.image }} />
										}
									</TouchableOpacity>
									<Input placeholder={screenProps.localization.driver_name_placeholder}
										style={[styles.shadow]}
										bgColor={theme.COLORS.INPUT}
										placeholderTextColor={theme.COLORS.PRIMARY}
										color={theme.COLORS.BLACK}
										onChangeText={(text) => this.setState({ name: text })}

										rounded />

									<PhoneInput
										placeholder={screenProps.localization.mobile_no_placeholder}
										style={[styles.shadow, { backgroundColor: theme.COLORS.INPUT, height: 50, borderRadius: 30, width: '100%', paddingHorizontal: 5 }]}
										bgColor={theme.COLORS.INPUT}
										placeholderTextColor={theme.COLORS.PRIMARY}
										onChangePhoneNumber={(text) => { this.phone.isValidNumber() ? this.setState({ phone: text }) : this.setState({ phone: "" }) }}
										keyboardType="phone-pad"
										color={theme.COLORS.BLACK}
										rounded
										ref={(ref) => { this.phone = ref; }}
										initialCountry={"sa"}

									/>

									<TouchableOpacity style={{
										alignSelf: "flex-start",
										width: '100%'
									}}
										onPress={() => this._getLocationAsync()
										}
									>
										<TextInput
											editable={false}
											color={theme.COLORS.PRIMARY}
											style={{
												fontSize: 15, color: theme.COLORS.PRIMARY,
												borderBottomColor: theme.COLORS.PRIMARY,
												borderBottomColor: theme.COLORS.PRIMARY,
												borderBottomWidth: 1,
												marginTop: 10,
												alignSelf: "flex-start",

												marginBottom: 10,
											}}
										>{screenProps.localization.locate_school}
										</TextInput>
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
										onPress={() => { (this.state.name == "" || this.state.phone == "") ? {} : this._saveDetails() }}
										gradColors={
											(this.state.name == "" || this.state.phone == "") ?
												[theme.COLORS.MUTED, theme.COLORS.MUTED] :
												[theme.COLORS.GRADIENT_START, theme.COLORS.GRADIENT_END]}
										textcolor={theme.COLORS.WHITE}
										fontSize={20}
										style={styles.button}
										round
										gradient
										children={screenProps.localization.save_text} />

									<TouchableOpacity style={{
										alignSelf: "flex-start",
										width: '100%',
										paddingBottom: 100

									}}
										onPress={() => this.setState({ isLoginView: true })
										}

									>
										<TextInput
											editable={false}
											onPress={() => this.setState({ isLoginView: true })}

											color={theme.COLORS.PRIMARY}
											style={{
												fontSize: 15, color: theme.COLORS.PRIMARY,
												borderBottomColor: theme.COLORS.BLACK,
												borderBottomWidth: 1,
												marginTop: 10,
												alignSelf: "center",

												marginBottom: 10,
											}}
										>{screenProps.localization.account_exits_login_here}
										</TextInput>
									</TouchableOpacity>
								</Block >

						}
					</ScrollView>

				</KeyboardAvoidingView>

			</Block>


		);
	}
}
export default inject("DriverStore")(observer(Account));

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

		marginBottom: theme.SIZES.BASE,
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
