import React from 'react';
import { Platform, StatusBar, Text, AsyncStorage } from 'react-native';
import { Block, GalioProvider } from 'galio-framework';
import Screens from './navigation/Screens';
import { materialTheme } from './constants/';
import { arabic, english } from './constants/Localization';
import { Provider } from "mobx-react";
import stores from "./stores";
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import codePush from "react-native-code-push";
let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
import Geolocation from '@react-native-community/geolocation';
import SplashScreen from 'react-native-splash-screen'

// import * as Sentry from 'sentry-expo';
// var drawerPosition = "ar";

// Sentry.init({
// 	dsn: 'https://f6ae5547bb0c4fb4a7eb806fd07b1d7f@sentry.io/1767825',
// 	enableInExpoDevelopment: true,
// 	debug: true
// });
class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoadingComplete: true,
			fontLoaded: false,
			lg: 'ar'

		}
		// firebase.initializeApp({
		// 	//firebase config
		// 	apiKey: "AIzaSyC88Qj7pkh8Q3TiTDebQzkfmzVe6viNwvE",
		// 	authDomain: "awesome-project-58e26.firebaseapp.com",
		// 	databaseURL: "https://awesome-project-58e26.firebaseio.com",
		// 	projectId: "awesome-project-58e26",
		// 	storageBucket: "awesome-project-58e26.appspot.com",
		// 	messagingSenderId: "437130121696",
		// 	appId: "1:437130121696:web:275f8024b574d5aba91b85"
		// });
		OneSignal.init("e39bd3ea-21c1-4c6c-8f96-4bb95903b6bc");


		OneSignal.addEventListener('received', this.onReceived);
		OneSignal.addEventListener('opened', this.onOpened);
		OneSignal.addEventListener('ids', this.onIds);

	}
	async componentWillMount() {
		console.log("Store", stores);

		let lg = await AsyncStorage.getItem("langugage");
		drawerPosition = lg;
		if (lg == null) {
			lg = 'ar';
		}
		this.setState({ lg: lg })

		// await Font.loadAsync({
		// 	'Galio': require('./node_modules/galio-framework/src/fonts/galio.ttf')
		// });
		this.setState({ fontLoaded: true });
		Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: "always" });



	}

	componentDidMount() {
		SplashScreen.hide();

		codePush.sync({
			updateDialog: true,
			installMode: codePush.InstallMode.IMMEDIATE
		});

	}


	componentWillUnmount() {
		OneSignal.removeEventListener('received', this.onReceived);
		OneSignal.removeEventListener('opened', this.onOpened);
		OneSignal.removeEventListener('ids', this.onIds);
	}

	onReceived(notification) {
		console.log("Notification received: ", notification);
	}

	onOpened(openResult) {
		console.log('Message: ', openResult.notification.payload.body);
		console.log('Data: ', openResult.notification.payload.additionalData);
		console.log('isActive: ', openResult.notification.isAppInFocus);
		console.log('openResult: ', openResult);
	}

	onIds(device) {
		stores.DriverStore.pushToken = device.userId
		console.log('Device info: ', device);
	}
	render() {
		if (this.state.fontLoaded) {
			return (
				<Provider  {...stores}>

					<GalioProvider theme={materialTheme} localization={this.state.lg == 'ar' ? arabic : english}>
						<Block flex style={{
							backgroundColor: materialTheme.COLORS.WHITE,
						}}>
							{Platform.OS === 'ios' && <StatusBar barStyle="default" />}
							<Screens screenProps={{
								localization: this.state.lg == 'ar' ? arabic : english,
								language: this.state.lg,
								changeLanguage: (lg) => this.setState({ lg: lg })
							}} />

						</Block>

					</GalioProvider>
				</Provider>
			);
		} else {
			return (
				<Text>Loading....</Text>
			);
		}
	}
}
App = codePush(codePushOptions)(App);

export default App
