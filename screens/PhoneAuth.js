import * as React from 'react'
import { View, ScrollView, TextInput, Button, StyleSheet, Linking } from 'react-native';
import { Text } from "galio-framework";
// import * as firebase from 'firebase';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import theme from '../constants/Theme';
import { AsyncStorage } from 'react-native';
import qs from 'qs';
import * as firebase from 'firebase';


import { WebView } from 'react-native-webview';

const captchaUrl = 'https://mudarsati.com/phone-auth';

firebase.initializeApp({
	//firebase config
	apiKey: "AIzaSyC88Qj7pkh8Q3TiTDebQzkfmzVe6viNwvE",
	authDomain: "awesome-project-58e26.firebaseapp.com",
	databaseURL: "https://awesome-project-58e26.firebaseio.com",
	projectId: "awesome-project-58e26",
	storageBucket: "awesome-project-58e26.appspot.com",
	messagingSenderId: "437130121696",
	appId: "1:437130121696:web:275f8024b574d5aba91b85"
});

export default class PhoneAUth extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user: undefined,
			phone: '',
			confirmationResult: undefined,
			code: '',
			isWebView: true
		}
		firebase.auth().onAuthStateChanged(user => {
			this.setState({ user })
		})
	}
	componentDidMount() {
		const phone = this.props.navigation.state.params ? this.props.navigation.state.params.phone : "";
		if (this.state.user) {
			this.props.navigation.navigate("Home");
		}
		this.setState({ phone: phone });

	}
	onPhoneChange = (phone) => {
		this.setState({ phone })
	}
	_onNavigationStateChange(webViewState) {
		console.log(webViewState.url)
		this.onPhoneComplete(webViewState.url)
	}
	onPhoneComplete = async (url) => {
		let token = null
		console.log("ok");
		//WebBrowser.dismissBrowser()
		const tokenEncoded = parse(url).queryParams['token']
		if (tokenEncoded)
			token = decodeURIComponent(tokenEncoded)

		this.verifyCaptchaSendSms(token);


	}
	verifyCaptchaSendSms = async (token) => {
		if (token) {
			//	Linking.removeEventListener('url', listener)
			//WebBrowser.dismissBrowser()
			const { phone } = this.state
			//fake firebase.auth.ApplicationVerifier
			const captchaVerifier = {
				type: 'recaptcha',
				verify: () => Promise.resolve(token)
			}
			try {
				const confirmationResult = await firebase.auth().signInWithPhoneNumber(phone, captchaVerifier)
				console.log("confirmationResult" + JSON.stringify(confirmationResult));
				this.setState({ confirmationResult, isWebView: false })
			} catch (e) {
				console.warn(e)
			}

		}
	}

	onSignIn = async (code) => {
		const { confirmationResult } = this.state
		try {
			const result = await confirmationResult.confirm(code);
			this.setState({ result });
			await AsyncStorage.setItem('isLoggedIn', 'true');

			if (result.user.uid) {
				this.props.navigation.navigate("Home")
			}
		} catch (e) {
			console.warn(e)

			alert("Invalid Otp !!");
		}
	}
	onSignOut = async () => {
		try {
			await firebase.auth().signOut()
		} catch (e) {
			console.warn(e)
		}
	}
	reset = () => {
		this.setState({
			phone: '',
			phoneCompleted: false,
			confirmationResult: undefined,
			code: ''
		})
	}

	render() {
		const { screenProps } = this.props;
		if (this.state.isWebView)
			return (
				<WebView
					ref="webview"
					source={{ uri: captchaUrl }}
					onNavigationStateChange={this._onNavigationStateChange.bind(this)}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					injectedJavaScript={this.state.cookie}
					startInLoadingState={false}
				/>

			)
		else if (!this.state.confirmationResult)
			return (
				<ScrollView style={{ padding: 20, marginTop: 20 }}>
					<TextInput
						value={this.state.phone}
						onChangeText={this.onPhoneChange}
						keyboardType="phone-pad"
						placeholder="Your phone"
					/>
					<Button
						onPress={() => this.setState({ isWebView: true })}
						title="Next"
					/>
				</ScrollView>
			)
		else
			return (
				<ScrollView style={{ padding: 20, marginTop: 20 }}>
					<Text h4>
						{screenProps.localization.otp_sent_to} {this.state.phone}
					</Text>
					<Text>
						{screenProps.localization.enter_to}
					</Text>
					<OTPInputView
						style={{ width: '80%', height: 200 }}
						pinCount={6}
						// code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
						// onCodeChanged = {code => { this.setState({code})}}
						autoFocusOnLoad
						codeInputFieldStyle={styles.underlineStyleBase}
						codeInputHighlightStyle={styles.underlineStyleHighLighted}
						onCodeFilled={(code => {
							this.onSignIn(code);
						})}
						textContentType="oneTimeCode"

					/>
				</ScrollView>
			)
	}
}
function _removeScheme(url) {
	return url.replace(/^[a-zA-Z0-9+.-]+:\/\//, '');
}
function _removePort(url) {
	return url.replace(/(?=([a-zA-Z0-9+.-]+:\/\/)?[^/]):\d+/, '');
}
function _removeLeadingSlash(url) {
	return url.replace(/^\//, '');
}
function _removeTrailingSlash(url) {
	return url.replace(/\/$/, '');
}
function _removeTrailingSlashAndQueryString(url) {
	return url.replace(/\/?\?.*$/, '');
}
function parse(url) {
	if (!url) {
		throw new Error('parse cannot be called with a null value');
	}
	// iOS client sometimes strips out the port from the initial URL
	// even when it's included in the hostUri.
	// This function should be able to handle both cases, so we strip off the port
	// both here and from the hostUri.
	let decodedUrl = _removePort(decodeURI(url));
	let path;
	let queryParams = {};
	let queryStringMatchResult = decodedUrl.match(/(.*)\?(.+)/);
	if (queryStringMatchResult) {
		decodedUrl = queryStringMatchResult[1];
		queryParams = qs.parse(queryStringMatchResult[2]);
	}
	// strip off the hostUri from the host and path
	let hostUri = '';
	let hostUriStripped = _removePort(_removeTrailingSlashAndQueryString(hostUri));
	if (hostUriStripped && decodedUrl.indexOf(hostUriStripped) > -1) {
		path = decodedUrl.substr(decodedUrl.indexOf(hostUriStripped) + hostUriStripped.length);
	}
	else {
		path = _removeScheme(decodedUrl);
	}
	path = _removeLeadingSlash(path);
	if (false && !false && path.startsWith('--/')) {
		path = path.substr(3);
	}
	else if (path.indexOf('+') > -1) {
		path = path.substr(path.indexOf('+') + 1);
	}
	return { path, queryParams };
}
const styles = StyleSheet.create({
	borderStyleBase: {
		width: 30,
		height: 45
	},
	borderStyleHighLighted: {
		borderColor: theme.COLORS.PRIMARY,
	},
	underlineStyleBase: {
		width: 30,
		height: 45,
		borderWidth: 1,
		borderColor: theme.COLORS.DEFAULT,
		color: theme.COLORS.BLACK,

	},
	underlineStyleHighLighted: {
		borderColor: theme.COLORS.BLACK,
		color: theme.COLORS.BLACK,
	},
});