import React from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, Alert, Linking } from "react-native";
import MapView, { Marker, AnimatedRegion, PROVIDER_GOOGLE } from "react-native-maps";
import haversine from "haversine";
import { Image } from "react-native";
import { Block, Text, Icon, Card } from 'galio-framework';
import theme from '../constants/Theme';
import { observer, inject } from "mobx-react";
import Swiper from 'react-native-swiper';
const { width } = Dimensions.get('screen');
import Geolocation from '@react-native-community/geolocation';

const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = 0.1;
const LATITUDE = 23.674304;
const LONGITUDE = 45.393592;
class LocationTracking extends React.Component {
	constructor(props) {
		super(props);
		this.map = null;
		watchID = null;
		this.state = {
			latitude: LATITUDE,
			longitude: LONGITUDE,
			driverCurrentLocation: { coords: { latitude: LATITUDE, longitude: LONGITUDE } },
			routeCoordinates: [],
			distanceTravelled: 0,
			prevLatLng: {},
			coordinate: new AnimatedRegion({
				latitude: LATITUDE,
				longitude: LONGITUDE,
				latitudeDelta: LATITUDE_DELTA,
				longitudeDelta: LONGITUDE_DELTA
			}),
			google_directions_coords: [],
			swiper_current_index: 0,
			student_street: "",
			time_kms: ""
		};

	}

	async componentWillMount() {
		const { coordinate } = this.state;

		// Set Directions Intially
		this.setDirections(this.state.swiper_current_index)
	}
	componentDidMount() {
		this._getLocationAsync();


	}

	setDirections(index) {
		const StudentStore = this.props.navigation.state.params ? this.props.navigation.state.params.StudentStore : {};
		let destination = StudentStore.StudentsList[index].location != 0 ? StudentStore.StudentsList[index].location : "23.674304,45.393592";

		this.setState({ swiper_current_index: index, latitude: parseFloat(destination.split(",")[0]), longitude: parseFloat(destination.split(",")[1]) })

	}

