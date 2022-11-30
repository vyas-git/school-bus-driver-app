import React from 'react';
import { ImageBackground, StyleSheet, StatusBar, Dimensions, Image, BackHandler, Alert } from 'react-native';
import { Block, Button, Text, Icon } from 'galio-framework';
import { AsyncStorage } from 'react-native';
import { observer, inject } from "mobx-react";
const { height, width } = Dimensions.get('screen');

import theme from '../constants/Theme';

class Onboarding extends React.Component {
	componentWillMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

	} async componentDidMount() {
		const { navigation, DriverStore } = this.props;
		DriverStore.initializeHyperTrack();
		const driverObj = await AsyncStorage.getItem('driverObj');
		const flagTracking = await AsyncStorage.getItem('flagTracking');


		if (driverObj && JSON.parse(driverObj).id) {
			DriverStore.changeValues(JSON.parse(driverObj), 'driverObj');
			DriverStore.changeValues(flagTracking, 'flagTracking');

			if (flagTracking == 'true') {
				DriverStore.StartLocationTracking();
			} else {

			}
		}


		// this.focusListner = this.props.navigation.addListener("didFocus", async () => {
		// Update your data
		const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

		if (isLoggedIn == 'true' && isLoggedIn !== null && driverObj) {
			navigation.replace("Home");

		} else {

			setTimeout(function () {
				navigation.replace("SelectLanguage");
			}, 6000)
		}
		// });


	}


	handleBackButton = () => {
		Alert.alert(
			'Exit App',
			'Exiting the application?', [{
				text: 'Cancel',
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel'
			}, {
				text: 'OK',
				onPress: () => BackHandler.exitApp()
			},], {
				cancelable: false
			}
		)
		return true;
	}
	componentWillUnmount() {
		// remove event listener
		this.backHandler.remove()

	}
	render() {
		const { navigation, screenProps } = this.props;

		return (
			<Block flex style={styles.container}>
				<StatusBar barStyle="light-content" />

				<ImageBackground
					style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
					source={require('../assets/images/Group_38.png')}
				>
					<Block style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
						<Image
							style={{ height: 200, width: width / 1.5 }}

							resizeMode="contain"

							source={require("../assets/images/Image_6.png")} />

						<Text bold style={{ fontSize: 70, color: theme.COLORS.PRIMARY }}>{screenProps.localization.organisation_name}</Text>

					</Block>
				</ImageBackground>
			</Block>
		);
	}
}
export default inject("DriverStore")(observer(Onboarding));


const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.COLORS.WHITE,
	},
	padded: {
		paddingHorizontal: theme.SIZES.BASE * 2,
		position: 'relative',
		bottom: theme.SIZES.BASE,
	},
	button: {
		width: width - theme.SIZES.BASE * 4,
		height: theme.SIZES.BASE * 3,
		shadowRadius: 0,
		shadowOpacity: 0,
	},
});
