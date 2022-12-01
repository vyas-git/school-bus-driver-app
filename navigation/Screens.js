import React from 'react';
import { Easing, Animated, Platform, Text } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';


import OnboardingScreen from '../screens/Onboarding';
import SelectLanguage from '../screens/SelectLanguage';
import Account from '../screens/Account';
import Home from '../screens/Home';
import Alerts from '../screens/Alerts';
import LocationTracking from "../screens/LocationTracking";
import SendNotification from "../screens/SendNotification";
import AccountSettings from "../screens/AccountSettings";
import EditAccount from "../screens/EditAccount";
import PhoneAuth from "../screens/PhoneAuth";
import LogoutScreen from "../screens/Logout";

import Menu from './Menu';
import Header from '../components/Header';
import { Drawer } from '../components/';
import LoaderScreen from '../screens/LoaderScreen';
import Emergency from '../screens/Emergency';


const transitionConfig = (transitionProps, prevTransitionProps) => ({
	transitionSpec: {
		duration: 400,
		easing: Easing.out(Easing.poly(4)),
		timing: Animated.timing,
	},
	screenInterpolator: sceneProps => {
		const { layout, position, scene } = sceneProps;
		const thisSceneIndex = scene.index
		const width = layout.initWidth

		const scale = position.interpolate({
			inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
			outputRange: [4, 1, 1]
		})
		const opacity = position.interpolate({
			inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
			outputRange: [0, 1, 1],
		})
		const translateX = position.interpolate({
			inputRange: [thisSceneIndex - 1, thisSceneIndex],
			outputRange: [width, 0],
		})

		const scaleWithOpacity = { opacity }
		const screenName = "Search"

		if (screenName === transitionProps.scene.route.routeName ||
			(prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)) {
			return scaleWithOpacity;
		}
		return { transform: [{ translateX }] }
	}
})

const HomeStack = createStackNavigator({


	Onboarding: {
		screen: OnboardingScreen,
		navigationOptions: ({ navigation, screenProps }) => ({
			header: null,
		})
	},
	LoaderScreen: {
		screen: LoaderScreen,
		navigationOptions: ({ navigation, screenProps }) => ({
			header: <Header white navigation={navigation} left={<Text></Text>} />,
		})
	},
	PhoneAuth: {
		screen: PhoneAuth,
		navigationOptions: ({ navigation, screenProps }) => ({
			header: <Header white title={screenProps.localization.phoneauth} navigation={navigation} left={<Text></Text>} />,
		})
	},
	Account: {
		screen: Account,
		navigationOptions: ({ navigation, screenProps }) => ({
			header: <Header white title={screenProps.localization.account} navigation={navigation} left={<Text></Text>} />,
		})
	},

	AccountSettings: {
		screen: AccountSettings,
		navigationOptions: ({ navigation, screenProps }) => ({
			header: <Header white title={screenProps.localization.account_setting} navigation={navigation} left={<Text></Text>} />,
		})
	},



	EditAccount: {
		screen: EditAccount,
		navigationOptions: ({ navigation, screenProps }) => ({
			header: <Header white title={screenProps.localization.edit_account} navigation={navigation} left={<Text></Text>} />,
		})
	},

	SendNotification: {
		screen: SendNotification,
		navigationOptions: ({ navigation, screenProps }) => ({
			header: <Header white title={screenProps.localization.send_notification} navigation={navigation} left={<Text></Text>} />,
		})
	},
	LocationTracking: {
		screen: LocationTracking,
		navigationOptions: ({ navigation, screenProps }) => ({
			header: <Header white title={screenProps.localization.location} navigation={navigation} left={<Text></Text>} />,
		})
	},

	Alerts: {
		screen: Alerts,
		navigationOptions: ({ navigation, screenProps }) => ({
			header: <Header white title={screenProps.localization.alerts} navigation={navigation} left={<Text></Text>} />,
		})
	},
	Home: {
		screen: Home,
		navigationOptions: ({ navigation, screenProps }) => ({
			header: <Header white title={screenProps.localization.home} navigation={navigation} />,
		})
	},


	SelectLanguage: {
		screen: SelectLanguage,
		navigationOptions: ({ navigation, screenProps }) => ({
			header: <Header white title={screenProps.localization.select_langugage} navigation={navigation} left={<Text></Text>} />,
		})
	},
	Emergency: {
		screen: Emergency,
		navigationOptions: ({ navigation, screenProps }) => ({
			header: null,
		})
	},
	Logout: {
		screen: LogoutScreen,
		navigationOptions: ({ navigation, screenProps }) => ({
			header: <Header back black transparent title="Logout" navigation={navigation} />,
			headerTransparent: true,
		})
	}
},
	{
		cardStyle: {
			backgroundColor: '#EEEEEE', //this is the backgroundColor for the app
		},
		transitionConfig,
	});


const AppStack = createDrawerNavigator(
	{
		Stack: {
			screen: HomeStack,
		},
		Home: {
			screen: Home,
			navigationOptions: ({ navOpt, screenProps }) => ({
				drawerLabel: ({ focused }) => (
					<Drawer focused={focused} screen="Home" title="Home" label={screenProps.localization.home} />
				),
			}),
		},
		SendNotification: {
			screen: SendNotification,
			navigationOptions: ({ navOpt, screenProps }) => ({
				drawerLabel: ({ focused }) => (
					<Drawer focused={focused} screen="SendNotification" title="Send Notification" label={screenProps.localization.send_notification} />
				),
			}),
		},
		Alerts: {
			screen: Alerts,
			navigationOptions: ({ navOpt, screenProps }) => ({
				drawerLabel: ({ focused }) => (
					<Drawer focused={focused} screen="Alerts" title="Alerts" label={screenProps.localization.alerts} />
				),
			}),
		},

		AccountSettings: {
			screen: Alerts,
			navigationOptions: ({ navOpt, screenProps }) => ({
				drawerLabel: ({ focused }) => (
					<Drawer focused={focused} screen="AccountSettings" title="Settings" label={screenProps.localization.account_setting} />
				),
			}),
		},

		Logout: {
			screen: LogoutScreen,
			navigationOptions: ({ navOpt, screenProps }) => ({
				drawerLabel: ({ focused }) => (
					<Drawer focused={focused} screen="Logout" title="Logout" label={screenProps.localization.logout} />
				),
			}),
		},



	},
	Menu
);

const createSwitchAppStack = createSwitchNavigator(
	{
		App: AppStack,
		Home: HomeStack,
	},
	{
		initialRouteName: 'App',
	}
);

const App = createAppContainer(createSwitchAppStack);
export default App;
