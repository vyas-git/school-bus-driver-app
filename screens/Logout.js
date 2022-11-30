import React from 'react';
import { ImageBackground, StyleSheet, StatusBar, Dimensions, Platform, KeyboardAvoidingView, AsyncStorage, ActivityIndicator } from 'react-native';
// galio component
import {
	Block, Button, Icon, NavBar, Text,
} from 'galio-framework';
import { materialTheme as theme } from '../constants';
import { observer, inject } from "mobx-react";

class LogoutScreen extends React.Component {
	constructor(props) {
		super(props);
		state = {
			"update": false
		}

	}
	componentWillUnmount() {

	}
	componentDidMount() {


		this.focusListner = this.props.navigation.addListener("didFocus", () => {
			// Update your data
			var that = this;
			setTimeout(function () {
				that.signOut();
			}, 5000)
		});
	}

	componentWillUnmount() {
		// remove event listener
		this.focusListner.remove();
	}
	render() {
		return (

			<Block flex={1} style={{ alignItems: "center", justifyContent: "center" }}>
				<Icon name="emoji-neutral" family="Entypo" style={{ color: theme.COLORS.ICON, fontSize: 100 }} />

				<Text style={{ fontSize: 30 }}>Signing Out...</Text>
				<Text style={{ fontSize: 10 }}>Please wait !!</Text>
			</Block>


		);
	}
	// Functions 
	async signOut() {
		const { navigation, StudentStore, DriverStore } = this.props;
		StudentStore.StudentsList = [];
		await AsyncStorage.setItem('isLoggedIn', '');
		await AsyncStorage.setItem('driverObj', '');
		await AsyncStorage.setItem('flagTracking', '');

		navigation.navigate("Account");
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',

	},

});
export default inject(["StudentStore"], ["DriverStore"])(observer(LogoutScreen));
