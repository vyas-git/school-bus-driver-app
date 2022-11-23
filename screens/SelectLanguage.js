import React from 'react';
import { ImageBackground, StyleSheet, StatusBar, Dimensions, AsyncStorage, TextInput, I18nManager } from 'react-native';
import { Block, Text, Icon, Button } from 'galio-framework';
import { Button as GaButton } from "../components/";
const { height, width } = Dimensions.get('screen');
import RNRestart from 'react-native-restart'; // Import package from node modules

import theme from '../constants/Theme';
import { materialTheme } from '../constants';

export default class SelectLanguage extends React.Component {
	componentDidMount() {
		const { navigation, screenProps } = this.props;

		const lg = AsyncStorage.getItem('langugage');
		const isRTLAndroid = I18nManager.isRTL;
		if (isRTLAndroid) {
			navigation.navigate("Account");

		}

	}
	async selectLanguage(lg) {
		const { navigation, screenProps } = this.props;

		screenProps.changeLanguage(lg);
		await AsyncStorage.setItem('langugage', lg);
		let languageText = lg == "ar" ? " Arabic" : "English";

		const isRTLAndroid = I18nManager.isRTL;

		if (lg == 'ar') {
			I18nManager.forceRTL(true);
			I18nManager.allowRTL(true);
			RNRestart.Restart();
		} else {
			let lang = lg == 'ar' ? " Arabic" : "English";
			let loadingText = "App Language Is Changing To " + lang
			navigation.navigate("LoaderScreen", { text: "App Language Is Changing To " + languageText, route_name: "Account" });

		}
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
						<TextInput
							editable={false}
							style={{ fontSize: 30, color: theme.COLORS.PRIMARY, borderBottomColor: theme.COLORS.PRIMARY, borderBottomColor: theme.COLORS.PRIMARY, borderBottomWidth: 1 }}>{screenProps.localization.select_langugage_arabic}</TextInput>
						<Block style={{ marginTop: 10 }}></Block>

						<TextInput
							editable={false}
							style={{ fontSize: 15, color: theme.COLORS.PRIMARY, borderBottomColor: theme.COLORS.PRIMARY, borderBottomColor: theme.COLORS.PRIMARY, borderBottomWidth: 1 }}>{screenProps.localization.select_langugage}</TextInput>

						<Block style={{ marginTop: 50 }}></Block>
						<GaButton
							onPress={() => this.selectLanguage('ar')}
							gradColors={[materialTheme.COLORS.GRADIENT_START, materialTheme.COLORS.GRADIENT_END]}
							textcolor={materialTheme.COLORS.BLACK}
							fontSize={20}
							round
							style={styles.button}
							gradient
							children={screenProps.localization.arabic} />
						<Block style={{ marginTop: 20 }}></Block>
						<Button
							onPress={() => this.selectLanguage('en')}
							round
							style={[styles.button, { borderColor: materialTheme.COLORS.PRIMARY, borderWidth: 1 }]}
							color={"transparent"}
						>
							<Text color={materialTheme.COLORS.BLACK}
							>
								{
									screenProps.localization.english
								}
							</Text></Button>

					</Block>
				</ImageBackground>
			</Block>
		);
	}
}

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
		width: width - theme.SIZES.BASE * 6,
		height: theme.SIZES.BASE * 3,
		shadowRadius: 0,
		shadowOpacity: 0,
	},
});
