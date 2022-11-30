import React from 'react';
import { I18nManager, StyleSheet, StatusBar, Dimensions, Image, TextInput, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import { Block, Text, Icon, Radio } from 'galio-framework';
const { height, width } = Dimensions.get('screen');
import theme from '../constants/Theme';
import FooterTabs from "./Footer";
import { observer, inject } from "mobx-react";
// import { Updates } from 'expo';
import RNRestart from 'react-native-restart'; // Import package from node modules


class AccountSettings extends React.Component {
	constructor(props) {
		super(props);
		const { screenProps } = this.props;

		this.state = {
			lg: false
		}
	}
	componentWillMount() {
		const { screenProps } = this.props;
		console.log("screenProps.language" + screenProps.language)
		this.setState({ lg: screenProps.language == "ar" ? true : false })
	}
	selectLanguage(lg) {
		const { navigation, screenProps } = this.props;

		this.setState({ lg: !this.state.lg });
		console.log("this.props" + JSON.stringify(this.props));
		screenProps.changeLanguage(lg);
		AsyncStorage.setItem('langugage', lg);
		//navigation.navigate("LoaderScreen", { text: "App Language Is Changing To" + lg == 'ar' ? " Arabic" : "English", route_name: "AccountSettings" });

		const isRTLAndroid = I18nManager.isRTL;
		console.log(isRTLAndroid);

		if (lg == 'ar' && !isRTLAndroid) {
			I18nManager.forceRTL(true);
			I18nManager.allowRTL(true);
			RNRestart.Restart();


		} else {
			I18nManager.forceRTL(false);
			I18nManager.allowRTL(false);
			RNRestart.Restart();



		}
	}

	render() {
		const { navigation, screenProps, DriverStore } = this.props;
		return (
			<Block flex style={[styles.container]}>
				<ScrollView>

					<Block flex style={[{ alignItems: 'flex-start', paddingTop: 100 }]}>
						<Block style={{ flexDirection: 'column' }}>
							<TouchableOpacity onPress={() => navigation.navigate('EditAccount')}>
								<Block onPress={() => navigation.navigate('EditAccount')} style={{ borderBottomWidth: 1, borderColor: theme.COLORS.PRIMARY, width: width - theme.SIZES.BASE * 4 }}
								>
									<Block style={{ marginBottom: 15 }}>
										<Text>
											{screenProps.localization.adjust_driver_account}
										</Text>
										<Icon name="angle-left" style={{ position: 'absolute', right: 0 }} color={theme.COLORS.PRIMARY} family="font-awesome" />
									</Block>
								</Block>
							</TouchableOpacity>

							<Block style={{ borderBottomWidth: 1, borderColor: theme.COLORS.PRIMARY, width: width - theme.SIZES.BASE * 4 }}>
								<Block style={{ marginBottom: 30 }}></Block>

								<Text >{screenProps.localization.select_langugage}</Text>
								<Block style={{ marginBottom: 15 }}></Block>

							</Block>
							<Block style={{ marginBottom: 10 }}></Block>
							<Block style={{ borderBottomWidth: 1, borderColor: theme.COLORS.PRIMARY, width: width - theme.SIZES.BASE * 4 }}
							>
								<Block style={{ marginBottom: 30 }}></Block>

								<Radio
									label={screenProps.localization.arabic}
									color={theme.COLORS.PRIMARY}
									active={this.state.lg}
									flexDirection='row'
									labelStyle={{ alignSelf: 'flex-end' }}
									radioOuterStyle={{ width: 30, height: 30, borderRadius: 15 }}
									radioInnerStyle={{ width: 15, height: 15, borderRadius: 7.5 }}
									labelStyle={{ fontSize: 18 }}
									onChange={() => this.selectLanguage('ar')}

								/>
								<Block style={{ marginBottom: 15 }}></Block>

							</Block>
							<Block style={{ marginBottom: 10 }}></Block>
							<Block style={{ borderBottomWidth: 1, borderColor: theme.COLORS.PRIMARY, width: width - theme.SIZES.BASE * 4 }}>
								<Block style={{ marginBottom: 30 }}></Block>

								<Radio
									label={screenProps.localization.english}
									color={theme.COLORS.PRIMARY}
									active={!this.state.lg}
									flexDirection='row'
									labelStyle={{ alignSelf: 'flex-end' }}
									radioOuterStyle={{ width: 30, height: 30, borderRadius: 15 }}
									radioInnerStyle={{ width: 15, height: 15, borderRadius: 7.5 }}
									labelStyle={{ fontSize: 18 }}
									onChange={() => this.selectLanguage('en')}


								/>
								<Block style={{ marginBottom: 15 }}></Block>

							</Block>
						</Block>


					</Block >
				</ScrollView>

				<FooterTabs navigation={navigation}></FooterTabs>
			</Block>


		);
	}
}
export default inject("DriverStore")(observer(AccountSettings));


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
});