	_getLocationAsync = async () => {
		try {
			Geolocation.getCurrentPosition(location => {

				this.setState({ driverCurrentLocation: location, latitude: location.coords.latitude, longitude: location.coords.longitude });
			}, err => {
				alert("Please on and allow location")

			});
		}
		catch (err) {
			console.log("error", err)
		}



	};
	openRealTimeNavigation() {
		const StudentStore = this.props.navigation.state.params ? this.props.navigation.state.params.StudentStore : {};
		let destination = StudentStore.StudentsList[this.state.swiper_current_index].location;
		var url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${destination}`;
		Linking.canOpenURL(url).then(supported => {
			if (!supported) {
				console.log('Can\'t handle url: ' + url);
			} else {
				return Linking.openURL(url);
			}
		}).catch(err => console.error('An error occurred', err));
	}

	render() {
		const { screenProps, DriverStore } = this.props;
		const StudentStore = this.props.navigation.state.params ? this.props.navigation.state.params.StudentStore : {};
		console.log(this.state.latitude)
		return (
			<View style={styles.container}>

				<MapView
					style={styles.map}
					//	provider={PROVIDER_GOOGLE}
					showUserLocation
					followUserLocation
					loadingEnabled
					region={
						{
							latitude: this.state.latitude,
							longitude: this.state.longitude,
							latitudeDelta: LATITUDE_DELTA,
							longitudeDelta: LONGITUDE_DELTA
						}
					}
					ref={map => {
						this.map = map;
					}}
				>
					{/* <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} /> */}
					{/* {
						this.state.google_directions_coords.length > 0 ?
							<MapView.Polyline
								coordinates={this.state.google_directions_coords}
								strokeWidth={4}
								strokeColor="black" /> : null
					} */}

					<Marker.Animated
						ref={marker => {
							this.marker = marker;
						}}
						coordinate={this.state.driverCurrentLocation.coords}
						image={require("../assets/images/bus_square.png")}
					>
					</Marker.Animated>

					<MapView.Marker
						coordinate={{ latitude: parseFloat(DriverStore.driverObj.nameAr.split(",")[0] ? parseFloat(DriverStore.driverObj.nameAr.split(",")[0]) : 0), longitude: parseFloat(DriverStore.driverObj.nameAr.split(",")[1]) ? parseFloat(DriverStore.driverObj.nameAr.split(",")[1]) : 0 }}
						title="School"
						description="Location of school"
						image={require("../assets/images/school_1.png")}

					>
					</MapView.Marker>

					{

						StudentStore.StudentsList.map((item, index) => (
							<View key={index}>

								<MapView.Marker
									key={index}
									coordinate={{
										latitude: parseFloat(item.location.split(",")[0]) ? parseFloat(item.location.split(",")[0]) : 0,
										longitude: parseFloat(item.location.split(",")[1]) ? parseFloat(item.location.split(",")[1]) : 0
									}}
									title={item.name}
									description={item.division}
								>
									<Icon name="map-marker" family="font-awesome" color={theme.COLORS.ERROR} size={30} />

								</MapView.Marker>
							</View>

						))
					}

				</MapView>

				<TouchableOpacity style={{ position: 'absolute', right: 20, top: 50 }} onPress={() => this.openRealTimeNavigation()}>
					<Block style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: theme.COLORS.PRIMARY, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>

						<Icon name="navigation" family="material" style={{ transform: [{ rotate: '45deg' }] }} size={40} color={theme.COLORS.WHITE} />
					</Block>

				</TouchableOpacity>



				<View style={{
					height: 200,
					width: '100%',
					position: "absolute",
					bottom: 0,
					//justifyContent: 'center',
					//	alignItems: 'center'

				}}>
					{

						StudentStore.StudentsList.length > 0 ?
							<Swiper

								containerStyle={{
									flex: 1

								}}
								key={StudentStore.StudentsList.length}
								onIndexChanged={(index) => this.setDirections(index)}
							>
								{

									StudentStore.StudentsList.map(
										(item, index) => (
											<View key={index} style={styles.buttonContainer}>

												<Block key={index} style={[styles.ribbonCard]}>

													<Block style={[styles.card]}>


														<Block style={{ flexDirection: 'row', alignItems: 'flex-start' }}>


															{
																item.image == null || item.image == "" || item.image == "string" ?
																	<Block style={{ width: 80, height: 80, borderRadius: 40, borderColor: theme.COLORS.PRIMARY, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
																		<Icon color={theme.COLORS.PRIMARY} size={40} name='photo' family="font-awesome"></Icon>
																	</Block> :
																	<Image style={{ width: 80, height: 80, borderRadius: 40, borderColor: theme.COLORS.PRIMARY, borderWidth: 1 }} source={{ uri: 'data:image/png;base64,' + item.image }} />
															}

															<Block style={{ flexDirection: 'column', position: 'absolute', top: 10, right: 10 }}>

																<Text size={20} style={{ marginTop: 5, marginLeft: 10 }} color={theme.COLORS.BLACK}>#{item.id}</Text>

																<Block style={{ marginBottom: 10 }}></Block>
																<Text size={10} style={{ marginTop: 5, marginLeft: 10 }} color={theme.COLORS.BLACK}>{item.name}</Text>


															</Block>
														</Block>


													</Block>
												</Block>
											</View>
										))
								}


							</Swiper>
							: null

					}
				</View>
			</View >
		);
	}
}

const styles = StyleSheet.create({
	container: {

		flex: 1
	},
	map: {
		...StyleSheet.absoluteFillObject
	},
	bubble: {
		flex: 1,
		backgroundColor: "rgba(255,255,255,0.7)",
		paddingHorizontal: 18,
		paddingVertical: 12,
		borderRadius: 20
	},
	latlng: {
		width: 200,
		alignItems: "stretch"
	},
	button: {
		width: 80,
		paddingHorizontal: 12,
		alignItems: "center",
		marginHorizontal: 10
	},
	buttonContainer: {
		flexDirection: "row",
		marginVertical: 20,
		backgroundColor: "transparent",
		position: "absolute",
		bottom: 0,
		alignSelf: 'center'
	},
	avatar: {
		height: 80,
		width: 80,
		borderRadius: 40,
		marginBottom: theme.SIZES.BASE * 2,



	},
	button: {
		width: 120,
		height: 20,
		shadowRadius: 0,
		shadowOpacity: 0,
	},
	cards: {
		flex: 1,
		backgroundColor: theme.COLORS.WHITE,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	card: {
		borderWidth: 0,
		paddingLeft: 10,
		paddingTop: 20,
		paddingBottom: 10,
		backgroundColor: theme.COLORS.WHITE,
		width: width - theme.SIZES.BASE * 2.5,
		borderRadius: 15,
		borderColor: theme.COLORS.PRIMARY,
		margin: 0,


	},
	ribbonCard: {
		borderWidth: 0,
		paddingLeft: 10,
		backgroundColor: theme.COLORS.PRIMARY,
		width: width - theme.SIZES.BASE * 2,
		borderRadius: 15,
		borderColor: theme.COLORS.PRIMARY

	},
	cardFooter: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginVertical: theme.SIZES.BASE / 2,
		paddingHorizontal: theme.SIZES.BASE,
		paddingVertical: theme.SIZES.BASE / 2,
		backgroundColor: theme.COLORS.TRANSPARENT,
	},
	cardNoRadius: {
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	cardAvatar: {
		width: theme.SIZES.BASE * 2.5,
		height: theme.SIZES.BASE * 2.5,
		borderRadius: theme.SIZES.BASE * 1.25,
	},
	cardTitle: {
		justifyContent: 'center',
		paddingLeft: theme.SIZES.BASE / 2,
	},
	cardImageContainer: {
		borderWidth: 0,
		overflow: 'hidden',
	},
	cardImageRadius: {
		borderRadius: theme.SIZES.BASE * 0.1875,
	},
	cardImage: {
		width: 'auto',
		height: theme.SIZES.BASE * 12.5,
	},
	cardRounded: {
		borderRadius: theme.SIZES.BASE * 0.5,
	},
	cardFull: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		left: 0,
	},
	cardGradient: {
		bottom: 0,
		left: 0,
		right: 0,
		height: 90,
		position: 'absolute',
		overflow: 'hidden',
		borderBottomRightRadius: theme.SIZES.BASE * 0.5,
		borderBottomLeftRadius: theme.SIZES.BASE * 0.5,
	},
});

export default inject(["DriverStore"], ["StudentStore"])(observer(LocationTracking));
